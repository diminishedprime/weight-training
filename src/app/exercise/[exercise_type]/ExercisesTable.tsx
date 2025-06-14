"use client";
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
import { useSearchParams } from "next/navigation";
import { weightUnitUIString, completionStatusUIString } from "@/uiStrings";
import CheckIcon from "@mui/icons-material/Check";
import { Database } from "@/database.types";
import { Stack, Typography } from "@mui/material";
import WeightThumbnail from "@/components/WeightThumbnail";
import TimeDisplay from "@/components/TimeDisplay";
import { format } from "date-fns";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";
import SentimentVerySatisfiedIcon from "@mui/icons-material/SentimentVerySatisfied";

interface ExercisesTableProps {
  /** Array of exercises to display in the table */
  exercises: Database["public"]["Functions"]["get_exercises_by_type_for_user"]["Returns"];
  /** The type of exercise being displayed */
  exercise_type: Database["public"]["Enums"]["exercise_type_enum"];
}

/**
 * Displays a table of exercises with their details including date, weight, reps, and status.
 * Supports visual weight representations and exercise editing functionality.
 * Highlights rows when flashed via URL parameter.
 */
const ExercisesTable: React.FC<ExercisesTableProps> = (props) => {
  const { exercises, exercise_type } = props;
  const searchParams = useSearchParams();
  const flashId = searchParams.get("flash");

  // Helper function to get date string for grouping
  const getDateString = (performedAt: string) => {
    return format(new Date(performedAt), "yyyy-MM-dd");
  };

  // Group exercises by date
  const exercisesByDate = exercises.reduce(
    (groups, exercise) => {
      if (!exercise.performed_at) return groups;

      const dateKey = getDateString(exercise.performed_at);
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(exercise);
      return groups;
    },
    {} as Record<string, typeof exercises>,
  );

  // Get dates in the order they appear (since exercises are already sorted)
  const dates = Object.keys(exercisesByDate);

  return (
    <Stack spacing={3} sx={{ mt: 4 }}>
      {dates.map((dateKey) => {
        const exercisesForDate = exercisesByDate[dateKey];
        const firstExercise = exercisesForDate[0];

        return (
          <Stack key={dateKey} spacing={1}>
            {/* Date Header */}
            <Typography
              variant="h6"
              sx={{ fontWeight: 600, color: "primary.main" }}
            >
              {format(
                new Date(firstExercise.performed_at!),
                "EEEE, MMMM do, yyyy",
              )}
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
                  {exercisesForDate.map((exercise, idx: number) => (
                    <React.Fragment key={exercise.exercise_id || idx}>
                      <TableRow
                        sx={
                          flashId &&
                          (exercise.exercise_id === flashId ||
                            exercise.exercise_id === flashId)
                            ? { animation: "flash-bg 2.5s ease-in-out" }
                            : {}
                        }
                      >
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
                            <WeightThumbnail
                              weight={exercise.weight_value ?? 0}
                              weightUnit={exercise.weight_unit}
                              exerciseType={exercise.exercise_type}
                            />
                            <Typography variant="body1">
                              {exercise.reps}×{exercise.weight_value}
                              {weightUnitUIString(exercise.weight_unit)}
                              <br />
                              {exercise.warmup && (
                                <Typography color="success" variant="body2">
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
                          {exercise.relative_effort === "hard" ? (
                            <SentimentVeryDissatisfiedIcon
                              titleAccess="Hard"
                              color="error"
                            />
                          ) : exercise.relative_effort === "okay" ? (
                            <SentimentSatisfiedAltIcon
                              titleAccess="Okay"
                              color="primary"
                            />
                          ) : exercise.relative_effort === "easy" ? (
                            <SentimentVerySatisfiedIcon
                              titleAccess="Easy"
                              color="success"
                            />
                          ) : null}
                        </TableCell>
                        <TableCell>
                          <Button
                            component={Link}
                            href={`/exercise/${exercise_type}/edit/${
                              exercise.exercise_id || exercise.exercise_id
                            }`}
                            size="small"
                          >
                            Edit
                          </Button>
                        </TableCell>
                      </TableRow>
                      {/* Display exercise notes in a separate row if they exist */}
                      {exercise.notes && exercise.notes.trim() !== "" && (
                        <TableRow sx={{}}>
                          <TableCell
                            colSpan={6}
                            sx={{
                              background: "#fafafa",
                              p: 1,
                            }}
                          >
                            <Typography variant="caption">
                              {exercise.notes}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Stack>
        );
      })}
    </Stack>
  );
};

export default ExercisesTable;
