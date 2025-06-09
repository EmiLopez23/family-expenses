"use server";

import { createClient } from "@/utils/supabase/server";
import { createGroupSchema } from "@/lib/schema";
import { redirect } from "next/navigation";
import { insertGroup } from "@/lib/data";

export const createGroup = async (formData: FormData) => {
  const rawFormData = {
    name: formData.get("name") as string,
    description: formData.get("description") as string,
    members: JSON.parse(formData.get("members") as string) as string[],
  };

  // Validate the form data
  const validatedFields = createGroupSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    throw new Error("Invalid form data");
  }

  let groupId: string;

  try {
    // Create the group
    const group = await insertGroup(validatedFields.data);
    groupId = group.id;
  } catch (error) {
    console.error("Error creating group:", error);
    throw new Error("Failed to create group");
  }

  redirect(`/groups/${groupId}`);
};
