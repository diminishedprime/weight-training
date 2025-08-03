import { Database } from "@/database.types";
import { RequiredNonNullable } from ".";

type LRecentSetOverviewsResult =
  Database["public"]["Functions"]["recent_set_overviews"]["Returns"];

type LRecentSetOverviews = NonNullable<LRecentSetOverviewsResult["overviews"]>;
type LRecentSetOverview = LRecentSetOverviews[number];

type RNNRecentSetOverview = RequiredNonNullable<
  LRecentSetOverview,
  "average_reps" | "average_weight" | "started_at"
>;

type RNNRecentSetOverviews = RNNRecentSetOverview[];

export type RecentSetOverviewsResult = Omit<
  LRecentSetOverviewsResult,
  "overviews"
> & {
  overviews: RNNRecentSetOverviews;
};
