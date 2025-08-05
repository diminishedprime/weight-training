import Breadcrumbs from "@/components/Breadcrumbs";
import DisplayEquipmentThumbnail from "@/components/display/DisplayEquipmentThumbnail";
import TODO from "@/components/TODO";
import { EQUIPMENT_TYPES, Paths } from "@/constants";
import { requireLoggedInUser } from "@/serverUtil";
import { equipmentTypeUIString } from "@/uiStrings";
import { Stack, Typography } from "@mui/material";
import Link from "next/link";

export default async function ExercisePage() {
  await requireLoggedInUser("/exercise");

  return (
    <>
      <Breadcrumbs pathname={Paths.Exercise} />
      <Stack spacing={1} direction="column">
        {EQUIPMENT_TYPES.map((equipmentType) => (
          <Typography
            key={equipmentType}
            component={Link}
            href={Paths.Exercise_EquipmentType(equipmentType)}
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            <DisplayEquipmentThumbnail equipmentType={equipmentType} />
            {equipmentTypeUIString(equipmentType)}
          </Typography>
        ))}
        <TODO>
          I want to get some professionally done SVGs instead of these silly
          ones I made myself.
        </TODO>
      </Stack>
    </>
  );
}
