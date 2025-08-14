"use server";

import { Database } from "@/database.types";
import { supabaseRPC } from "@/serverUtil";

export async function rpcMutationAction<
  T extends keyof Database["public"]["Functions"],
  Args extends Database["public"]["Functions"][T]["Args"],
  Return = Database["public"]["Functions"][T]["Returns"],
>(fnName: T, rpcArgs: Args): Promise<Return> {
  return await supabaseRPC<T, Args, Return>(fnName, rpcArgs);
}
