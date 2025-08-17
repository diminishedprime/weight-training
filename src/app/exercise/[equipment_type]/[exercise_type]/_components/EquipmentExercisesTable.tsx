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
import { Paths, SearchParam, WithSearchParams } from "@/constants";
import { Button, Chip, Paper, Stack, Typography } from "@mui/material";
import { format } from "date-fns";
import { useSearchParams } from "next/navigation";
import React, { useCallback } from "react";

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
    // Always push the last group if it has any entries
    if (currentGroup.length > 0) {
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
  // TODO: easy, this should be part of the api.
  const { equipmentType, exerciseType } = props;
  const hrefFor = useCallback(
    (pageNum: number) =>
      WithSearchParams(
        Paths.Exercise_EquipmentType_ExerciseType(equipmentType, exerciseType),
        [SearchParam.PageNum, pageNum.toString()],
      ),
    [equipmentType, exerciseType],
  );

  return (
    <Stack>
      <Pagination
        page={props.pageNum}
        count={props.pageCount}
        hrefFor={hrefFor}
      />
      {api.groupedByDay.map((group, idx) => {
        const date = getDateString(group[0]!.performed_at!);
        return (
          <Stack key={`${group[0]?.exercise_id}-${idx}`}>
            <Typography variant="h5">{date}</Typography>
            {group.map((exercise) => {
              const editPath = WithSearchParams(
                Paths.Exercise_EquipmentType_ExerciseType_Edit_ExerciseId(
                  props.equipmentType,
                  props.exerciseType,
                  exercise.exercise_id!,
                ),
                [SearchParam.BackTo, props.currentPath],
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
        hrefFor={hrefFor}
      />
    </Stack>
  );
};

export default EquipmentExercisesTable;
