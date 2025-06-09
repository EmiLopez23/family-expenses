"use server";

import { createTagSchema } from "@/lib/schema";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function createTag(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const validatedFields = createTagSchema.safeParse({
    name: formData.get("name"),
    color: formData.get("color"),
  });

  if (!validatedFields.success) {
    return { error: "Invalid fields" };
  }

  const { error } = await supabase.from("tags").insert(validatedFields.data);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/tags");
  redirect("/tags");
}
