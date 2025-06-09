-- Create users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create groups table
CREATE TABLE IF NOT EXISTS groups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create group_members table (for user-group relationships and roles)
CREATE TABLE IF NOT EXISTS group_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_id UUID REFERENCES groups(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'member')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(group_id, user_id)
);

-- Create tags table (now completely independent)
CREATE TABLE IF NOT EXISTS tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  color TEXT DEFAULT '#cccccc',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  UNIQUE(name)
);

-- Create group_tags table for many-to-many relationship
CREATE TABLE IF NOT EXISTS group_tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE NOT NULL,
  group_id UUID REFERENCES groups(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(tag_id, group_id)
);

-- Create currencies table
CREATE TABLE IF NOT EXISTS currencies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  symbol TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create expenses table (single source of truth)
CREATE TABLE IF NOT EXISTS expenses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  amount DECIMAL(10,2) NOT NULL,
  description TEXT NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  currency_id UUID REFERENCES currencies(id) ON DELETE RESTRICT NOT NULL,
  parent_id UUID REFERENCES expenses(id) ON DELETE CASCADE,
  created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS group_expenses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_id UUID REFERENCES groups(id) ON DELETE CASCADE NOT NULL,
  expense_id UUID REFERENCES expenses(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(group_id, expense_id)
);

-- Create expenses_tags table (for many-to-many relationship between expenses and tags)
CREATE TABLE IF NOT EXISTS expenses_tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  expense_id UUID REFERENCES expenses(id) ON DELETE CASCADE NOT NULL,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(expense_id, tag_id)
);

-- Create RLS policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_tags ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" 
  ON profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON profiles FOR UPDATE 
  USING (auth.uid() = id);

-- Group members can view profiles of other members in their groups
CREATE POLICY "Group members can view profiles of other members" 
  ON profiles FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM group_members gm1
      WHERE gm1.user_id = auth.uid()
      AND EXISTS (
        SELECT 1 FROM group_members gm2
        WHERE gm2.group_id = gm1.group_id
        AND gm2.user_id = profiles.id
      )
    )
  );

-- Groups policies
CREATE POLICY "Any authenticated user can create groups" 
  ON groups FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Group members can view their groups" 
  ON groups FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM group_members
      WHERE group_members.group_id = groups.id
      AND group_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Group admins can update their groups" 
  ON groups FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM group_members
      WHERE group_members.group_id = groups.id
      AND group_members.user_id = auth.uid()
      AND group_members.role = 'admin'
    )
  );

CREATE POLICY "Group admins can delete their groups" 
  ON groups FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM group_members
      WHERE group_members.group_id = groups.id
      AND group_members.user_id = auth.uid()
      AND group_members.role = 'admin'
    )
  );

-- Group members policies
CREATE POLICY "Group creators are automatically admins" 
  ON group_members FOR INSERT 
  WITH CHECK (
    (auth.uid() = user_id AND role = 'admin') OR
    EXISTS (
      SELECT 1 FROM group_members
      WHERE group_members.group_id = group_id
      AND group_members.user_id = auth.uid()
      AND group_members.role = 'admin'
    )
  );

CREATE POLICY "Group members can view other members" 
  ON group_members FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM group_members gm
      WHERE gm.group_id = group_members.group_id
      AND gm.user_id = auth.uid()
    )
  );

CREATE POLICY "Group admins can update members" 
  ON group_members FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM group_members
      WHERE group_members.group_id = group_id
      AND group_members.user_id = auth.uid()
      AND group_members.role = 'admin'
    )
  );

CREATE POLICY "Group admins can delete members" 
  ON group_members FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM group_members
      WHERE group_members.group_id = group_id
      AND group_members.user_id = auth.uid()
      AND group_members.role = 'admin'
    )
  );

-- Tags policies
CREATE POLICY "Anyone can view tags" 
  ON tags FOR SELECT 
  USING (true);

CREATE POLICY "Users can create tags" 
  ON tags FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update their own tags" 
  ON tags FOR UPDATE 
  USING (created_by = auth.uid());

CREATE POLICY "Users can delete their own tags" 
  ON tags FOR DELETE 
  USING (created_by = auth.uid());

-- Tags groups policies
CREATE POLICY "Group members can view group tags" 
  ON group_tags FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM group_members
      WHERE group_members.group_id = group_tags.group_id
      AND group_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Group members can add tags to groups" 
  ON group_tags FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM group_members
      WHERE group_members.group_id = group_id
      AND group_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Group admins can remove tags from groups" 
  ON group_tags FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM group_members
      WHERE group_members.group_id = group_id
      AND group_members.user_id = auth.uid()
      AND group_members.role = 'admin'
    )
  );

-- Expenses policies
CREATE POLICY "Users can view their own expenses" 
  ON expenses FOR SELECT 
  USING (created_by = auth.uid());

CREATE POLICY "Users can create expenses" 
  ON expenses FOR INSERT 
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own expenses" 
  ON expenses FOR UPDATE 
  USING (created_by = auth.uid());

CREATE POLICY "Users can delete their own expenses" 
  ON expenses FOR DELETE 
  USING (created_by = auth.uid());

-- Bill tags policies
CREATE POLICY "Users can view expense tags" 
  ON expenses_tags FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM expenses e
      LEFT JOIN group_expenses ge ON ge.expense_id = e.id
      LEFT JOIN group_members gm ON gm.group_id = ge.group_id
      WHERE e.id = expenses_tags.expense_id
      AND (
        e.created_by = auth.uid() OR
        (gm.user_id = auth.uid() AND ge.group_id = gm.group_id)
      )
    )
  );

CREATE POLICY "Expense creators can add tags to their expenses" 
  ON expenses_tags FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM expenses
      WHERE expenses.id = expense_id
      AND expenses.created_by = auth.uid()
    )
  );

CREATE POLICY "Expense creators can remove tags from their expenses" 
  ON expenses_tags FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM expenses
      WHERE expenses.id = expense_id
      AND expenses.created_by = auth.uid()
    )
  );

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();