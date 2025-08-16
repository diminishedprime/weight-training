import {
  failExercise as serverFailExercise,
  finishExercise as serverFinishExercise,
  skipExercise as serverSkipExercise,
} from "@/app/superblocks/[superblock_id]/perform/_components/actions";
import ActiveExerciseRow from "@/app/superblocks/[superblock_id]/perform/_components/ActiveExerciseRow";
import CompletedExerciseRow from "@/app/superblocks/[superblock_id]/perform/_components/CompletedExerciseRow";
import ExerciseRow from "@/app/superblocks/[superblock_id]/perform/_components/ExerciseRow";
import {
  GetPerformSuperblockResult,
  PerceivedEffort,
  RDispatch,
  SuperblockBlock,
  UserPreferences,
} from "@/common-types";
import DisplayCompletionStatus from "@/components/display/DisplayCompletionStatus";
import TODO from "@/components/TODO";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import confetti from "canvas-confetti";
import { Map as ImmutableMap } from "immutable";
import React, { useCallback, useMemo } from "react";

interface Props {
  userId: string;
  block: SuperblockBlock;
  initialSuperblock: GetPerformSuperblockResult;
  superblock: GetPerformSuperblockResult;
  setSuperblock: RDispatch<GetPerformSuperblockResult>;
  preferences: UserPreferences;
  path: string;
  open: boolean;
  setOpen: () => void;
  notify: boolean;
}

const Block: React.FC<Props> = (props) => {
  const { block } = props;
  const api = useBlockAPI(props);
  return (
    <Accordion disableGutters expanded={props.open} onChange={props.setOpen}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ px: 1 }}>
        <Stack spacing={1} direction="row" alignItems="center">
          <DisplayCompletionStatus completionStatus={block.completion_status} />
          <Typography>{block.name}</Typography>
        </Stack>
      </AccordionSummary>
      <AccordionDetails sx={{ p: 1 }}>
        <Stack spacing={1}>
          <TODO>
            There should be a way to add additional exercises to an on-going
            block. For example, adding extra warmups or cooldowns.
          </TODO>
          <TODO>Include the wendler detail data right around here.</TODO>
          <TODO>Include the start-time here once it's set</TODO>
          <TODO>Include the end-time here once it's set</TODO>
          <TODO>Include the duration here once both are set.</TODO>
          <Stack useFlexGap>
            {block.exercises.map((exercise, idx) => {
              return (
                <React.Fragment key={exercise.id}>
                  <Divider />
                  {block.active_exercise_id === exercise.id ? (
                    <ActiveExerciseRow
                      superblockId={props.initialSuperblock.id}
                      exercise={exercise}
                      preferences={props.preferences}
                      blockId={block.id}
                      finishExercise={api.finishExercise}
                      failExercise={api.failExercise}
                      skipExercise={api.skipExercise}
                      setName={
                        idx === block.exercises.length - 1
                          ? "Ultima series optima"
                          : api.setNames.get(exercise.id, "")
                      }
                      notify={props.notify}
                    />
                  ) : exercise.completion_status === "completed" ||
                    exercise.completion_status === "failed" ? (
                    <CompletedExerciseRow
                      userId={props.userId}
                      superblockId={props.superblock.id}
                      exercise={exercise}
                      preferences={props.preferences}
                      setName={api.setNames.get(exercise.id, "")}
                      currentPath={props.path}
                    />
                  ) : (
                    <ExerciseRow
                      exercise={exercise}
                      preferences={props.preferences}
                      setName={api.setNames.get(exercise.id, "")}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </Stack>
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
};
export default Block;

export type PerformFinishExercise = ReturnType<
  typeof useBlockAPI
>["finishExercise"];
export type PerformFailExercise = ReturnType<
  typeof useBlockAPI
>["failExercise"];
export type PerformSkipExercise = ReturnType<
  typeof useBlockAPI
>["skipExercise"];

const useBlockAPI = (props: Props) => {
  const {
    userId,
    block,
    superblock: { id: superblockId, completion_status },
    setSuperblock,
  } = props;

  const finishExercise = useCallback(
    async (
      blockId: string,
      activeExerciseId: string,
      actualWeightValue: number,
      reps: number,
      isWarmup: boolean,
      isAmrap: boolean,
      notes: string,
      perceivedEffort: PerceivedEffort | null,
    ) => {
      const result = await serverFinishExercise(
        userId,
        superblockId,
        blockId,
        activeExerciseId,
        actualWeightValue,
        reps,
        isWarmup,
        isAmrap,
        notes,
        perceivedEffort,
      );
      if (
        result.completion_status === "completed" &&
        completion_status !== "completed"
      ) {
        confetti();
      }
      setSuperblock(result);
    },
    [superblockId, userId, completion_status, setSuperblock],
  );

  const failExercise = useCallback(
    async (
      blockId: string,
      activeExerciseId: string,
      actualWeightValue: number,
      reps: number,
      isWarmup: boolean,
      isAmrap: boolean,
      notes: string,
      perceivedEffort: PerceivedEffort | null,
    ) => {
      const result = await serverFailExercise(
        userId,
        superblockId,
        blockId,
        activeExerciseId,
        actualWeightValue,
        reps,
        isWarmup,
        isAmrap,
        notes,
        perceivedEffort,
      );
      setSuperblock(result);
    },
    [superblockId, userId, setSuperblock],
  );
  const skipExercise = useCallback(
    async (blockId: string, activeExerciseId: string, notes: string) => {
      const result = await serverSkipExercise(
        userId,
        superblockId,
        blockId,
        activeExerciseId,
        notes,
      );
      setSuperblock(result);
    },
    [superblockId, userId, setSuperblock],
  );

  const setNames = useMemo(() => {
    return [
      ...block.exercises
        .filter((e) => e.is_warmup)
        .map((e, idx) => [e.id, `Warmup ${idx + 1}`]),
      ...block.exercises
        .filter((e) => !e.is_warmup)
        .map((e, idx) => [e.id, `Working Set ${idx + 1}`]),
    ].reduce(
      (acc, [id, name]) => acc.set(id, name),
      ImmutableMap<string, string>(),
    );
  }, [block]);

  return {
    failExercise,
    skipExercise,
    finishExercise,
    setNames,
  };
};
