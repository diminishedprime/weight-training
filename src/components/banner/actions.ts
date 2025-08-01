"use server";

import { signIn as authSignIn, signOut as authSignOut } from "@/auth";

export async function signIn() {
  await authSignIn("google");
}

export async function signOut() {
  await authSignOut();
}
