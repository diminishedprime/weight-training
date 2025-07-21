"use client";
import React from "react";
import { useSearchParams } from "next/navigation";
import { Stack, Typography } from "@mui/material";
import { format } from "date-fns";
import {
  ExercisesByTypeResultRows,
  ExerciseType,
  RoundingMode,
} from "@/common-types";
import DisplayWeight from "@/components/display/DisplayWeight";
import DisplayTime from "@/components/display/DisplayTime";
import DisplayBarbellThumbnail from "@/components/display/DisplayBarbellThumbnail";
import DisplayCompletionStatus from "@/components/display/DisplayCompletionStatus";
import DisplayPercievedEffort from "@/components/display/DisplayPercievedEffort";
import Link from "next/link";
import { pathForBarbellExerciseEdit } from "@/constants";
import { TestIds } from "@/test-ids";

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

  const groupedByDay = React.useMemo(() => {
    if (barbellExercises.length === 0) {
      return [];
    }
    const groups: NonNullable<ExercisesByTypeResultRows>[number][][] = [];
    let sanityIdx = 0;
    let currentIdx = 0;
    let currentGroup: NonNullable<ExercisesByTypeResultRows>[number][] = [];
    let currentDay = getDateString(barbellExercises[0].performed_at!);
    while (currentIdx < barbellExercises.length) {
      sanityIdx++;
      if (sanityIdx > barbellExercises.length * 2) {
        // Something has gone horribly wrong.
        throw new Error("Infinite loop detected in grouping exercises by day.");
      }
      const exercise = barbellExercises[currentIdx];
      const dateForExercise = getDateString(exercise.performed_at!);
      if (dateForExercise === currentDay) {
        currentGroup.push(exercise);
        currentIdx++;
        continue;
      }
      // At this point, we have a new day, update accordingly.
      currentDay = dateForExercise;
      groups.push(currentGroup);
      currentGroup = [exercise];
      currentIdx++;
    }
    return groups;
  }, [barbellExercises]);

  return {
    flashId,
    groupedByDay,
  };
}

const BarbellExercisesTable: React.FC<BarbellExercisesTableProps> = (props) => {
  const api = useExercisesTableAPI(props);

  return (
    <Stack spacing={3} sx={{ mt: 4, width: "100%" }}>
      {api.groupedByDay.map((group, idx) => {
        const date = getDateString(group[0]!.performed_at!);
        return (
          <Stack key={`${group[0]?.exercise_id}-${idx}`}>
            <Typography variant="h5">{date}</Typography>
            <Stack
              sx={{
                display: "grid",
                gridTemplateColumns: "2fr 2fr 1fr 1fr 1fr",
                alignItems: "center",
                gap: 2,
                mb: 1,
              }}>
              <Typography variant="subtitle2" color="text.secondary">
                Time
              </Typography>
              <Typography variant="subtitle2" color="text.secondary">
                Weight
              </Typography>
              <Typography variant="subtitle2" color="text.secondary">
                Effort
              </Typography>
              <Typography variant="subtitle2" color="text.secondary">
                Status
              </Typography>
              <Typography variant="subtitle2" color="text.secondary">
                Edit
              </Typography>
            </Stack>
            {group.map((exercise, innerIdx) => {
              return (
                <Stack
                  data-testid={
                    idx === 0 && innerIdx === 0 ? TestIds.FirstBarbellRow : ""
                  }
                  key={exercise.exercise_id}
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "2fr 2fr 1fr 1fr 1fr",
                    alignItems: "center",
                    gap: 2,
                    ...(api.flashId && exercise.exercise_id === api.flashId
                      ? { animation: "flash-bg 2.5s ease-in-out" }
                      : {}),
                  }}>
                  <Stack>
                    <DisplayTime performedAt={exercise.performed_at!} />
                  </Stack>
                  <Stack>
                    <DisplayWeight
                      weightValue={
                        exercise.actual_weight_value ??
                        exercise.target_weight_value!
                      }
                      weightUnit={exercise.weight_unit!}
                      reps={exercise.reps ?? undefined}
                    />
                    <DisplayBarbellThumbnail
                      targetWeight={
                        exercise.actual_weight_value ??
                        exercise.target_weight_value!
                      }
                      // TODO - Add this to the exercise table
                      barWeight={45}
                      roundingMode={RoundingMode.NEAREST}
                      availablePlates={props.availablePlatesLbs}
                      weightUnit={exercise.weight_unit!}
                    />
                  </Stack>
                  <Stack>
                    {exercise.relative_effort && (
                      <DisplayPercievedEffort
                        percievedEffort={exercise.relative_effort}
                      />
                    )}
                  </Stack>
                  <Stack>
                    <DisplayCompletionStatus
                      completionStatus={exercise.completion_status!}
                    />
                  </Stack>
                  <Stack>
                    <Typography
                      component={Link}
                      href={pathForBarbellExerciseEdit(
                        exercise.exercise_type!,
                        exercise.exercise_id!
                      )}>
                      Edit
                    </Typography>
                  </Stack>
                </Stack>
              );
            })}
          </Stack>
        );
      })}
    </Stack>
  );
};

export default BarbellExercisesTable;
