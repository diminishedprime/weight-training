"use client";
import {
  PerformFailExercise,
  PerformFinishExercise,
  PerformSkipExercise,
} from "@/app/superblocks/[superblock_id]/perform/_components/Block";
import { RDispatch, RoundingMode, UserPreferences } from "@/common-types";
import { GetPerformSuperblockExercise } from "@/common-types/get-perform-superblock";
import DisplayCompletionStatus from "@/components/display/DisplayCompletionStatus";
import DisplayStopwatch from "@/components/display/DisplayStopwatch";
import EditNotes from "@/components/edit/EditNotes";
import EquipmentWeightEditor from "@/components/edit/weight/EquipmentWeightEditor";
import LabeledValue from "@/components/LabeledValue";
import SelectPerceivedEffort from "@/components/select/SelectPerceivedEffort";
import SelectReps from "@/components/select/SelectReps";
import { Paths } from "@/constants";
import { usePersistentBoolean } from "@/hooks";
import EditIcon from "@mui/icons-material/Edit";
import { Button, IconButton, Stack, Typography } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

interface ActiveExerciseRowProps {
  exercise: GetPerformSuperblockExercise;
  blockId: string;
  superblockId: string;
  finishExercise: PerformFinishExercise;
  failExercise: PerformFailExercise;
  skipExercise: PerformSkipExercise;
  preferences: UserPreferences;
  setName: string;
  notify: boolean;
}

const ActiveExerciseRow: React.FC<ActiveExerciseRowProps> = (props) => {
  const api = useActiveExerciseRowAPI(props);
  return (
    <Stack sx={{ my: 1 }} spacing={1}>
      <Stack
        direction="row"
        flex={1}
        spacing={1}
        alignItems="space-between"
        justifyContent={"space-between"}
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
        }}
      >
        <IconButton
          sx={{ justifySelf: "start" }}
          size="small"
          color="warning"
          onClick={() => api.setModifying((o) => !o)}
        >
          <EditIcon />
        </IconButton>
        {props.notify ? (
          <Typography color="secondary">Notifications On!</Typography>
        ) : (
          <Stack />
        )}
        <Typography variant="body1" justifySelf={"end"}>
          {props.setName}
        </Typography>
      </Stack>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="center"
        spacing={1}
      >
        <LabeledValue label="Reps" alignItems="center">
          <Typography variant="h4">
            {api.reps}
            {api.isAMRAP && (
              <Typography color="secondary" component="span">
                {" "}
                (AMRAP)
              </Typography>
            )}
          </Typography>
        </LabeledValue>
        {props.exercise.last_performed_at && (
          <LabeledValue label="Rest" alignItems="center">
            <DisplayStopwatch
              variant="h4"
              start={new Date(props.exercise.last_performed_at)}
              successThresholdSeconds={
                props.preferences.default_rest_time ?? undefined
              }
              millisecondsUntilThreshold
              onThresholdReached={api.safelyNotifyRestTimeUp}
            />
          </LabeledValue>
        )}
      </Stack>
      <EquipmentWeightEditor
        editing={api.modifying}
        equipmentType={props.exercise.equipment_type}
        serverTarget={props.exercise.target_weight_value}
        serverActual={props.exercise.actual_weight_value}
        weightUnit={props.exercise.weight_unit}
        onActualChange={api.setActual}
        onTargetChange={api.setTarget}
        roundingMode={RoundingMode.NEAREST}
        preferences={props.preferences}
        barWeight={45}
      />
      <Stack
        direction="row"
        spacing={1}
        flexWrap="wrap"
        justifyContent="center"
        alignItems={"end"}
        rowGap={1}
      >
        {(props.exercise.is_amrap || api.modifying) && (
          <SelectReps
            reps={api.reps}
            isAMRAP={api.isAMRAP}
            setIsAMRAP={api.setIsAMRAP}
            setReps={api.setReps}
            wendler1s={props.exercise.reps === 1}
            wendler3s={props.exercise.reps === 3}
            wendler5s={props.exercise.reps === 5}
          />
        )}
        {api.modifying && (
          <SelectPerceivedEffort
            perceivedEffort={api.perceivedEffort}
            setPerceivedEffortChange={api.setPerceivedEffort}
          />
        )}
      </Stack>
      {api.modifying && (
        <EditNotes notes={api.notes} onNotesChange={api.setNotes} />
      )}
      <Stack direction="row" justifyContent="space-between" sx={{ pt: 1 }}>
        <Button
          variant="outlined"
          size="small"
          onClick={api.failExercise}
          startIcon={<DisplayCompletionStatus completionStatus="failed" />}
        >
          Failed
        </Button>
        <Button
          variant="outlined"
          size="small"
          onClick={api.skipExercise}
          startIcon={<DisplayCompletionStatus completionStatus="skipped" />}
        >
          Skip
        </Button>
        <Button
          variant="outlined"
          size="small"
          onClick={api.finishExercise}
          startIcon={<DisplayCompletionStatus completionStatus="completed" />}
        >
          Finished
        </Button>
      </Stack>
    </Stack>
  );
};

export default ActiveExerciseRow;

const useActiveExerciseRowAPI = (props: ActiveExerciseRowProps) => {
  const {
    finishExercise: finishExerciseProps,
    failExercise: failExerciseProps,
    skipExercise: skipExerciseProps,
    exercise: {
      id: exerciseId,
      actual_weight_value,
      completion_status,
      reps: exercise_reps,
      is_warmup,
      is_amrap,
      notes: exercise_notes,
      perceived_effort,
    },
    preferences: { pushover_api_token, pushover_user_key },
    blockId,
    notify,
  } = props;
  const [modifying, setModifying] = useState(false);

  const [actual, setActual] = useState(actual_weight_value);
  const [target, setTarget] = useState(actual_weight_value);
  const [reps, setReps] = useState(exercise_reps);
  const [isWarmup, setIsWarmup] = useState(is_warmup);
  const [isAMRAP, setIsAMRAP] = useState(is_amrap);
  const [notes, setNotes] = useState(exercise_notes || "");
  const [completionStatus, setCompletionStatus] = useState(completion_status);
  const [perceivedEffort, setPerceivedEffort] = useState(perceived_effort);

  const finishExercise = useCallback(async () => {
    if (actual === null) {
      console.error(
        "Invalid invariant: actualWeightValue must not be undefined.",
      );
      return;
    }
    await finishExerciseProps(
      blockId,
      exerciseId,
      actual,
      reps,
      isWarmup,
      isAMRAP,
      notes,
      perceivedEffort,
    );
  }, [
    actual,
    blockId,
    exerciseId,
    finishExerciseProps,
    isAMRAP,
    isWarmup,
    notes,
    perceivedEffort,
    reps,
  ]);

  const failExercise = useCallback(async () => {
    if (actual === null) {
      console.error(
        "Invalid invariant: actualWeightValue must not be undefined.",
      );
      return;
    }
    await failExerciseProps(
      blockId,
      exerciseId,
      actual,
      reps,
      isWarmup,
      isAMRAP,
      notes,
      perceivedEffort,
    );
  }, [
    actual,
    blockId,
    exerciseId,
    isAMRAP,
    isWarmup,
    notes,
    perceivedEffort,
    reps,
    failExerciseProps,
  ]);

  const skipExercise = useCallback(async () => {
    await skipExerciseProps(blockId, exerciseId, notes);
  }, [blockId, exerciseId, notes, skipExerciseProps]);

  const [hasNotified, setHasNotified] = usePersistentBoolean(
    false,
    Paths.Superblocks_SuperblockId_Perform(props.superblockId),
    exerciseId,
  );
  const debouncedNotify = useDebouncedCallback(
    async (
      notify: boolean,
      hasNotified: boolean,
      setHasNotified: RDispatch<boolean>,
      pushoverAPIToken: string | null,
      pushoverUserKey: string | null,
    ) => {
      // Don't notify if we have, or we don't want to.
      if (!notify || hasNotified || !pushoverAPIToken || !pushoverUserKey) {
        return;
      }
      setHasNotified((_) => true);

      const formData = new FormData();
      formData.append("token", pushoverAPIToken);
      formData.append("user", pushoverUserKey);
      formData.append("message", "Rest time is over!");

      await fetch("https://api.pushover.net/1/messages.json", {
        method: "POST",
        body: formData,
      });
    },
    100,
  );

  const safelyNotifyRestTimeUp = useCallback(
    (secondsSince: number) => {
      // If it's been more than a minute, and we haven't already notified, we
      // won't bother notifying.
      if (secondsSince > 60) {
        return;
      }
      debouncedNotify(
        notify,
        hasNotified,
        setHasNotified,
        pushover_api_token,
        pushover_user_key,
      );
    },
    [
      notify,
      debouncedNotify,
      hasNotified,
      setHasNotified,
      pushover_api_token,
      pushover_user_key,
    ],
  );

  useEffect(() => {
    return () => {
      debouncedNotify.cancel();
    };
  }, [debouncedNotify]);

  return {
    actual,
    setActual,
    target,
    setTarget,
    safelyNotifyRestTimeUp,
    setActualWeightValue: setActual,
    reps,
    setReps,
    isWarmup,
    setIsWarmup,
    isAMRAP,
    setIsAMRAP,
    notes,
    setNotes,
    perceivedEffort,
    setPerceivedEffort,
    modifying,
    setModifying,
    completionStatus,
    setCompletionStatus,
    finishExercise,
    skipExercise,
    failExercise,
  };
};
