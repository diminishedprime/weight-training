"use client";
import { EquipmentType } from "@/common-types";
import Breadcrumbs from "@/components/Breadcrumbs";
import { EQUIPMENT_TYPES } from "@/constants";
import { Paths } from "@/constants/paths";
import { equipmentTypeUIString } from "@/uiStrings";
import { usePathname } from "next/navigation";
import React from "react";

export default function Loading() {
  const path = usePathname();
  const parts = path.split("/");
  const [_root, _exercise, equipment_type] = parts;
  const equipmentType = EQUIPMENT_TYPES.find((a) => a === equipment_type);
  return (
    <React.Fragment>
      <Breadcrumbs
        pathname={Paths.Exercise_EquipmentType(equipment_type as EquipmentType)}
      />
      Loading exercises for{" "}
      {equipmentType ? equipmentTypeUIString(equipmentType) : equipment_type}...
    </React.Fragment>
  );
}
