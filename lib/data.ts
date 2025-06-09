import { createClient } from "@/utils/supabase/server";
import postgres from "postgres";
import {
  Currency,
  Expense,
  Group,
  Tag,
  Profile,
  CreateGroup,
  CreateExpense,
} from "./schema";

// need to do everything in here so we just use one sql client instance
const sql = postgres(process.env.DATABASE_URL!, {
  idle_timeout: 20,
  max_lifetime: 60 * 30,
});

export const fetchCardData = async (
  startDate: string,
  endDate: string
): Promise<
  {
    title: string;
    value: number;
    type: "expenses";
  }[]
> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not found");
  }

  const expensesSum = await sql<{ total: number }[]>`
    SELECT SUM(amount) as total FROM expenses
    WHERE created_by = ${user.id}
    AND date between ${startDate} and ${endDate}
  `;

  return [
    {
      title: "Gastos totales",
      value: expensesSum[0].total,
      type: "expenses",
    },
  ];
};

export const fetchGroupCardData = async (
  startDate: string,
  endDate: string,
  groupId: string
): Promise<
  {
    title: string;
    value: number;
    type: "expenses";
  }[]
> => {
  const supabase = await createClient();

  const expensesSum = await sql<{ total: number }[]>`
    SELECT SUM(amount) as total 
    FROM expenses e
    LEFT JOIN group_expenses ge ON e.id = ge.expense_id
    WHERE ge.group_id = ${groupId}
    AND date between ${startDate} and ${endDate}
  `;

  return [
    {
      title: "Gastos totales",
      value: expensesSum[0].total,
      type: "expenses",
    },
  ];
};

export const fetchUserExpenses = async (startDate: string, endDate: string) => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not found");
  }

  const expenses = await sql<Expense[]>`
    SELECT *
    FROM expenses
    WHERE created_by = ${user.id}
    AND date between ${startDate} and ${endDate}
    ORDER BY date DESC, created_at DESC
    LIMIT 10
  `;

  const completeExpenses = await Promise.all(
    expenses.map(async (expense) => {
      const tags = await sql<Tag[]>`
        SELECT t.* FROM tags t
        LEFT JOIN expenses_tags et ON t.id = et.tag_id
        WHERE et.expense_id = ${expense.id}
      `;

      return { ...expense, tags };
    })
  );

  return completeExpenses;
};

export const fetchGroupExpenses = async (
  startDate: string,
  endDate: string,
  groupId: string
) => {
  const supabase = await createClient();

  const expenses = await sql<Expense[]>`
    SELECT * FROM expenses e
    LEFT JOIN group_expenses ge ON e.id = ge.expense_id
    WHERE ge.group_id = ${groupId}
    AND date between ${startDate} and ${endDate}
    ORDER BY date DESC
  `;

  const completeExpenses = await Promise.all(
    expenses.map(async (expense) => {
      const tags = await sql<Tag[]>`
      SELECT t.* FROM tags t
      LEFT JOIN expenses_tags et ON t.id = et.tag_id
      WHERE et.expense_id = ${expense.id}
    `;

      return { ...expense, tags };
    })
  );

  return completeExpenses;
};

export const fetchCurrencies = async () => {
  try {
    const currencies = await sql<Currency[]>` 
      SELECT * FROM currencies
    `;
    return currencies;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch currencies");
  }
};

export const fetchUserTags = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not found");
  }

  const tags = await sql<Tag[]>`
    SELECT * FROM tags
    WHERE created_by = ${user.id} OR created_by IS NULL
  `;

  return tags;
};

export const fetchUserGroups = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not found");
  }

  const groups = await sql<Group[]>`
    SELECT g.* FROM groups g
    LEFT JOIN group_members gm ON g.id = gm.group_id
    WHERE gm.user_id = ${user.id}
  `;

  return groups;
};

export const fetchUsers = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not found");
  }

  // Fetch all users except the current user
  const users = await sql<Profile[]>`
    SELECT * FROM profiles
    WHERE id != ${user.id}
    ORDER BY full_name ASC
  `;

  return users;
};

export const insertGroup = async (newGroup: CreateGroup): Promise<Group> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not found");
  }

  const { name, description, members } = newGroup;

  const group = await sql.begin(async (tx) => {
    const [group] = await tx`
      INSERT INTO groups (name, description)
      VALUES (${name}, ${description})
      RETURNING id
    `;

    // Add the creator as admin
    await tx`
      INSERT INTO group_members (group_id, user_id, role)
      VALUES (${group.id}, ${user.id}, 'admin')
    `;

    // Add selected members
    for (const memberId of members) {
      await tx`
        INSERT INTO group_members (group_id, user_id, role)
        VALUES (${group.id}, ${memberId}, 'member')
      `;
    }

    return group;
  });

  // @ts-expect-error - group is not typed
  return group;
};

export const getGroup = async (id: string): Promise<Group> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not found");
  }

  // ensure group exists and user is a member
  const [group] = await sql<Group[]>`
    SELECT g.*
    FROM groups g
    LEFT JOIN group_members gm ON g.id = gm.group_id
    WHERE g.id = ${id} AND gm.user_id = ${user.id}
  `;

  return group;
};

export const createExpense = async (
  expense: CreateExpense,
  groups: string[],
  tags: string[]
) => {
  const newExpense = await sql.begin(async (tx) => {
    const [exp] = await tx`
      INSERT INTO expenses (amount, description, currency_id, date, created_by, parent_id)
      VALUES (${expense.amount}, ${expense.description}, ${expense.currency_id}, ${expense.date}, ${expense.created_by}, ${expense.parent_id})
      RETURNING id
    `;

    console.log(exp);

    // insert groups and tags in parallel
    await Promise.all([
      groups.map(async (group) => {
        await tx`
        INSERT INTO group_expenses (group_id, expense_id)
        VALUES (${group}, ${exp.id})
      `;
      }),
      tags.map(async (tag) => {
        await tx`
        INSERT INTO expenses_tags (expense_id, tag_id)
        VALUES (${exp.id}, ${tag})
      `;
      }),
    ]);

    return exp;
  });

  return newExpense;
};
