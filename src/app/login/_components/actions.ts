"use server";
import { signIn } from "@/auth";

export async function loginAction(redirectUri: string) {
  await signIn("google", { redirectTo: redirectUri });
}
