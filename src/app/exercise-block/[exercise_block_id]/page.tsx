"use server";

import React, { Suspense } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Stack } from "@mui/material";
import WendlerBlockTable from "@/app/exercise-block/[exercise_block_id]/_components/WendlerBlockTable";
import type { WendlerBlock, WendlerMetadata } from "@/common-types";
import { getSupabaseClient, requireLoggedInUser } from "@/serverUtil";

type ExerciseBlockProps = {
  exercise_block_id: string;
};

const ExerciseBlock: React.FC<ExerciseBlockProps> = async ({
  exercise_block_id,
}) => {
  const { userId } = await requireLoggedInUser(
    `/exercise-block/${exercise_block_id}`
  );
  const supabase = getSupabaseClient();

  const [
    { data: blockData, error: blockError },
    { data: metadataData, error: metadataError },
  ] = await Promise.all([
    supabase.rpc("get_wendler_block", {
      p_block_id: exercise_block_id,
      p_user_id: userId,
    }),
    supabase.rpc("get_wendler_metadata", {
      p_block_id: exercise_block_id,
      p_user_id: userId,
    }),
  ]);

  if (blockError) {
    throw new Error("Error fetching block data");
  }

  if (metadataError) {
    throw new Error("Error fetching metadata data");
  }

  // Optionally validate blockData shape here
  return (
    <Stack>
      <WendlerBlockTable
        block={blockData as WendlerBlock}
        metadata={metadataData as WendlerMetadata}
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
        nonLinkable={["exercise-block"]}
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
