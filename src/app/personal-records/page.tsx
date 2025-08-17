"use server";

import { EquipmentType, ExerciseType } from "@/common-types";
import Breadcrumbs from "@/components/Breadcrumbs";
import DisplayEquipmentThumbnail from "@/components/display/DisplayEquipmentThumbnail";
import TODO from "@/components/TODO";
import { Paths } from "@/constants";
import { requireLoggedInUser, supabaseRPC } from "@/serverUtil";
import { equipmentTypeUIString, exerciseTypeUIStringBrief } from "@/uiStrings";
import { EXERCISES_BY_EQUIPMENT } from "@/util";
import { Card, CardContent, Stack, Typography } from "@mui/material";
import Link from "next/link";
import React, { Suspense } from "react";

const PersonalRecordsPage = async () => {
  const { userId } = await requireLoggedInUser("/personal-records");

  const exerciseTypes = await supabaseRPC(
    "get_personal_record_exercise_types",
    {
      p_user_id: userId,
    },
  );

  if (!exerciseTypes || exerciseTypes.length === 0) {
    return (
      <Stack spacing={2} data-testid="personal-records-page">
        <Typography variant="h4">Personal Records</Typography>
        <Card>
          <CardContent>
            <Typography variant="body1" color="text.secondary">
              No personal records found. Start logging workouts to track your
              progress!
            </Typography>
          </CardContent>
        </Card>
      </Stack>
    );
  }

  // TODO: this is convoluted, I should clean this up, the problem is that
  // immutable js collections can't be sent directly to the client since they
  // aren't regular objects.
  const exercisesByEquipment = EXERCISES_BY_EQUIPMENT.toArray().map(
    ([equipment, exercises]) => [equipment, exercises.toArray()] as const,
  );

  return (
    <Stack spacing={3} data-testid="personal-records-page">
      <Typography variant="h4">Personal Records</Typography>
      <TODO>
        I think I may want to try some different visualization approaches.
        Notably, I think being able to just see all exercises with the PRs as
        like stars or something may be interesting. It'll also help to show how
        there's consistent progression, even though the PRs are less frequent.
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
  );
};

export default async function SuspenseWrapper() {
  return (
    <React.Fragment>
      <Breadcrumbs pathname={Paths.PersonalRecords} />
      <Suspense fallback={<div>Loading personal records...</div>}>
        <PersonalRecordsPage />
      </Suspense>
    </React.Fragment>
  );
}
