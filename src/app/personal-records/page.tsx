import { EquipmentType, ExerciseType } from "@/common-types";
import Breadcrumbs from "@/components/Breadcrumbs";
import DisplayEquipmentThumbnail from "@/components/display/DisplayEquipmentThumbnail";
import TODO from "@/components/TODO";
import { Paths } from "@/constants";
import { equipmentTypeUIString, exerciseTypeUIStringBrief } from "@/uiStrings";
import { EXERCISES_BY_EQUIPMENT } from "@/util";
import { Stack, Typography } from "@mui/material";
import Link from "next/link";
import React from "react";

export default async function PersonalRecords() {
  const exercisesByEquipment = EXERCISES_BY_EQUIPMENT.toArray().map(
    ([equipment, exercises]) => [equipment, exercises.toArray()] as const,
  );
  return (
    <React.Fragment>
      <Breadcrumbs pathname={Paths.PersonalRecords} />
      <Stack spacing={3} data-testid="personal-records-page">
        <Typography variant="h4">Personal Records</Typography>
        <TODO>
          I think I may want to try some different visualization approaches.
          Notably, I think being able to just see all exercises with the PRs as
          like stars or something may be interesting. It'll also help to show
          how there's consistent progression, even though the PRs are less
          frequent.
        </TODO>
        {exercisesByEquipment.map(([equipment, exercises]) => (
          <Stack key={equipment}>
            <Typography variant="h6" display="flex" alignItems="center" gap={1}>
              <DisplayEquipmentThumbnail
                equipmentType={equipment as EquipmentType}
              />
              {equipmentTypeUIString(equipment as EquipmentType)}
            </Typography>
            <ul style={{ margin: 0, paddingLeft: "20px" }}>
              {exercises.map((exerciseType: ExerciseType) => (
                <li key={exerciseType} style={{ marginBottom: "8px" }}>
                  <Link
                    href={Paths.PersonalRecords_ExerciseType(exerciseType)}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <Typography
                      component="span"
                      color="primary"
                      sx={{ "&:hover": { textDecoration: "underline" } }}
                    >
                      {exerciseTypeUIStringBrief(exerciseType)}
                    </Typography>
                  </Link>
                </li>
              ))}
            </ul>
          </Stack>
        ))}
      </Stack>
    </React.Fragment>
  );
}
