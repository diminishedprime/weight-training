// get_wendler_programs

import { RequiredNonNullable } from "@/common-types";
import { Database } from "@/database.types";

// Friendly type names. the Ls are "local"
type LWendlerProgramsResult =
  Database["public"]["Functions"]["get_wendler_program_overviews"]["Returns"];
type LWendlerProgramOverviews = NonNullable<
  LWendlerProgramsResult["program_overviews"]
>;
type LWendlerProgramOverview = LWendlerProgramOverviews[number];
type LWendlerMovementOverviews = NonNullable<
  LWendlerProgramOverview["movement_overviews"]
>;
type LWendlerMovementOverview = LWendlerMovementOverviews[number];

// Narrowing down. LRNN = Local Required Non-Nullable
type LRNNWendlerMovementOverview = RequiredNonNullable<
  LWendlerMovementOverview,
  | "id"
  | "weight_unit"
  | "training_max_value"
  | "increase_amount_value"
  | "exercise_type"
>;

type LRNNWendlerProgramOverview = RequiredNonNullable<
  Omit<LWendlerProgramOverview, "movement_overviews"> & {
    movement_overviews: LRNNWendlerMovementOverview[];
  },
  "id" | "name" | "user_id"
>;

export type WendlerProgramOverview = LRNNWendlerProgramOverview;
export type WendlerProgramOverviews = WendlerProgramOverview[];

export type GetWendlerProgramsResult = RequiredNonNullable<
  Omit<LWendlerProgramsResult, "program_overviews"> & {
    program_overviews: WendlerProgramOverviews;
  },
  "page_count"
>;
