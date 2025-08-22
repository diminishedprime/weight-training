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

export type HydrateHomeRecentRecord = RequiredNonNullable<
  RecentRecordDatabase,
  "exercise_type" | "recorded_at" | "value" | "id" | "equipment_type" | "reps"
>;

export type HydrateHomeRecentSuperblock = RequiredNonNullable<
  RecentSuperblocksDatabase,
  | "id"
  | "name"
  | "total_volume"
  | "total_sets"
  | "total_blocks"
  | "started_at"
  | "completed_at"
>;

// hydrated_home_powerlifting_total

type PowerliftingRecentDatabase = NonNullable<
  HydrateHomePowerliftingDatabase["recent"]
>;

export type HydratedHomePowerliftingTotal = RequiredNonNullable<
  PowerliftingRecentDatabase,
  "id" | "total_weight"
>;

type HydrateHomePowerliftingDatabase = NonNullable<
  HydrateHomeDatabase["powerlifting"]
>;

export type HydrateHomePowerlifting = RequiredNonNullable<
  Omit<HydrateHomePowerliftingDatabase, "recent" | "record"> & {
    recent: HydratedHomePowerliftingTotal;
    record: HydratedHomePowerliftingTotal;
  },
  "id"
>;

export type HydrateHome = RequiredNonNullable<
  Omit<
    HydrateHomeDatabase,
    "recent_records" | "recent_superblocks" | "powerlifting"
  > & {
    recent_records: HydrateHomeRecentRecord[];
    recent_superblocks: HydrateHomeRecentSuperblock[];
    powerlifting: HydrateHomePowerlifting;
  },
  "user_id"
>;
