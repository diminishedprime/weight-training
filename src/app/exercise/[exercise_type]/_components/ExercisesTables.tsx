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
import { TestIds } from "@/test-ids";
import { Database } from "@/database.types";
import { Stack, Typography } from "@mui/material";
import WeightThumbnail from "@/components/WeightThumbnail";
import TimeDisplay from "@/components/TimeDisplay";
import { format } from "date-fns";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";
import SentimentVerySatisfiedIcon from "@mui/icons-material/SentimentVerySatisfied";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";

// Section for "No Date" with no exercises
const NoDateEmptySection: React.FC = () => (
  <Stack spacing={1} data-testid={TestIds.exercisesTableNoDateSection}>
    <Typography
      variant="h6"
      sx={{ fontWeight: 600, color: "primary.main" }}
      data-testid={TestIds.exercisesTableDateHeader}>
      No Date
    </Typography>
    <TableContainer component={Paper}>
      <Table size="small">
        <TableBody>
          <TableRow>
            <TableCell align="center" colSpan={5}>
              <Typography variant="body2" color="text.secondary">
                No exercises with no date
              </Typography>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  </Stack>
);

// Section for a date (including NO_DATE with exercises)
interface ExercisesDateSectionProps {
  dateKey: string;
  firstExercise: ExercisesTableProps["exercises"][number] | undefined;
  exercisesForDate: ExercisesTableProps["exercises"];
  exercise_type: ExercisesTableProps["exercise_type"];
  api: ReturnType<typeof useExercisesTableAPI>;
  availablePlates: number[];
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
          {props.exercisesForDate.map((exercise, idx: number) => (
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
                    <WeightThumbnail
                      availablePlates={props.availablePlates}
                      weight={exercise.weight_value ?? 0}
                      weightUnit={exercise.weight_unit}
                      exerciseType={exercise.exercise_type}
                    />
                    <Typography variant="body1">
                      {`${exercise.reps}x${exercise.weight_value}${weightUnitUIString(exercise.weight_unit)}`}
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
                    <Typography variant="caption">{exercise.notes}</Typography>
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

interface ExercisesTableProps {
  /** Array of exercises to display in the table */
  exercises: Database["public"]["Functions"]["get_exercises_by_type_for_user"]["Returns"];
  /** The type of exercise being displayed */
  exercise_type: Database["public"]["Enums"]["exercise_type_enum"];
  availablePlates: number[];
}

// Helper function to get date string for grouping
function getDateString(performedAt: string) {
  return format(new Date(performedAt), "yyyy-MM-dd");
}

/**
 * Encapsulates all logic and state for the ExercisesTable component.
 * Returns grouped, sorted, and filtered exercise data and UI state.
 */
function useExercisesTableAPI(exercises: ExercisesTableProps["exercises"]) {
  const searchParams = useSearchParams();
  const flashId = searchParams.get("flash");
  const [showNoDate, setShowNoDate] = React.useState(false);

  // Group exercises by date, with a special key for missing performed_at
  const exercisesByDate = React.useMemo(
    () =>
      exercises.reduce(
        (groups, exercise) => {
          const dateKey = exercise.performed_at
            ? getDateString(exercise.performed_at)
            : "NO_DATE";
          if (!groups[dateKey]) {
            groups[dateKey] = [];
          }
          groups[dateKey].push(exercise);
          return groups;
        },
        {} as Record<string, typeof exercises>
      ),
    [exercises]
  );

  // Get dates in reverse chronological order, with NO_DATE first if present
  const dates = React.useMemo(() => {
    const d = Object.keys(exercisesByDate);
    d.sort((a, b) => {
      if (a === "NO_DATE") return -1;
      if (b === "NO_DATE") return 1;
      // Sort in reverse chronological order (most recent first)
      return b.localeCompare(a);
    });
    return d;
  }, [exercisesByDate]);

  // Always include NO_DATE in visibleDates if showNoDate is true
  const visibleDates = React.useMemo(
    () =>
      showNoDate
        ? Array.from(new Set(["NO_DATE", ...dates]))
        : dates.filter((d) => d !== "NO_DATE"),
    [showNoDate, dates]
  );

  return {
    flashId,
    showNoDate,
    setShowNoDate,
    exercisesByDate,
    visibleDates,
  };
}

/**
 * Displays a table of exercises with their details including date, weight, reps, and status.
 * Supports visual weight representations and exercise editing functionality.
 * Highlights rows when flashed via URL parameter.
 */
const ExercisesTables: React.FC<ExercisesTableProps> = (props) => {
  const { exercises, exercise_type } = props;
  const api = useExercisesTableAPI(exercises);

  return (
    <Stack spacing={3} sx={{ mt: 4, width: "100%" }}>
      <FormControlLabel
        control={
          <Checkbox
            checked={api.showNoDate}
            onChange={(e) => api.setShowNoDate(e.target.checked)}
            size="small"
          />
        }
        label="Show exercises with no date"
        sx={{ alignSelf: "flex-start" }}
      />
      {api.visibleDates.map((dateKey) => {
        const exercisesForDate = api.exercisesByDate[dateKey] || [];
        const firstExercise = exercisesForDate[0];
        return dateKey === "NO_DATE" && exercisesForDate.length === 0 ? (
          <NoDateEmptySection key={dateKey} />
        ) : (
          <ExercisesDateSection
            availablePlates={props.availablePlates}
            key={dateKey}
            dateKey={dateKey}
            firstExercise={firstExercise}
            exercisesForDate={exercisesForDate}
            exercise_type={exercise_type}
            api={api}
          />
        );
      })}
    </Stack>
  );
};

export default ExercisesTables;
