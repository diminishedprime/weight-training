import PerformClient from "@/app/superblocks/[superblock_id]/perform/_components/PerformClient";
import { GetPerformSuperblockResult } from "@/common-types";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Paths } from "@/constants";
import {
  requireLoggedInUser,
  requirePreferences,
  supabaseRPC,
  UserPreferencesKeys,
} from "@/serverUtil";
import { notFound } from "next/navigation";
import React from "react";

interface Props {
  params: Promise<{ superblock_id: string }>;
}

export default async function Superblocks_SuperblockId_Perform(props: Props) {
  const { superblock_id: superblockId } = await props.params;
  const { userId } = await requireLoggedInUser(
    Paths.Superblocks_SuperblockId_Perform(superblockId),
  );
  const superblock = await getPerformSuperblock(userId, superblockId);
  if (superblock.id === null) {
    notFound();
  }

  const path = Paths.Superblocks_SuperblockId_Perform(superblockId);

  // TODO: I can just have this be a part of the getPerformSuperblock data.
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
    userId,
    requiredPreferencesKeys,
    Paths.Superblocks_SuperblockId_Perform(superblock.id),
  );

  return (
    <React.Fragment>
      <Breadcrumbs
        pathname={path}
        labels={{
          [superblockId]: superblock.name,
        }}
      />
      <PerformClient
        userId={userId}
        initialSuperblock={superblock}
        preferences={preferences}
        path={path}
      />
    </React.Fragment>
  );
}

const getPerformSuperblock = async (userId: string, superblockId: string) => {
  const superblock = await supabaseRPC("get_perform_superblock", {
    p_user_id: userId,
    p_superblock_id: superblockId,
  });
  return superblock as GetPerformSuperblockResult;
};
