"use client";
import { ExercisesByTypeResultRows, ExerciseType } from "@/common-types";
import DisplayCompletionStatus from "@/components/display/DisplayCompletionStatus";
import DisplayDumbbell from "@/components/display/DisplayDumbbell";
import DisplayNotes from "@/components/display/DisplayNotes";
import DisplayPerceivedEffort from "@/components/display/DisplayPerceivedEffort";
import DisplayTime from "@/components/display/DisplayTime";
import DisplayWeight from "@/components/display/DisplayWeight";
import Pagination from "@/components/Pagination";
import {
  pathForEquipmentExerciseEdit,
  pathForPaginatedEquipmentExercisePage,
} from "@/constants";
import { Stack, Typography } from "@mui/material";
import { format } from "date-fns";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React from "react";

export interface DumbbellExercisesTableProps {
  dumbbellExercises: NonNullable<ExercisesByTypeResultRows>;
  dumbbellExerciseType: ExerciseType;
  availableDumbbells: number[];
  path: string;
  pageNum: number;
  pageCount: number;
  startExerciseId?: string;
}

function getDateString(performedAt: string) {
  return format(new Date(performedAt), "yyyy-MM-dd");
}

export function useExercisesTableAPI(props: DumbbellExercisesTableProps) {
  const { dumbbellExercises } = props;
  const searchParams = useSearchParams();
  const flashId = searchParams.get("flash");

  const groupedByDay = React.useMemo(() => {
    if (dumbbellExercises.length === 0) {
      return [];
    }
    const groups: NonNullable<ExercisesByTypeResultRows>[number][][] = [];
    let sanityIdx = 0;
    let currentIdx = 0;
    let currentGroup: NonNullable<ExercisesByTypeResultRows>[number][] = [];
    let currentDay = getDateString(dumbbellExercises[0].performed_at!);
    while (currentIdx < dumbbellExercises.length) {
      sanityIdx++;
      if (sanityIdx > dumbbellExercises.length * 2) {
        // Something has gone horribly wrong.
        throw new Error("Infinite loop detected in grouping exercises by day.");
      }
      const exercise = dumbbellExercises[currentIdx];
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
    // Don't forget to add the last group
    if (currentGroup.length > 0) {
      groups.push(currentGroup);
    }
    return groups;
  }, [dumbbellExercises]);

  return {
    flashId,
    groupedByDay,
  };
}

const DumbbellExercisesTable: React.FC<DumbbellExercisesTableProps> = (
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
            "dumbbell",
            props.dumbbellExerciseType,
            pageNum,
            pageNum === props.pageNum + 1 ? props.startExerciseId : undefined,
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
              const editPath = pathForEquipmentExerciseEdit(
                "dumbbell",
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
                      <DisplayWeight
                        weightValue={
                          exercise.actual_weight_value ??
                          exercise.target_weight_value!
                        }
                        weightUnit={exercise.weight_unit!}
                        reps={exercise.reps ?? undefined}
                      />
                      <DisplayDumbbell
                        weight={
                          exercise.actual_weight_value ??
                          exercise.target_weight_value!
                        }
                        weightUnit={exercise.weight_unit!}
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
      <Typography>{props.dumbbellExercises.length} Exercises</Typography>
    </Stack>
  );
};

export default DumbbellExercisesTable;
