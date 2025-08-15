import { RequiredNonNullable } from "@/common-types";
import { Database } from "@/database.types";

type LRecentSetOverviewsResult =
  Database["public"]["Functions"]["recent_set_overviews"]["Returns"];

type LRecentSetOverviews = NonNullable<LRecentSetOverviewsResult["overviews"]>;
type LRecentSetOverview = NonNullable<LRecentSetOverviews[number]>;
type LRecentSetOverviewExercises = NonNullable<LRecentSetOverview["exercises"]>;
type LRecentSetOverviewExercise = NonNullable<
  LRecentSetOverviewExercises[number]
>;

export type RecentSetOverviewExercise = RequiredNonNullable<
  LRecentSetOverviewExercise,
  "completion_status" | "reps" | "weight"
>;

export type RecentSetOverview = RequiredNonNullable<
  Omit<LRecentSetOverview, "exercises"> & {
    exercises: RecentSetOverviewExercise[];
  },
  "started_at"
>;

export type RecentSetOverviews = RecentSetOverview[];

export type RecentSetOverviewsResult = Omit<
  LRecentSetOverviewsResult,
  "overviews"
> & {
  overviews: RecentSetOverviews;
};
