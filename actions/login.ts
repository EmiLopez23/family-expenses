"use server";
import { type Provider } from "@supabase/auth-js";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

const signInWith = (provider: Provider) => async (): Promise<void> => {
  const origin = (await headers()).get("origin");
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${origin}/auth/callback`,
    },
  });
  if (error) {
    throw new Error(error.message);
  }

  redirect(data.url);
};

const signInWithGoogle = signInWith("google");

export { signInWithGoogle };
