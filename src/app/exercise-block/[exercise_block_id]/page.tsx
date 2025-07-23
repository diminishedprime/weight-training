"use server";

import WendlerBlockTable from "@/app/exercise-block/[exercise_block_id]/_components/WendlerBlockTable";
import Breadcrumbs from "@/components/Breadcrumbs";
import {
  requireLoggedInUser,
  requirePreferences,
  supabaseRPC,
} from "@/serverUtil";
import { Stack } from "@mui/material";
import React, { Suspense } from "react";

type ExerciseBlockProps = {
  exercise_block_id: string;
};

const ExerciseBlock: React.FC<ExerciseBlockProps> = async ({
  exercise_block_id,
}) => {
  const { userId } = await requireLoggedInUser(
    `/exercise-block/${exercise_block_id}`,
  );

  const [blockData, metadata, userPreferences] = await Promise.all([
    supabaseRPC("get_wendler_block", {
      p_block_id: exercise_block_id,
      p_user_id: userId,
    }),
    supabaseRPC("get_wendler_metadata", {
      p_block_id: exercise_block_id,
      p_user_id: userId,
    }),
    await requirePreferences(
      userId,
      ["available_plates_lbs"],
      `/exercise-block/${exercise_block_id}`,
    ),
  ]);

  // Optionally validate blockData shape here
  return (
    <Stack>
      <WendlerBlockTable
        block={blockData}
        metadata={metadata}
        availablePlates={userPreferences.available_plates_lbs}
      />
    </Stack>
  );
};

type SuspenseWrapperProps = {
  params: Promise<{ exercise_block_id: string }>;
};

export default async function SuspenseWrapper(props: SuspenseWrapperProps) {
  const { exercise_block_id: unnarrowedExerciseBlockId } = await props.params;

  return (
    <React.Fragment>
      <Breadcrumbs
        pathname={`/exercise-block/${unnarrowedExerciseBlockId}`}
        labels={{
          [unnarrowedExerciseBlockId]: unnarrowedExerciseBlockId.slice(0, 8),
        }}
      />
      <Suspense fallback={<div>Loading exercise block...</div>}>
        <ExerciseBlock exercise_block_id={unnarrowedExerciseBlockId} />
      </Suspense>
    </React.Fragment>
  );
}
