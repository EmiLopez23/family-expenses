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

// Tag Schema
export const tagSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  color: z.string().default("#cccccc"),
  group_id: z.string().uuid(),
  created_at: z.date(),
});

// Expense Schema
export const expenseSchema = z.object({
  id: z.string().uuid(),
  group_id: z.string().uuid(),
  user_id: z.string().uuid(),
  amount: z.number().positive(),
  description: z.string(),
  date: z.date(),
  created_at: z.date(),
  updated_at: z.date(),
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
export type Tag = z.infer<typeof tagSchema>;
export type Expense = z.infer<typeof expenseSchema>;
export type ExpenseTag = z.infer<typeof expenseTagSchema>;
