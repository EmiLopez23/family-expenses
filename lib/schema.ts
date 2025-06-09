import { z } from "zod";

// Profile Schema
export const profileSchema = z.object({
  id: z.string().uuid(),
  full_name: z.string().nullable(),
  avatar_url: z.string().nullable(),
  created_at: z.date(),
  updated_at: z.date(),
});

// Group Schema
export const groupSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string().nullable(),
  created_at: z.date(),
  updated_at: z.date(),
});

// Group Member Schema
export const groupMemberSchema = z.object({
  id: z.string().uuid(),
  group_id: z.string().uuid(),
  user_id: z.string().uuid(),
  role: z.enum(["admin", "member"]),
  created_at: z.date(),
});

// Currency Schema
export const currencySchema = z.object({
  id: z.string().uuid(),
  code: z.string(),
  name: z.string(),
  symbol: z.string(),
  created_at: z.date(),
});

// Tag Schema
export const tagSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  color: z.string().default("#cccccc"),
  created_at: z.date(),
  created_by: z.string().uuid(),
});

export const createTagSchema = tagSchema.omit({
  id: true,
  created_at: true,
  created_by: true,
});

export const createGroupSchema = groupSchema
  .merge(
    z.object({
      members: z
        .array(z.string().uuid())
        .min(1, "Al menos debes seleccionar un miembro"),
    })
  )
  .omit({
    id: true,
    created_at: true,
    updated_at: true,
  });

// Group Tag Schema
export const groupTagSchema = z.object({
  id: z.string().uuid(),
  tag_id: z.string().uuid(),
  group_id: z.string().uuid(),
  created_at: z.date(),
});

// Expense Schema
export const expenseSchema = z.object({
  id: z.string().uuid(),
  amount: z.number().positive().min(0.01),
  description: z.string().min(1),
  date: z.date(),
  currency_id: z.string().uuid(),
  parent_id: z.string().uuid().nullable(),
  created_by: z.string().uuid(),
  created_at: z.date(),
  updated_at: z.date(),
  tags: z.array(tagSchema).nullable(),
});

export const createExpenseSchema = expenseSchema
  .merge(
    z.object({
      date: z.string().datetime(),
    })
  )
  .omit({
    id: true,
    created_at: true,
    updated_at: true,
    tags: true,
  });

// Group Expense Schema
export const groupExpenseSchema = z.object({
  id: z.string().uuid(),
  group_id: z.string().uuid(),
  expense_id: z.string().uuid(),
  created_at: z.date(),
});

// Expense Tag Schema
export const expenseTagSchema = z.object({
  id: z.string().uuid(),
  expense_id: z.string().uuid(),
  tag_id: z.string().uuid(),
  created_at: z.date(),
});

// Types
export type Profile = z.infer<typeof profileSchema>;
export type Group = z.infer<typeof groupSchema>;
export type GroupMember = z.infer<typeof groupMemberSchema>;
export type Currency = z.infer<typeof currencySchema>;
export type Tag = z.infer<typeof tagSchema>;
export type GroupTag = z.infer<typeof groupTagSchema>;
export type Expense = z.infer<typeof expenseSchema>;
export type GroupExpense = z.infer<typeof groupExpenseSchema>;
export type ExpenseTag = z.infer<typeof expenseTagSchema>;
export type CreateExpense = z.infer<typeof createExpenseSchema>;
export type CreateTag = z.infer<typeof createTagSchema>;
export type CreateGroup = z.infer<typeof createGroupSchema>;
