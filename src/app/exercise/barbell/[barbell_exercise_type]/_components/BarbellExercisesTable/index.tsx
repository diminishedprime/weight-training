"use client";
import React from "react";
import { useSearchParams } from "next/navigation";
import { Stack } from "@mui/material";
import { format } from "date-fns";
import { ExercisesByTypeResultRows, ExerciseType } from "@/common-types";
import ExercisesDateSection from "@/app/exercise/barbell/[barbell_exercise_type]/_components/BarbellExercisesTable/ExercisesDateSection";
import { notFoundIfNull } from "@/util";

export interface BarbellExercisesTableProps {
  barbellExercises: NonNullable<ExercisesByTypeResultRows>;
  barbellExerciseType: ExerciseType;
  availablePlatesLbs: number[];
}

function getDateString(performedAt: string) {
  return format(new Date(performedAt), "yyyy-MM-dd");
}

export function useExercisesTableAPI(props: BarbellExercisesTableProps) {
  const { barbellExercises } = props;
  const searchParams = useSearchParams();
  const flashId = searchParams.get("flash");

  // Group exercises by date
  const exercisesByDate = React.useMemo(
    () =>
      barbellExercises.reduce<Record<string, typeof barbellExercises>>(
        (groups, exercise) => {
          notFoundIfNull(exercise.performed_at);
          const dateKey = getDateString(exercise.performed_at);
          if (!groups[dateKey]) {
            groups[dateKey] = [];
          }
          groups[dateKey].push(exercise);
          return groups;
        },
        {}
      ),
    [barbellExercises]
  );

  // Get dates in reverse chronological order
  const dates = React.useMemo(() => {
    const d = Object.keys(exercisesByDate);
    d.sort((a, b) => b.localeCompare(a));
    return d;
  }, [exercisesByDate]);

  return {
    flashId,
    exercisesByDate,
    dates,
  };
}

const BarbellExercisesTable: React.FC<BarbellExercisesTableProps> = (props) => {
  const api = useExercisesTableAPI(props);

  return (
    <Stack spacing={3} sx={{ mt: 4, width: "100%" }}>
      {api.dates.map((dateKey) => {
        const exercisesForDate = api.exercisesByDate[dateKey] || [];
        const firstExercise = exercisesForDate[0];
        return (
          <ExercisesDateSection
            availablePlates={props.availablePlatesLbs}
            key={dateKey}
            dateKey={dateKey}
            firstExercise={firstExercise}
            exercisesForDate={exercisesForDate}
            exercise_type={props.barbellExerciseType}
            api={api}
          />
        );
      })}
    </Stack>
  );
};

export default BarbellExercisesTable;
