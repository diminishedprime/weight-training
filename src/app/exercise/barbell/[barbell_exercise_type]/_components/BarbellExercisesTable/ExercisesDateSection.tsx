import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Link from "next/link";
import { weightUnitUIString, completionStatusUIString } from "@/uiStrings";
import { Stack, Typography } from "@mui/material";
import { format } from "date-fns";
import { BarbellExercisesTableProps, useExercisesTableAPI } from ".";
import { TestIds } from "@/test-ids";
import TimeDisplay from "@/components/TimeDisplay";
import PercievedEffortDisplay from "@/components/PercievedEffort";
import BarbellThumbnail from "@/components/Barbell/BarbellThumbnail";
import { notFoundIfNull } from "@/util";
import { RoundingMode } from "@/common-types";

// Section for a date (including NO_DATE with exercises)
interface ExercisesDateSectionProps {
  dateKey: string;
  firstExercise:
    | BarbellExercisesTableProps["barbellExercises"][number]
    | undefined;
  exercisesForDate: BarbellExercisesTableProps["barbellExercises"];
  exercise_type: BarbellExercisesTableProps["barbellExerciseType"];
  api: ReturnType<typeof useExercisesTableAPI>;
  availablePlates: BarbellExercisesTableProps["availablePlatesLbs"];
}

const ExercisesDateSection: React.FC<ExercisesDateSectionProps> = (props) => (
  <Stack
    spacing={1}
    data-testid={TestIds.exercisesTableDateSection}
    sx={{ width: "100%" }}>
    {/* Date Header */}
    <Typography
      variant="h6"
      sx={{ fontWeight: 600, color: "primary.main" }}
      data-testid={TestIds.exercisesTableDateHeader}>
      {props.dateKey === "NO_DATE"
        ? "No Date"
        : props.firstExercise?.performed_at
          ? format(
              new Date(props.firstExercise.performed_at),
              "EEEE, MMMM do, yyyy"
            )
          : ""}
    </Typography>
    {/* Table for this date */}
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell align="center">Time</TableCell>
            <TableCell align="center">Work</TableCell>
            <TableCell align="center">Status</TableCell>
            <TableCell align="center">Effort</TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {props.exercisesForDate.map((exercise, idx: number) => {
            notFoundIfNull(exercise.weight_unit);
            notFoundIfNull(exercise.target_weight_value);
            notFoundIfNull(exercise.exercise_type);
            notFoundIfNull(exercise.completion_status);
            return (
              <React.Fragment key={exercise.exercise_id || idx}>
                <TableRow
                  sx={
                    props.api.flashId &&
                    exercise.exercise_id === props.api.flashId
                      ? { animation: "flash-bg 2.5s ease-in-out" }
                      : {}
                  }
                  data-testid={TestIds.exercisesTableRow}>
                  <TableCell padding="none" align="center">
                    {exercise.performed_at && (
                      <TimeDisplay
                        performedAt={exercise.performed_at}
                        noSeconds
                      />
                    )}
                  </TableCell>
                  <TableCell align="center" padding="none" sx={{ pt: 1 }}>
                    <Stack alignItems="center">
                      <BarbellThumbnail
                        availablePlates={props.availablePlates}
                        weightUnit={exercise.weight_unit}
                        // TODO: barWeight should be on the exercise row, or at
                        // least be joinable...
                        barWeight={45}
                        // TODO: here and everywhere, we should have a default
                        // rounding mode in preferences.
                        roundingMode={RoundingMode.NEAREST}
                        targetWeight={
                          exercise.actual_weight_value ??
                          exercise.target_weight_value
                        }
                      />
                      <Typography variant="body1">
                        {`${exercise.reps}x${exercise.target_weight_value}${weightUnitUIString(exercise.weight_unit)}`}
                        <br />
                        {exercise.warmup && (
                          <Typography
                            color="success"
                            variant="body2"
                            component="span">
                            (warmup)
                          </Typography>
                        )}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell align="center" padding="none">
                    {completionStatusUIString(exercise.completion_status)}
                  </TableCell>
                  <TableCell align="center" padding="none">
                    {exercise.relative_effort && (
                      <PercievedEffortDisplay
                        percievedEffort={exercise.relative_effort}
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    <Button
                      component={Link}
                      href={`/exercise/${props.exercise_type}/edit/${
                        exercise.exercise_id || exercise.exercise_id
                      }`}
                      size="small"
                      data-testid={TestIds.exercisesTableEditButton}>
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
                {/* Display exercise notes in a separate row if they exist */}
                {exercise.notes && exercise.notes.trim() !== "" && (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      sx={{
                        background: "#fafafa",
                        p: 1,
                      }}
                      data-testid={TestIds.exercisesTableNotesRow}>
                      <Typography variant="caption">
                        {exercise.notes}
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  </Stack>
);

export default ExercisesDateSection;
