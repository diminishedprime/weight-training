"use client";
import { Button, Stack } from "@mui/material";
import React from "react";
import { useDebouncedCallback } from "use-debounce";
import {
  addBarbellExercise,
  addBarbellFormDraft,
  deleteBarbellFormDraft,
  saveBarbellFormDraft,
} from "@/app/exercise/barbell/[barbell_exercise_type]/_components/AddBarbellExercise/actions";
import BarbellEditor from "@/components/BarbellEditor";
import {
  CompletionStatus,
  ExerciseType,
  PercievedEffort,
  RoundingMode,
  WeightUnit,
} from "@/common-types";
import SelectReps from "@/components/select/SelectReps";
import SelectCompletionStatus from "@/components/select/SelectCompletionStatus";
import SelectPercievedEffort from "@/components/select/SelectPercievedEffort";
import SelectWarmup from "@/components/select/SelectWarmup";
import { TestIds } from "@/test-ids";
import EditNotes from "@/components/EditNotes";

export interface BarbellFormDraft {
  actualWeight: number;
  barWeight: number;
  weightUnit: WeightUnit;
  roundingMode: RoundingMode;
  reps: number;
  completionStatus: CompletionStatus;
  notes: string | undefined;
  percievedEffort: PercievedEffort | undefined;
  isWarmup: boolean;
  isAmrap: boolean;
}

const useAddBarbellExerciseAPI = (props: AddBarbellExerciseProps) => {
  const { initialBarbellFormDraft: initialDraft, userId, path } = props;

  const defaults: BarbellFormDraft = React.useMemo(() => {
    return {
      targetWeight: 45,
      actualWeight: 45,
      barWeight: 45,
      weightUnit: "pounds",
      roundingMode: RoundingMode.NEAREST,
      completionStatus: "completed",
      reps: 5,
      notes: "",
      percievedEffort: undefined,
      isWarmup: false,
      isAmrap: false,
    };
  }, []);

  const [actualWeight, setActualWeight] = React.useState<number>(
    initialDraft?.actualWeight ?? defaults.actualWeight
  );
  const [roundingMode] = React.useState<RoundingMode>(
    initialDraft?.roundingMode ?? defaults.roundingMode
  );
  const [barWeight] = React.useState<number>(
    initialDraft?.barWeight ?? defaults.barWeight
  );
  const [weightUnit] = React.useState<WeightUnit>(
    initialDraft?.weightUnit ?? defaults.weightUnit
  );
  const [reps, setReps] = React.useState<number>(
    initialDraft?.reps ?? defaults.reps
  );
  const [completionStatus, setCompletionStatus] =
    React.useState<CompletionStatus>(
      initialDraft?.completionStatus ?? defaults.completionStatus
    );
  const [notes, setNotes] = React.useState<string | undefined>(
    initialDraft?.notes ?? defaults.notes
  );
  const [percievedEffort, setPercievedEffort] = React.useState<
    PercievedEffort | undefined
  >(initialDraft?.percievedEffort ?? defaults.percievedEffort);
  const [isWarmup, setIsWarmup] = React.useState<boolean>(
    initialDraft?.isWarmup ?? defaults.isWarmup
  );
  const [isAmrap, setIsAmrap] = React.useState<boolean>(
    initialDraft?.isAmrap ?? defaults.isAmrap
  );

  // Sync the current state when the initial values change
  React.useEffect(() => {
    if (initialDraft) {
      setActualWeight(initialDraft.actualWeight);
      setReps(initialDraft.reps);
      setCompletionStatus(initialDraft.completionStatus);
      setNotes(initialDraft.notes);
      setPercievedEffort(initialDraft.percievedEffort);
      setIsWarmup(initialDraft.isWarmup);
      setIsAmrap(initialDraft.isAmrap);
    }
  }, [initialDraft]);

  const barbellFormDraft: BarbellFormDraft = React.useMemo(
    () => ({
      actualWeight,
      barWeight,
      weightUnit,
      roundingMode,
      reps,
      completionStatus,
      notes,
      percievedEffort,
      isWarmup,
      isAmrap,
    }),
    [
      actualWeight,
      barWeight,
      weightUnit,
      roundingMode,
      reps,
      completionStatus,
      notes,
      percievedEffort,
      isWarmup,
      isAmrap,
    ]
  );

  const debouncedSave = useDebouncedCallback(
    async (userId, path, barbellFormDraft) => {
      await saveBarbellFormDraft(userId, path, barbellFormDraft);
    },
    1000,
    { trailing: true }
  );

  React.useEffect(() => {
    debouncedSave(userId, path, barbellFormDraft);
    return () => {
      debouncedSave.cancel();
    };
  }, [userId, path, debouncedSave, barbellFormDraft]);

  const reset = React.useCallback(() => {
    setActualWeight(defaults.actualWeight);
    setReps(defaults.reps);
    setCompletionStatus(defaults.completionStatus);
    setNotes(defaults.notes);
    setPercievedEffort(defaults.percievedEffort);
    setIsWarmup(defaults.isWarmup);
    setIsAmrap(defaults.isAmrap);
  }, [defaults]);

  const showAddBarbellLiftButton = React.useMemo(() => {
    return initialDraft === null;
  }, [initialDraft]);

  return {
    showAddBarbellLiftButton,
    barbellFormDraft,
    reset,
    actualWeight,
    setActualWeight,
    roundingMode,
    barWeight,
    weightUnit,
    reps,
    setReps,
    completionStatus,
    setCompletionStatus,
    notes,
    setNotes,
    percievedEffort,
    setPercievedEffort,
    isWarmup,
    setIsWarmup,
    isAmrap,
    setIsAmrap,
    defaultBarbellFormDraft: defaults,
  };
};

interface AddBarbellExerciseProps {
  userId: string;
  path: string;
  exerciseType: ExerciseType;
  availablePlatesLbs: number[];
  initialBarbellFormDraft: BarbellFormDraft | null;
}

const AddBarbellExercise: React.FC<AddBarbellExerciseProps> = (props) => {
  const api = useAddBarbellExerciseAPI(props);

  if (api.showAddBarbellLiftButton) {
    return (
      <form
        action={addBarbellFormDraft.bind(
          null,
          props.userId,
          props.path,
          api.barbellFormDraft
        )}>
        <Button
          variant="contained"
          color="primary"
          type="submit"
          data-testid={TestIds.AddExerciseButton}>
          Add Exercise
        </Button>
      </form>
    );
  }
  return (
    <React.Fragment>
      <Stack spacing={1} alignItems="center">
        <BarbellEditor
          editing
          targetWeight={api.actualWeight}
          onTargetWeightChange={api.setActualWeight}
          roundingMode={api.roundingMode}
          weightUnit={api.weightUnit}
          availablePlates={props.availablePlatesLbs}
          // TODO: rename to barbellWeightValue
          barWeight={api.barWeight}
        />
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
          useFlexGap>
          <SelectCompletionStatus
            completionStatus={api.completionStatus}
            onCompletionStatusChange={(status: CompletionStatus) =>
              api.setCompletionStatus(status)
            }
          />
          <SelectPercievedEffort
            // TODO: I should probably clean this up so it's just using
            // undefined everywhere.
            percievedEffort={api.percievedEffort ?? null}
            onPercievedEffortChange={(effort: PercievedEffort | null) =>
              api.setPercievedEffort(effort ?? undefined)
            }
          />
          <SelectWarmup
            isWarmup={api.isWarmup}
            onWarmupChange={(isWarmup: boolean) => api.setIsWarmup(isWarmup)}
          />
        </Stack>
        <EditNotes notes={api.notes} onNotesChange={api.setNotes} />
      </Stack>
      <Stack
        spacing={1}
        direction="row"
        flexWrap="wrap"
        useFlexGap
        justifyContent="space-between">
        <Stack direction="row" spacing={1}>
          <form
            action={deleteBarbellFormDraft.bind(
              null,
              props.userId,
              props.path
            )}>
            <Button variant="outlined" color="error" type="submit">
              Cancel
            </Button>
          </form>
          <Button variant="outlined" color="warning" onClick={api.reset}>
            Reset
          </Button>
        </Stack>
        <Stack direction="row" spacing={1}>
          <form
            action={addBarbellExercise.bind(
              null,
              props.userId,
              props.exerciseType,
              api.actualWeight,
              api.reps,
              api.completionStatus,
              api.isAmrap,
              api.notes,
              api.percievedEffort,
              api.isWarmup,
              api.weightUnit,
              props.path,
              api.defaultBarbellFormDraft
            )}>
            <Button
              color="primary"
              variant="contained"
              type="submit"
              data-testid={TestIds.AddBarbellLiftButton}>
              Add
            </Button>
          </form>
        </Stack>
      </Stack>
    </React.Fragment>
  );
};

export default AddBarbellExercise;
