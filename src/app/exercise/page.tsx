import Breadcrumbs from "@/components/Breadcrumbs";
import DisplayEquipmentThumbnail from "@/components/display/DisplayEquipmentThumbnail";
import TODO from "@/components/TODO";
import { pathForEquipmentPage } from "@/constants";
import { Constants } from "@/database.types";
import { requireLoggedInUser } from "@/serverUtil";
import { equipmentTypeUIString } from "@/uiStrings";
import { Stack, Typography } from "@mui/material";
import Link from "next/link";

const EQUIPMENT_DATA = Constants.public.Enums.equipment_type_enum.map(
  (equipmentType) => ({
    key: equipmentType,
    href: pathForEquipmentPage(equipmentType),
    linkText: equipmentTypeUIString(equipmentType),
  }),
);

export default async function ExercisePage() {
  await requireLoggedInUser("/exercise");

  return (
    <>
      <Breadcrumbs pathname="/exercise" />
      <Stack spacing={1} direction="column">
        {EQUIPMENT_DATA.map(({ key, href, linkText }) => (
          <Typography
            key={key}
            component={Link}
            href={href}
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            <DisplayEquipmentThumbnail equipmentType={key} />
            {linkText}
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
