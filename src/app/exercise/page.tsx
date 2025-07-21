import { Stack, Typography } from "@mui/material";
import Link from "next/link";
import { equipmentTypeUIString } from "@/uiStrings";
import Breadcrumbs from "@/components/Breadcrumbs";
import { requireLoggedInUser } from "@/serverUtil";
import { pathForBarbellPage } from "@/constants";

export default async function ExercisePage() {
  await requireLoggedInUser("/exercise");

  return (
    <>
      <Breadcrumbs pathname="/exercise" />
      <Stack spacing={1} direction="column">
        <Typography variant="h6" component={Link} href={pathForBarbellPage}>
          {equipmentTypeUIString("barbell")}
        </Typography>
      </Stack>
    </>
  );
}
