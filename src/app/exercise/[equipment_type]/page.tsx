import { EquipmentType, ExerciseType } from "@/common-types";
import Breadcrumbs, { BreadcrumbsProps } from "@/components/Breadcrumbs";
import DisplayEquipmentThumbnail from "@/components/display/DisplayEquipmentThumbnail";
import TODO from "@/components/TODO";
import {
  pathForEquipmentExercisePage,
  pathForEquipmentPage,
} from "@/constants";
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

interface ExerciseData {
  href: string;
  linkText: string;
  key: string;
}

interface EquipmentExercisesData {
  [equipmentType: string]: ExerciseData[];
}

// Calculating this at the top level for performance. This will use more ram,
// but less compute during runtime.
const EQUIPMENT_EXERCISES_DATA = Object.entries(EXERCISES_BY_EQUIPMENT).reduce(
  (acc, [equipmentType, exercises]) => {
    return {
      ...acc,
      [equipmentType]: exercises.map((exercise) => ({
        href: pathForEquipmentExercisePage(
          equipmentType as EquipmentType,
          exercise as ExerciseType,
        ),
        linkText: exerciseTypeUIStringBrief(exercise as ExerciseType),
        key: `${equipmentType}-${exercise}`,
      })),
    };
  },
  {} as EquipmentExercisesData,
);

export default async function EquipmentTypeExercisesPage(
  props: EquipmentTypeExercisesProps,
) {
  const { equipment_type: unnarrowedEquipmentType } = await props.params;

  const equipmentType = narrowOrNotFound(
    unnarrowedEquipmentType,
    narrowEquipmentType,
  );

  const breadcrumbsProps: BreadcrumbsProps = {
    pathname: pathForEquipmentPage(equipmentType),
  };

  return (
    <React.Fragment>
      <Breadcrumbs {...breadcrumbsProps} />
      <Stack spacing={1}>
        {EQUIPMENT_EXERCISES_DATA[equipmentType].map(
          ({ href, linkText, key }) => (
            <Typography
              key={key}
              component={Link}
              href={href}
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              <DisplayEquipmentThumbnail
                equipmentType={equipmentType as EquipmentType}
              />
              {linkText}
            </Typography>
          ),
        )}
        <TODO>
          I'd like to get SVGs here too, but idk if that's quite as feasable...
        </TODO>
      </Stack>
    </React.Fragment>
  );
}
