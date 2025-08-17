import { ExerciseType } from "@/common-types";
import Breadcrumbs from "@/components/Breadcrumbs";
import DisplayEquipmentThumbnail from "@/components/display/DisplayEquipmentThumbnail";
import DisplayWeight from "@/components/display/DisplayWeight";
import TODO from "@/components/TODO";
import { Constants } from "@/database.types";
import { requireLoggedInUser, supabaseRPC } from "@/serverUtil";
import {
  exerciseTypeUIStringBrief,
  exerciseTypeUIStringLong,
} from "@/uiStrings";
import { equipmentForExercise } from "@/util";
import {
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { format, formatDistance, formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";

type Props = {
  params: Promise<{ exercise_type: string }>;
};

export default async function PersonalRecords_ExerciseType(props: Props) {
  const { exercise_type: unnarrowedExerciseType } = await props.params;

  // Ensure the exercise type is valid.
  if (
    Constants.public.Enums.exercise_type_enum.find(
      (a) => a === unnarrowedExerciseType,
    ) === undefined
  ) {
    return notFound();
  }

  // Safe to narrow the type here since we checked above.
  const exerciseType = unnarrowedExerciseType as ExerciseType;

  const { userId } = await requireLoggedInUser(
    `/personal-records/${exerciseType}`,
  );

  // TODO additional filtering based on querying for the record history. If a user
  // ends up here on a valid exercise type but has no records, it makes sense to
  // show them a UI that points them towards the exercise.

  const personalRecords = await supabaseRPC(
    "get_personal_records_for_exercise_type",
    {
      p_user_id: userId,
      p_exercise_type: exerciseType,
    },
  );

  if (personalRecords === null || personalRecords.length === 0) {
    return (
      <Stack>
        <Typography>
          You don&apos;t have any {exerciseTypeUIStringLong(exerciseType)}{" "}
          personal records yet. If you&apos;d like to record some of these
          exercises, go to{" "}
          <Link href={`/exercise/${exerciseType}`}>
            {exerciseTypeUIStringLong(exerciseType)}
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
    [] as Array<{ reps: number; records: typeof personalRecords }>,
  );

  return (
    <React.Fragment>
      <Breadcrumbs
        pathname={`/personal-records/${exerciseType}`}
        labels={{
          [exerciseType]: (
            <Stack direction="row" alignItems="center">
              <DisplayEquipmentThumbnail
                equipmentType={equipmentForExercise(exerciseType)}
              />
              {exerciseTypeUIStringBrief(exerciseType)}
            </Stack>
          ),
        }}
      />
      <Stack spacing={2} data-testid="personal-records-exercise-type">
        <Typography variant="h4">
          {exerciseTypeUIStringBrief(exerciseType)} Personal Records
        </Typography>

        {repGroups.map(({ reps, records }) => (
          <Stack key={reps}>
            <Stack direction="row" display="flex" alignItems="baseline">
              <Typography variant="h6" color="primary">
                {reps} Rep{reps === 1 ? "" : "s"}
              </Typography>

              <Typography>
                <Typography component="span">
                  Last record (
                  <DisplayWeight
                    weightValue={records[0].weight_value!}
                    weightUnit={records[0].weight_unit!}
                    reps={records[0].reps!}
                  />
                  )
                </Typography>
                <Typography component="span">
                  {" "}
                  {formatDistanceToNow(new Date(records[0].recorded_at!), {
                    addSuffix: true,
                  })}
                </Typography>

                <TODO>
                  The formatting is all broken, probably just use a LabeledValue
                  here.
                </TODO>
              </Typography>
            </Stack>
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell align="right">Weight</TableCell>
                    <TableCell align="center">Increase</TableCell>
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
                      <TableCell>
                        <DisplayWeight
                          weightValue={record.weight_value!}
                          weightUnit={record.weight_unit!}
                        />
                      </TableCell>
                      <TableCell align="center">
                        {record.increase_weight_value != null ? (
                          <DisplayWeight
                            weightValue={record.increase_weight_value}
                            weightUnit={record.weight_unit!}
                          />
                        ) : (
                          "—"
                        )}
                      </TableCell>
                      <TableCell align="center">
                        {record.previous_recorded_at &&
                          formatDistance(
                            record.previous_recorded_at,
                            record.recorded_at!,
                          )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Stack>
        ))}
      </Stack>
    </React.Fragment>
  );
}
