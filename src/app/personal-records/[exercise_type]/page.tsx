import { Constants } from "@/database.types";
import { getSupabaseClient, requireLoggedInUser } from "@/serverUtil";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import { ExerciseType } from "@/common-types";
import React, { Suspense } from "react";
import { exerciseTypeUIStringLong, weightUnitUIString } from "@/uiStrings";
import {
  Stack,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import Link from "next/link";
import { format } from "date-fns";

type PersonalRecordsExerciseTypeProps = {
  exercise_type: ExerciseType;
};

const PersonalRecordsExerciseType = async (
  props: PersonalRecordsExerciseTypeProps
) => {
  const { userId } = await requireLoggedInUser(
    `/personal-records/${props.exercise_type}`
  );

  // TODO additional filtering based on querying for the record history. If a user
  // ends up here on a valid exercise type but has no records, it makes sense to
  // show them a UI that points them towards the exercise.

  const supabase = getSupabaseClient();
  const { data: personalRecords, error: personalRecordsError } =
    await supabase.rpc("get_personal_records_for_exercise_type", {
      p_user_id: userId,
      p_exercise_type: props.exercise_type,
    });

  // TODO - this is another instance where I should probably have some better error handling.
  if (personalRecordsError) {
    console.error("Error fetching personal records:", personalRecordsError);
    return <>Error loading personal records</>;
  }

  if (personalRecords === null || personalRecords.length === 0) {
    return (
      <Stack spacing={1}>
        <Typography>
          You don&apos;t have any{" "}
          {exerciseTypeUIStringLong(props.exercise_type)} personal records yet.
          If you&apos;d like to record some of these exercises, go to{" "}
          <Link href={`/exercise/${props.exercise_type}`}>
            {exerciseTypeUIStringLong(props.exercise_type)}
          </Link>
          .
        </Typography>
      </Stack>
    );
  }

  // Group records by rep count (data is already pre-sorted by reps ASC, recorded_at DESC)
  const repGroups = personalRecords.reduce(
    (acc, personalRecord) => {
      const reps = personalRecord.reps!;
      const existingGroup = acc.find((group) => group.reps === reps);

      if (existingGroup) {
        existingGroup.records.push(personalRecord);
      } else {
        acc.push({ reps, records: [personalRecord] });
      }

      return acc;
    },
    [] as Array<{ reps: number; records: typeof personalRecords }>
  );

  return (
    <Stack spacing={2} data-testid="personal-records-exercise-type">
      <Typography variant="h4">
        {exerciseTypeUIStringLong(props.exercise_type)} Personal Records
      </Typography>

      {repGroups.map(({ reps, records }) => (
        <Stack key={reps} spacing={1}>
          <Typography variant="h6" color="primary">
            {reps} Rep{reps === 1 ? "" : "s"}
          </Typography>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell align="right">Weight</TableCell>
                  <TableCell align="center">Reps</TableCell>
                  <TableCell align="center">Time Since Last</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {records.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>
                      {record.recorded_at
                        ? format(new Date(record.recorded_at), "MMM d, yyyy")
                        : "—"}
                    </TableCell>
                    <TableCell align="right">
                      {record.value} {weightUnitUIString(record.unit!)}
                    </TableCell>
                    <TableCell align="center">{record.reps}</TableCell>
                    <TableCell align="center">
                      {record.days_since_last_record
                        ? `${record.days_since_last_record} day${record.days_since_last_record === 1 ? "" : "s"}`
                        : "—"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Stack>
      ))}
    </Stack>
  );
};

type SuspenseWrapperProps = {
  params: Promise<{ exercise_type: string }>;
};

export default async function SuspenseWrapper(props: SuspenseWrapperProps) {
  const { exercise_type: unnarrowedExerciseType } = await props.params;

  // Ensure the exercise type is valid.
  if (
    Constants.public.Enums.exercise_type_enum.find(
      (a) => a === unnarrowedExerciseType
    ) === undefined
  ) {
    return notFound();
  }

  // Safe to narrow the type here since we checked above.
  const exerciseType = unnarrowedExerciseType as ExerciseType;

  return (
    <React.Fragment>
      <Breadcrumbs
        pathname={`/personal-records/${exerciseType}`}
        labels={{ [exerciseType]: exerciseTypeUIStringLong(exerciseType) }}
      />
      <Suspense fallback={<div>Loading personal records...</div>}>
        <PersonalRecordsExerciseType exercise_type={exerciseType} />
      </Suspense>
    </React.Fragment>
  );
}
