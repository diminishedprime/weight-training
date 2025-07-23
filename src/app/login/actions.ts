"use server";
import { signIn } from "@/auth";

export async function loginAction(redirectUri: string, _: FormData) {
  await signIn("google", { redirectTo: redirectUri });
}
