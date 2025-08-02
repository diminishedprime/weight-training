import PerformClient from "@/app/superblocks/[superblock_id]/perform/_components/PerformClient";
import { GetPerformSuperblockResult } from "@/common-types";
import { PATHS } from "@/constants";
import { requirePreferences, type UserPreferencesKeys } from "@/serverUtil";
import React from "react";

interface PagePerformProps {
  userId: string;
  superblock: GetPerformSuperblockResult;
}
export default async function PagePerform(props: PagePerformProps) {
  // TODO: (easy) this should be cleaned up, or at least moved to a
  // helper-function in this file.
  const { superblock } = props;
  const requiredPreferencesKeys = superblock.blocks
    .map((block) => {
      if (block.exercises.length === 0) {
        return [] as UserPreferencesKeys[];
      }
      const firstExercise = block.exercises[0];
      switch (firstExercise.equipment_type) {
        case "barbell":
          return ["available_plates_lbs"] as UserPreferencesKeys[];
        case "dumbbell":
          return ["available_dumbbells_lbs"] as UserPreferencesKeys[];
        case "kettlebell":
          return ["available_kettlebells_lbs"] as UserPreferencesKeys[];
        default:
          return [] as UserPreferencesKeys[];
      }
    })
    // Feels like a hack but this works.
    .flat();

  const preferences = await requirePreferences(
    props.userId,
    requiredPreferencesKeys,
    PATHS.Superblocks_Id_Perform(superblock.id),
  );

  return (
    <React.Fragment>
      <PerformClient
        userId={props.userId}
        initialSuperblock={superblock}
        preferences={preferences}
      />
    </React.Fragment>
  );
}
