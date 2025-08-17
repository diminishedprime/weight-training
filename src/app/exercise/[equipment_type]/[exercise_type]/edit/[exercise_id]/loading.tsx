"use client";
import { EquipmentType, ExerciseType } from "@/common-types";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Paths } from "@/constants/paths";
import { usePathname } from "next/navigation";
import React from "react";

export default function Loading() {
  const path = usePathname();
  const parts = path.split("/");
  const [_root, _exercise, equipment_type, exercise_type, _edit, exercise_id] =
    parts;
  return (
    <React.Fragment>
      <Breadcrumbs
        pathname={Paths.Exercise_EquipmentType_ExerciseType_Edit_ExerciseId(
          equipment_type as EquipmentType,
          exercise_type as ExerciseType,
          exercise_id,
        )}
      />
      Loading exercise...
    </React.Fragment>
  );
}
