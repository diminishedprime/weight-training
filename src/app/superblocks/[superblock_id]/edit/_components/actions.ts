"use server";
import { Paths } from "@/constants";
import { revalidatePath } from "next/cache";

export const revalidatePaths = async (superblockId: string) => {
  revalidatePath(Paths.Superblocks);
  revalidatePath(Paths.Superblocks_SuperblockId(superblockId));
  revalidatePath(Paths.Superblocks_SuperblockId_Edit(superblockId));
  revalidatePath(Paths.Superblocks_SuperblockId_Perform(superblockId));
};
