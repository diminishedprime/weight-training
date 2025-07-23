"use client";
import {
  EquipmentType,
  ExercisesByTypeResultRows,
  ExerciseType,
} from "@/common-types";
import DisplayCompletionStatus from "@/components/display/DisplayCompletionStatus";
import DisplayNotes from "@/components/display/DisplayNotes";
import DisplayPerceivedEffort from "@/components/display/DisplayPerceivedEffort";
import DisplayTime from "@/components/display/DisplayTime";
import DisplayWeight from "@/components/display/DisplayWeight";
import Pagination from "@/components/Pagination";
import {
  pathForBarbellExerciseEdit,
  pathForPaginatedEquipmentExercisePage,
} from "@/constants";
import { Stack, Typography } from "@mui/material";
import { format } from "date-fns";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React from "react";

export interface EquipmentExercisesTableProps {
  exercises: NonNullable<ExercisesByTypeResultRows>;
  equipmentType: EquipmentType;
  exerciseType: ExerciseType;
  path: string;
  pageNum: number;
  pageCount: number;
}

function getDateString(performedAt: string) {
  return format(new Date(performedAt), "yyyy-MM-dd");
}

export function useExercisesTableAPI(props: EquipmentExercisesTableProps) {
  const { exercises } = props;
  const searchParams = useSearchParams();
  const flashId = searchParams.get("flash");

  const groupedByDay = React.useMemo(() => {
    if (exercises.length === 0) {
      return [];
    }

    const groups: NonNullable<ExercisesByTypeResultRows>[number][][] = [];
    let currentGroup: NonNullable<ExercisesByTypeResultRows>[number][] = [];
    let currentDay: string = getDateString(exercises[0].performed_at!);
    exercises.forEach((exercise) => {
      const dateForExercise = getDateString(exercise.performed_at!);
      if (dateForExercise === currentDay) {
        currentGroup.push(exercise);
      } else {
        groups.push(currentGroup);
        currentGroup = [exercise];
        currentDay = dateForExercise;
      }
    });
    // If groups.length is 0, and currentGroup is not empty, everything was on
    // the same day, so we want to push it in now.
    if (groups.length === 0 && currentGroup.length > 0) {
      groups.push(currentGroup);
    }

    return groups;
  }, [exercises]);

  return {
    flashId,
    groupedByDay,
  };
}

const EquipmentExercisesTable: React.FC<EquipmentExercisesTableProps> = (
  props,
) => {
  const api = useExercisesTableAPI(props);

  return (
    <Stack spacing={1}>
      <Pagination
        page={props.pageNum}
        count={props.pageCount}
        hrefFor={(pageNum) =>
          pathForPaginatedEquipmentExercisePage(
            props.equipmentType,
            props.exerciseType,
            pageNum,
          )
        }
      />
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
              }}
            >
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
            {group.map((exercise) => {
              const editPath = pathForBarbellExerciseEdit(
                exercise.exercise_type!,
                exercise.exercise_id!,
              );
              const params = new URLSearchParams();
              params.set("backTo", props.path);
              return (
                <React.Fragment key={exercise.exercise_id}>
                  <Stack
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "2fr 2fr 1fr 1fr 1fr",
                      alignItems: "center",
                      gap: 2,
                      ...(api.flashId && exercise.exercise_id === api.flashId
                        ? { animation: "flash-bg 2.5s ease-in-out" }
                        : {}),
                    }}
                  >
                    <Stack>
                      <DisplayTime performedAt={exercise.performed_at!} />
                    </Stack>
                    <Stack>
                      {/**
                       * TODO: I figured out a way to do this generically in
                       * AddEquipmentExercise, do something similiar here.
                       * */}
                      <DisplayWeight
                        weightValue={
                          exercise.actual_weight_value ??
                          exercise.target_weight_value!
                        }
                        weightUnit={exercise.weight_unit!}
                        reps={exercise.reps ?? undefined}
                      />
                    </Stack>
                    <Stack>
                      {exercise.perceived_effort && (
                        <DisplayPerceivedEffort
                          perceivedEffort={exercise.perceived_effort}
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
                        href={`${editPath}?${params.toString()}`}
                      >
                        Edit
                      </Typography>
                    </Stack>
                  </Stack>
                  {exercise.notes && (
                    <Stack gridColumn="1 / -1" sx={{ mt: 0.5 }}>
                      <DisplayNotes notes={exercise.notes} />
                    </Stack>
                  )}
                </React.Fragment>
              );
            })}
          </Stack>
        );
      })}
      <Typography>{props.exercises.length} Exercises</Typography>
    </Stack>
  );
};

export default EquipmentExercisesTable;
