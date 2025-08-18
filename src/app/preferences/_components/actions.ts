"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const afterUpdateAction = async (backTo: string | null) => {
  revalidatePath("/preferences");
  if (backTo) {
    redirect(backTo);
  }
};
