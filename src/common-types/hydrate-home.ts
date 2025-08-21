import { RequiredNonNullable } from "@/common-types";
import { Database } from "@/database.types";

type HydrateHomeDatabase =
  Database["public"]["Functions"]["hydrate_home"]["Returns"];

type RecentRecordDatabase = NonNullable<
  HydrateHomeDatabase["recent_records"]
>[number];

type RecentSuperblocksDatabase = NonNullable<
  HydrateHomeDatabase["recent_superblocks"]
>[number];

type HydrateHomeRecentRecord = RequiredNonNullable<
  RecentRecordDatabase,
  "exercise_type" | "recorded_at" | "value" | "id" | "equipment_type" | "reps"
>;

type HydrateHomeRecentSuperblock = RequiredNonNullable<
  RecentSuperblocksDatabase,
  | "id"
  | "name"
  | "total_volume"
  | "total_sets"
  | "total_blocks"
  | "started_at"
  | "completed_at"
>;

export type HydrateHome = RequiredNonNullable<
  Omit<HydrateHomeDatabase, "recent_records" | "recent_superblocks"> & {
    recent_records: HydrateHomeRecentRecord[];
    recent_superblocks: HydrateHomeRecentSuperblock[];
  },
  "user_id"
>;
