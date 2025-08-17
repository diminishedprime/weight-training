import { EquipmentType } from "@/common-types";
import Breadcrumbs from "@/components/Breadcrumbs";
import DisplayEquipmentThumbnail from "@/components/display/DisplayEquipmentThumbnail";
import TODO from "@/components/TODO";
import { Paths } from "@/constants";
import { exerciseTypeUIStringBrief } from "@/uiStrings";
import {
  EXERCISES_BY_EQUIPMENT,
  narrowEquipmentType,
  narrowOrNotFound,
} from "@/util";
import { Stack, Typography } from "@mui/material";
import Link from "next/link";
import React from "react";

interface EquipmentTypeExercisesProps {
  params: Promise<{ equipment_type: string }>;
}

export default async function EquipmentTypeExercisesPage(
  props: EquipmentTypeExercisesProps,
) {
  const { equipment_type: unnarrowedEquipmentType } = await props.params;

  const equipmentType = narrowOrNotFound(
    unnarrowedEquipmentType,
    narrowEquipmentType,
  );

  return (
    <React.Fragment>
      <Breadcrumbs pathname={Paths.Exercise_EquipmentType(equipmentType)} />
      <Stack>
        {Array.from(
          EXERCISES_BY_EQUIPMENT.get(equipmentType)?.toOrderedSet() ?? [],
        ).map((exerciseType) => (
          <Typography
            key={exerciseType}
            component={Link}
            href={Paths.Exercise_EquipmentType_ExerciseType(
              equipmentType,
              exerciseType,
            )}
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            <DisplayEquipmentThumbnail
              equipmentType={equipmentType as EquipmentType}
            />
            {exerciseTypeUIStringBrief(exerciseType)}
          </Typography>
        ))}
        <TODO>
          I'd like to get SVGs here too, but idk if that's quite as feasable...
        </TODO>
        <TODO easy>Remove this todo.</TODO>
      </Stack>
    </React.Fragment>
  );
}
