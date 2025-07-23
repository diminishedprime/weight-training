"use client";
import { useAddEquipmentExerciseAPI } from "@/app/exercise/[equipment_type]/[exercise_type]/_components/AddEquipmentExercise/useAddEquipmentExerciseAPI";
import {
  CompletionStatus,
  EquipmentType,
  ExerciseType,
  UserPreferences,
} from "@/common-types";
import EditNotes from "@/components/edit/EditNotes";
import SelectCompletionStatus from "@/components/select/SelectCompletionStatus";
import SelectPerceivedEffort from "@/components/select/SelectPerceivedEffort";
import SelectReps from "@/components/select/SelectReps";
import SelectWarmup from "@/components/select/SelectWarmup";
import { TestIds } from "@/test-ids";
import { Button, Stack } from "@mui/material";
import React from "react";

export interface AddEquipmentExerciseProps {
  equipmentType: EquipmentType;
  exerciseType: ExerciseType;
  userId: string;
  // TODO: there is probably a _much_ better way to type this.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialDraft: Record<string, any> | null;
  preferences: UserPreferences;
  path: string;
}

const AddEquipmentExercise: React.FC<AddEquipmentExerciseProps> = (props) => {
  const api = useAddEquipmentExerciseAPI(props);

  if (api.showAddEquipmentExerciseButton) {
    return (
      <form action={api.boundSaveFormDraftAction}>
        <Button
          variant="contained"
          color="primary"
          type="submit"
          data-testid={TestIds.AddExerciseButton}
        >
          Add Exercise
        </Button>
      </form>
    );
  }
  return (
    <React.Fragment>
      {api.EquipmentWeightEditor}
      <Stack spacing={1} alignItems="center">
        <SelectReps
          reps={api.reps}
          onRepsChange={(reps: number) => api.setReps(reps)}
          // TODO: re-update this to properly support amrap.
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
            // TODO: I should probably clean this up so it's just using
            // undefined everywhere.
            perceivedEffort={api.perceivedEffort ?? null}
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
          <form action={api.boundClearEquipmentFormDraft}>
            <Button variant="outlined" color="error" type="submit">
              Cancel
            </Button>
          </form>
          <Button
            variant="outlined"
            color="warning"
            onClick={api.resetCommonFields}
          >
            Reset
          </Button>
        </Stack>
        <Stack direction="row" spacing={1}>
          <form
            action={api.boundAddEquipmentExerciseAction}
            onSubmit={api.handleAddEquipmentExerciseClick}
          >
            <Button
              color="primary"
              variant="contained"
              type="submit"
              data-testid={api.addExerciseTestId}
            >
              Add
            </Button>
          </form>
        </Stack>
      </Stack>
    </React.Fragment>
  );
};

export default AddEquipmentExercise;
