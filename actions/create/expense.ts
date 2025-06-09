"use server";
import { createExpense } from "@/lib/data";
import { createExpenseSchema } from "@/lib/schema";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const createExpenseAction = async (
  formData: FormData,
  groups: string[],
  tags: string[]
) => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const validatedFields = createExpenseSchema.safeParse({
    amount: Number(formData.get("amount")),
    description: formData.get("description") as string,
    currency_id: formData.get("currency_id") as string,
    date: formData.get("date") as string,
    created_by: user?.id,
    parent_id: null,
  });

  if (!validatedFields.success) {
    throw new Error(validatedFields.error.message);
  }

  await createExpense(validatedFields.data, groups, tags);

  revalidatePath("/");
  redirect("/");
};
