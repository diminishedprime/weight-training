"use server";

import { Paths } from "@/constants";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const bustCache = async (backTo?: string) => {
  revalidatePath(Paths.Preferences_RestTimes);
  if (backTo) {
    redirect(backTo);
  }
};
