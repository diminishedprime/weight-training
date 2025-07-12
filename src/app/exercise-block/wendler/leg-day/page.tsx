"use server";

import { getSupabaseClient, requireLoggedInUser } from "@/serverUtil";
import React, { Suspense } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import AddLegDay from "@/app/exercise-block/wendler/leg-day/_components/AddLegDay";

const WendlerPage = async () => {
  const { userId } = await requireLoggedInUser(
    "/exercise-block/wendler/leg-day"
  );
  const supabase = getSupabaseClient();
  const [
    { data: prereqData, error: prereqError },
    { data: wendlerMaxesData, error: wendlerMaxesError },
  ] = await Promise.all([
    supabase.rpc("check_wendler_block_prereqs", {
      p_user_id: userId,
      p_exercise_type: "barbell_back_squat",
    }),
    supabase.rpc("get_wendler_maxes", {
      p_user_id: userId,
      p_exercise_type: "barbell_back_squat",
    }),
  ]);

  if (prereqError) {
    throw new Error(
      `Error checking Wendler block prerequisites: ${prereqError.message}`
    );
  }

  if (wendlerMaxesError) {
    throw new Error(
      `Error fetching Wendler maxes: ${wendlerMaxesError.message}`
    );
  }

  return (
    <AddLegDay
      prereqs={prereqData}
      wendlerMaxesData={wendlerMaxesData}
      userId={userId}
      pathToRevalidate={"/exercise-block/wendler/leg-day"}
    />
  );
};

export default async function SuspenseWrapper() {
  return (
    <React.Fragment>
      <Breadcrumbs
        pathname="/exercise-block/wendler"
        nonLinkable={["exercise-block"]}
      />
      <Suspense fallback={<div>Loading wendler block...</div>}>
        <WendlerPage />
      </Suspense>
    </React.Fragment>
  );
}
