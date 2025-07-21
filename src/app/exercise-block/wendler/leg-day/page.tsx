"use server";

import { requireLoggedInUser, supabaseRPC } from "@/serverUtil";
import React, { Suspense } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import AddLegDay from "@/app/exercise-block/wendler/leg-day/_components/AddLegDay";

const WendlerPage = async () => {
  const { userId } = await requireLoggedInUser(
    "/exercise-block/wendler/leg-day"
  );
  const [prereqData, wendlerMaxesData] = await Promise.all([
    supabaseRPC("check_wendler_block_prereqs", {
      p_user_id: userId,
      p_exercise_type: "barbell_back_squat",
    }),
    supabaseRPC("get_wendler_maxes", {
      p_user_id: userId,
      p_exercise_type: "barbell_back_squat",
    }),
  ]);

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
      <Breadcrumbs pathname="/exercise-block/wendler" />
      <Suspense fallback={<div>Loading wendler block...</div>}>
        <WendlerPage />
      </Suspense>
    </React.Fragment>
  );
}
