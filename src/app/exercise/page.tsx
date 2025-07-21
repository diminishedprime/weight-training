import { Stack, Typography } from "@mui/material";
import Link from "next/link";
import { equipmentTypeUIString } from "@/uiStrings";
import Breadcrumbs from "@/components/Breadcrumbs";
import { requireLoggedInUser } from "@/serverUtil";
import { pathForEquipmentPage } from "@/constants";
import { Constants } from "@/database.types";

const EQUIPMENT_DATA = Constants.public.Enums.equipment_type_enum.map(
  (equipmentType) => ({
    key: equipmentType,
    href: pathForEquipmentPage(equipmentType),
    linkText: equipmentTypeUIString(equipmentType),
  })
);

export default async function ExercisePage() {
  await requireLoggedInUser("/exercise");

  return (
    <>
      <Breadcrumbs pathname="/exercise" />
      <Stack spacing={1} direction="column">
        {EQUIPMENT_DATA.map(({ key, href, linkText }) => (
          <Typography key={key} component={Link} href={href}>
            {linkText}
          </Typography>
        ))}
      </Stack>
    </>
  );
}
