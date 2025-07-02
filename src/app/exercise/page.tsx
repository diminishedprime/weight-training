import { Button, Stack, Typography } from "@mui/material";
import Link from "next/link";
import { equipmentTypeUIString, exerciseTypeUIStringBrief } from "@/uiStrings";
import { equipmentForExercise } from "@/util";
import { Constants, Database } from "@/database.types";
import Breadcrumbs from "@/components/Breadcrumbs";
import { requireLoggedInUser } from "@/serverUtil";

export default async function ExercisePage() {
  await requireLoggedInUser("/exercise");
  // Manual order for equipment enum variants (only include those that exist in the enum)
  const manualOrder = [
    "barbell" as Database["public"]["Enums"]["equipment_type_enum"],
    "machine" as Database["public"]["Enums"]["equipment_type_enum"],
  ];
  const allEquipment = Constants.public.Enums.equipment_type_enum;
  const orderedEquipment: Database["public"]["Enums"]["equipment_type_enum"][] =
    [...manualOrder, ...allEquipment.filter((e) => !manualOrder.includes(e))];

  return (
    <>
      <Breadcrumbs pathname="/exercise" />
      <Stack spacing={2} direction="column" sx={{ alignItems: "flex-start" }}>
        {orderedEquipment.map((equipment) => {
          return (
            <Stack key={equipment}>
              <Typography variant="h4">
                {equipmentTypeUIString(equipment)}
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {Constants.public.Enums.exercise_type_enum
                  .filter((type) => equipmentForExercise(type) === equipment)
                  .map((type) => {
                    return (
                      <Button
                        key={type}
                        component={Link}
                        href={`/exercise/${type}`}
                        variant="contained"
                        color="primary">
                        {exerciseTypeUIStringBrief(type)}
                      </Button>
                    );
                  })}
              </Stack>
            </Stack>
          );
        })}
      </Stack>
    </>
  );
}
