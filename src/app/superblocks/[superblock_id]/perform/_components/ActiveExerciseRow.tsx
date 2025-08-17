"use client";
import { bustCache } from "@/app/superblocks/[superblock_id]/perform/_components/actions";
import { RDispatch, RoundingMode, UserPreferences } from "@/common-types";
import {
  GetPerformSuperblockExercise,
  GetPerformSuperblockResult,
} from "@/common-types/get-perform-superblock";
import DisplayCompletionStatus from "@/components/display/DisplayCompletionStatus";
import DisplayStopwatch from "@/components/display/DisplayStopwatch";
import EditNotes from "@/components/edit/EditNotes";
import EquipmentWeightEditor from "@/components/edit/weight/EquipmentWeightEditor";
import LabeledValue from "@/components/LabeledValue";
import SelectPerceivedEffort from "@/components/select/SelectPerceivedEffort";
import SelectReps from "@/components/select/SelectReps";
import { Paths } from "@/constants";
import { usePersistentBoolean, useRPCMutation } from "@/hooks";
import { TestIds } from "@/test-ids";
import EditIcon from "@mui/icons-material/Edit";
import { Button, IconButton, Stack, Typography } from "@mui/material";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

interface ActiveExerciseRowProps {
  userId: string;
  blockId: string;
  superblockId: string;
  exercise: GetPerformSuperblockExercise;
  setSuperblock: RDispatch<GetPerformSuperblockResult>;
  preferences: UserPreferences;
  setName: string;
  notify: boolean;
}

const ActiveExerciseRow: React.FC<ActiveExerciseRowProps> = (props) => {
  const api = useActiveExerciseRowAPI(props);
  return (
    <Stack
      sx={{
        my: 1,
        opacity: api.isPending ? 0.5 : 1,
        transition: "opacity 0.4s ease",
      }}
      spacing={1}
      data-testid={TestIds.Superblocks_SuperblockId_Perform__ActiveExerciseRow}
    >
      <Stack
        direction="row"
        spacing={1}
        display="grid"
        gridTemplateColumns="1fr 1fr 1fr"
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
      <Stack direction="row" justifyContent="space-between">
        <Button
          variant="outlined"
          size="small"
          disabled={api.completeDisabled}
          onClick={api.failExercise}
          startIcon={<DisplayCompletionStatus completionStatus="failed" />}
          data-testid={TestIds.Superblocks_SuperblockId_Perform__FailExercise}
        >
          Failed
        </Button>
        <Button
          variant="outlined"
          size="small"
          disabled={api.completeDisabled}
          onClick={api.skipExercise}
          startIcon={<DisplayCompletionStatus completionStatus="skipped" />}
          data-testid={TestIds.Superblocks_SuperblockId_Perform__SkipExercise}
        >
          Skip
        </Button>
        <Button
          variant="outlined"
          size="small"
          disabled={api.completeDisabled}
          onClick={api.finishExercise}
          startIcon={<DisplayCompletionStatus completionStatus="completed" />}
          data-testid={TestIds.Superblocks_SuperblockId_Perform__FinishExercise}
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
    userId,
    superblockId,
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
    setSuperblock,
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

  const afterServerAction = useCallback(async () => {
    bustCache(superblockId);
  }, [superblockId]);

  const { trigger: finishExerciseTrigger, isMutating: finishExerciseMutating } =
    useRPCMutation(
      "finish_exercise",
      useCallback((e) => `Error calling finish exercise: ${e}`, []),
      afterServerAction,
      setSuperblock,
    );

  const finishExercise = useCallback(async () => {
    if (actual === null) {
      console.error(
        "Invalid invariant: actualWeightValue must not be undefined.",
      );
      return;
    }
    await finishExerciseTrigger({
      p_block_id: blockId,
      p_exercise_id: exerciseId,
      p_actual_weight_value: actual,
      p_reps: reps,
      p_is_warmup: isWarmup,
      p_is_amrap: isAMRAP,
      p_notes: notes,
      p_perceived_effort: perceivedEffort ?? undefined,
      p_superblock_id: superblockId,
      p_user_id: userId,
    });
  }, [
    actual,
    blockId,
    exerciseId,
    isAMRAP,
    isWarmup,
    notes,
    perceivedEffort,
    reps,
    finishExerciseTrigger,
    superblockId,
    userId,
  ]);

  const { trigger: failExerciseTrigger, isMutating: failExerciseMutating } =
    useRPCMutation(
      "fail_exercise",
      useCallback((e) => `Error calling fail exercise: ${e}`, []),
      afterServerAction,
      setSuperblock,
    );

  const failExercise = useCallback(async () => {
    if (actual === null) {
      console.error(
        "Invalid invariant: actualWeightValue must not be undefined.",
      );
      return;
    }
    await failExerciseTrigger({
      p_block_id: blockId,
      p_exercise_id: exerciseId,
      p_actual_weight_value: actual,
      p_reps: reps,
      p_is_warmup: isWarmup,
      p_is_amrap: isAMRAP,
      p_notes: notes,
      p_perceived_effort: perceivedEffort ?? undefined,
      p_superblock_id: superblockId,
      p_user_id: userId,
    });
  }, [
    actual,
    blockId,
    exerciseId,
    isAMRAP,
    isWarmup,
    notes,
    perceivedEffort,
    reps,
    superblockId,
    userId,
    failExerciseTrigger,
  ]);

  const { trigger: skipExerciseTrigger, isMutating: skipExerciseMutating } =
    useRPCMutation(
      "skip_exercise",
      useCallback((e) => `Error calling skip exercise: ${e}`, []),
      afterServerAction,
      setSuperblock,
    );

  const skipExercise = useCallback(async () => {
    await skipExerciseTrigger({
      p_block_id: blockId,
      p_exercise_id: exerciseId,
      p_notes: notes,
      p_superblock_id: superblockId,
      p_user_id: userId,
    });
  }, [blockId, exerciseId, notes, superblockId, userId, skipExerciseTrigger]);

  const isPending = useMemo(
    () =>
      finishExerciseMutating || failExerciseMutating || skipExerciseMutating,
    [finishExerciseMutating, failExerciseMutating, skipExerciseMutating],
  );

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

  const completeDisabled = useMemo(() => actual === null, [actual]);

  return {
    isPending,
    completeDisabled,
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
