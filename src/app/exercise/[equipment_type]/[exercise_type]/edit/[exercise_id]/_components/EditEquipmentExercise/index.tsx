"use client";
import { useEditEquipmentExerciseAPI } from "@/app/exercise/[equipment_type]/[exercise_type]/edit/[exercise_id]/_components/EditEquipmentExercise/useEditEquipmentExerciseAPI";
import {
  CompletionStatus,
  EquipmentType,
  ExerciseType,
  GetExerciseResult,
  UserPreferences,
} from "@/common-types";
import EditNotes from "@/components/edit/EditNotes";
import SelectCompletionStatus from "@/components/select/SelectCompletionStatus";
import SelectPerceivedEffort from "@/components/select/SelectPerceivedEffort";
import SelectReps from "@/components/select/SelectReps";
import SelectWarmup from "@/components/select/SelectWarmup";
import { TestIds } from "@/test-ids";
import { Button, Stack } from "@mui/material";
import Link from "next/link";
import React from "react";

export interface EditEquipmentExerciseProps {
  equipmentType: EquipmentType;
  exerciseType: ExerciseType;
  userId: string;
  currentPath: string;
  exercise: GetExerciseResult;
  preferences: UserPreferences;
  backTo: string | undefined;
}

const EditEquipmentExercise: React.FC<EditEquipmentExerciseProps> = (props) => {
  const api = useEditEquipmentExerciseAPI(props);
  return (
    <React.Fragment>
      {api.EquipmentWeightEditor}
      <Stack spacing={1} alignItems="center">
        <SelectReps
          reps={api.reps}
          onRepsChange={(reps: number) => api.setReps(reps)}
          setIsAmrap={api.setIsAMRAP}
          isAmrap={api.isAmrap}
        />
        <Stack
          direction="row"
          spacing={1}
          flexWrap="wrap"
          justifyContent="space-between"
          alignItems="flex-end"
          useFlexGap
        >
          <SelectCompletionStatus
            completionStatus={api.completionStatus}
            onCompletionStatusChange={(status: CompletionStatus) =>
              api.setCompletionStatus(status)
            }
          />
          <SelectPerceivedEffort
            perceivedEffort={api.perceivedEffort}
            onPerceivedEffortChange={api.setPerceivedEffort}
          />
          <SelectWarmup
            isWarmup={api.isWarmup}
            onWarmupChange={api.setIsWarmup}
          />
        </Stack>
        <EditNotes notes={api.notes} onNotesChange={api.setNotes} />
      </Stack>
      <Stack
        spacing={1}
        direction="row"
        flexWrap="wrap"
        useFlexGap
        justifyContent="space-between"
      >
        <Stack direction="row" spacing={1}>
          {props.backTo && (
            <Button
              data-testid={TestIds.EditEquipmentCancelButton}
              variant="outlined"
              color="error"
              component={Link}
              href={props.backTo}
            >
              Cancel
            </Button>
          )}
          <Button
            data-testid={TestIds.EditEquipmentResetButton}
            variant="outlined"
            color="warning"
            onClick={api.resetCommonFields}
            disabled={api.resetDisabled}
          >
            Reset
          </Button>
        </Stack>
        <Stack direction="row" spacing={1}>
          <form action={api.boundSaveExerciseAction}>
            <Button
              data-testid={TestIds.EditEquipmentSaveButton}
              color="primary"
              variant="contained"
              type="submit"
              disabled={api.saveDisabled}
            >
              Save
            </Button>
          </form>
        </Stack>
      </Stack>
    </React.Fragment>
  );
};

export default EditEquipmentExercise;
