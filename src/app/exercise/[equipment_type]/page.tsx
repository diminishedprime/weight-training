import { EquipmentType } from "@/common-types";
import Breadcrumbs, { BreadcrumbsProps } from "@/components/Breadcrumbs";
import DisplayEquipmentThumbnail from "@/components/display/DisplayEquipmentThumbnail";
import TODO from "@/components/TODO";
import { EQUIPMENT_TYPES, pathForEquipmentPage } from "@/constants";
import { equipmentTypeUIString } from "@/uiStrings";
import { narrowEquipmentType, narrowOrNotFound } from "@/util";
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

  const breadcrumbsProps: BreadcrumbsProps = {
    pathname: pathForEquipmentPage(equipmentType),
  };

  return (
    <React.Fragment>
      <Breadcrumbs {...breadcrumbsProps} />
      <Stack spacing={1}>
        {EQUIPMENT_TYPES.map((equipmentType) => (
          <Typography
            key={equipmentType}
            component={Link}
            href={pathForEquipmentPage(equipmentType)}
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            <DisplayEquipmentThumbnail
              equipmentType={equipmentType as EquipmentType}
            />
            {equipmentTypeUIString(equipmentType)}
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
