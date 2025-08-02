import { Database } from "@/database.types";
import { GetPerformSuperblockResult, RequiredNonNullable } from ".";

type LSetActiveBlockResult =
  Database["public"]["Functions"]["set_active_block"]["Returns"];

type RNNSetActiveBlockResult = RequiredNonNullable<
  Omit<LSetActiveBlockResult, "superblock"> & {
    superblock: GetPerformSuperblockResult;
  },
  "active_block_id"
>;

export type SetActiveBlockResult = RNNSetActiveBlockResult;
