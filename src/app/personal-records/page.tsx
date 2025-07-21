"use server";

import { requireLoggedInUser, supabaseRPC } from "@/serverUtil";
import React, { Suspense } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Stack, Typography, Card, CardContent } from "@mui/material";
import Link from "next/link";
import { EXERCISES_BY_EQUIPMENT } from "@/util";
import { EquipmentType } from "@/common-types";
import { equipmentTypeUIString } from "@/uiStrings";

const PersonalRecordsPage = async () => {
  const { userId } = await requireLoggedInUser("/personal-records");

  // TODO - I think I may want to try some different visualization approaches.
  // Notably, I think being able to just see all exercises with the PRs as like
  // stars or something may be interesting. It'll also help to show how there's
  // consistent progression, even though the PRs are less frequent.

  const exerciseTypes = await supabaseRPC(
    "get_personal_record_exercise_types",
    {
      p_user_id: userId,
    }
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

  return (
    <Stack spacing={3} data-testid="personal-records-page">
      <Typography variant="h4">Personal Records</Typography>

      {Object.entries(EXERCISES_BY_EQUIPMENT).map(([equipment, exercises]) => (
        <Stack key={equipment} spacing={1}>
          <Typography variant="h6">
            {equipmentTypeUIString(equipment as EquipmentType)}
          </Typography>
          <ul style={{ margin: 0, paddingLeft: "20px" }}>
            {exercises.map((exerciseType) => (
              <li key={exerciseType} style={{ marginBottom: "8px" }}>
                <Link
                  href={`/personal-records/${exerciseType}`}
                  style={{ textDecoration: "none", color: "inherit" }}>
                  <Typography
                    component="span"
                    color="primary"
                    sx={{ "&:hover": { textDecoration: "underline" } }}>
                    {exerciseType
                      .replace(/_/g, " ")
                      .replace(/\b\w/g, (l) => l.toUpperCase())}
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
      <Breadcrumbs pathname="/personal-records" />
      <Suspense fallback={<div>Loading personal records...</div>}>
        <PersonalRecordsPage />
      </Suspense>
    </React.Fragment>
  );
}
