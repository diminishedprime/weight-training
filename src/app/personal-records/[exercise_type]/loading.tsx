"use client";

import { ExerciseType } from "@/common-types";
import Breadcrumbs from "@/components/Breadcrumbs";
import { EXERCISE_TYPES_SET } from "@/constants";
import { Paths } from "@/constants/paths";
import { exerciseTypeUIStringBrief } from "@/uiStrings";
import { usePathname } from "next/navigation";
import React from "react";

export default function Loading() {
  const path = usePathname();
  const parts = path.split("/");
  const [_root, _personal_records, exercise_type] = parts;
  const exerciseType = EXERCISE_TYPES_SET.find((a) => a === exercise_type);
  return (
    <React.Fragment>
      <Breadcrumbs
        pathname={Paths.PersonalRecords_ExerciseType(
          exercise_type as ExerciseType,
        )}
      />
      Loading personal records for{" "}
      {exerciseType ? exerciseTypeUIStringBrief(exerciseType) : exercise_type}
      ...
    </React.Fragment>
  );
}
