"use server";
import { Database } from "@/database.types";

export async function addLegDaySuperblock(
  _training_max: number,
  _wendler_cycle: Database["public"]["Enums"]["wendler_cycle_type_enum"],
  _: FormData
) {
  throw new Error("Not implemented yet");
}
