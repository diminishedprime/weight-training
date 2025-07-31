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
import LabeledValue from "@/components/LabeledValue";
import Link from "@/components/Link";
import Pagination from "@/components/Pagination";
import {
  pathForEquipmentExerciseEdit,
  pathForPaginatedEquipmentExercisePage,
} from "@/constants";
import { Button, Chip, Paper, Stack, Typography } from "@mui/material";
import { format } from "date-fns";
import { useSearchParams } from "next/navigation";
import React from "react";

export interface EquipmentExercisesTableProps {
  exercises: NonNullable<ExercisesByTypeResultRows>;
  equipmentType: EquipmentType;
  exerciseType: ExerciseType;
  currentPath: string;
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
            {group.map((exercise) => {
              const editPath = pathForEquipmentExerciseEdit(
                exercise.equipment_type!,
                exercise.exercise_type!,
                exercise.exercise_id!,
                props.currentPath,
              );
              return (
                <React.Fragment key={exercise.exercise_id}>
                  <Stack component={Paper} sx={{ p: 0.5, m: 0.5 }}>
                    {exercise.personal_record && (
                      <Chip
                        sx={{ alignSelf: "start", m: 1 }}
                        size="small"
                        color="success"
                        label={"PR!"}
                      />
                    )}
                    <Stack
                      sx={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr",
                        ...(api.flashId && exercise.exercise_id === api.flashId
                          ? { animation: "flash-bg 2.5s ease-in-out" }
                          : {}),
                      }}
                    >
                      <LabeledValue label="Time">
                        <DisplayTime performedAt={exercise.performed_at!} />
                      </LabeledValue>
                      <LabeledValue label="Weight">
                        <DisplayWeight
                          weightValue={
                            exercise.actual_weight_value ??
                            exercise.target_weight_value!
                          }
                          weightUnit={exercise.weight_unit!}
                        />
                      </LabeledValue>
                      <LabeledValue label="Reps">
                        {exercise.reps}
                        {exercise.is_amrap}
                      </LabeledValue>
                      <LabeledValue label="Effort">
                        {exercise.perceived_effort && (
                          <DisplayPerceivedEffort
                            perceivedEffort={exercise.perceived_effort}
                          />
                        )}
                      </LabeledValue>
                      <LabeledValue label="Status">
                        <DisplayCompletionStatus
                          completionStatus={exercise.completion_status!}
                        />
                      </LabeledValue>
                    </Stack>
                    <Button
                      sx={{ alignSelf: "start" }}
                      component={Link}
                      href={`${editPath}`}
                      underline="hover"
                    >
                      Edit
                    </Button>
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
    </Stack>
  );
};

export default EquipmentExercisesTable;
