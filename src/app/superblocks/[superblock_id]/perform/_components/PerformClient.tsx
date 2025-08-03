"use client";

import {
  failExercise as serverFailExercise,
  finishExercise as serverFinishExercise,
  skipExercise as serverSkipExercise,
} from "@/app/superblocks/[superblock_id]/perform/_components/actions";
import ActiveExerciseRow from "@/app/superblocks/[superblock_id]/perform/_components/ActiveExerciseRow";
import ExerciseRow from "@/app/superblocks/[superblock_id]/perform/_components/ExerciseRow";
import {
  GetPerformSuperblockResult,
  PerceivedEffort,
  UserPreferences,
} from "@/common-types";
import DisplayCompletionStatus from "@/components/display/DisplayCompletionStatus";
import DisplayDuration from "@/components/display/DisplayDuration";
import DisplayStopwatch from "@/components/display/DisplayStopwatch";
import LabeledValue from "@/components/LabeledValue";
import Link from "@/components/Link";
import TODO from "@/components/TODO";
import { PATHS } from "@/constants";
import EditIcon from "@mui/icons-material/Edit";
import {
  IconButton,
  Stack,
  Step,
  StepButton,
  StepContent,
  Stepper,
  Typography,
} from "@mui/material";
import { useCallback, useEffect, useMemo, useState } from "react";

interface PerformClientProps {
  userId: string;
  initialSuperblock: GetPerformSuperblockResult;
  preferences: UserPreferences;
}

export type PerformFinishExercise = ReturnType<
  typeof usePerformClientAPI
>["finishExercise"];
export type PerformFailExercise = ReturnType<
  typeof usePerformClientAPI
>["failExercise"];
export type PerformSkipExercise = ReturnType<
  typeof usePerformClientAPI
>["skipExercise"];

const PerformClient: React.FC<PerformClientProps> = (props) => {
  const api = usePerformClientAPI(props);
  return (
    <Stack spacing={1}>
      <Typography
        variant="h5"
        sx={{ display: "flex", alignItems: "center" }}
        gap={1}
      >
        <DisplayCompletionStatus
          completionStatus={api.superblock.completion_status}
        />
        {api.superblock.name}
        <IconButton
          component={Link}
          href={PATHS.Superblocks_Id_Edit(props.initialSuperblock.id)}
        >
          <EditIcon />
        </IconButton>
      </Typography>
      {api.superblock.completion_status === "in_progress" &&
        api.superblock.started_at && (
          <LabeledValue label="Since start">
            <DisplayStopwatch start={new Date(api.superblock.started_at)} />
          </LabeledValue>
        )}
      {api.superblock.completion_status === "completed" &&
        api.superblock.started_at &&
        api.superblock.completed_at && (
          <LabeledValue label="Duration">
            <DisplayDuration
              from={new Date(api.superblock.started_at)}
              to={new Date(api.superblock.completed_at)}
              highResolution
            />
          </LabeledValue>
        )}
      <TODO>
        See if I can make the screen "scrollTo" when the active block changes.
      </TODO>
      <TODO>Add in ability to skip entire blocks within a superblock.</TODO>
      <Stepper
        orientation="vertical"
        nonLinear
        activeStep={api.selectedBlockIdx}
      >
        {api.superblock.blocks.map((block, idx) => {
          const warmupSetNames = block.exercises
            .filter((e) => e.is_warmup)
            .map((e, idx) => ({ [e.id]: `Warmup ${idx + 1}` }));
          const workingSetNames = block.exercises
            .filter((e) => !e.is_warmup)
            .map((e, idx) => ({ [e.id]: `Working Set ${idx + 1}` }));
          const setName = [...warmupSetNames, ...workingSetNames].reduce(
            (acc, curr) => ({ ...acc, ...curr }),
            {},
          );
          return (
            <Step key={block.id} completed={block.completed_at !== null}>
              <StepButton onClick={() => api.setSelectedBlockIdx(idx)}>
                <Stack spacing={1} direction="row" alignItems="center">
                  <Typography
                    fontWeight={
                      api.selectedBlockIdx === idx ? "bold" : "inherit"
                    }
                    fontSize="inherit"
                  >
                    {block.name}
                  </Typography>
                </Stack>
              </StepButton>
              <StepContent>
                <Stack spacing={1} sx={{ ml: -1, mr: -1 }}>
                  <TODO>
                    There should be a way to add additional exercises to an
                    on-going block. For example, adding extra warmups or
                    cooldowns.
                  </TODO>
                  <TODO>
                    Include the wendler detail data right around here.
                  </TODO>
                  <TODO>Include the start-time here once it's set</TODO>
                  <TODO>Include the end-time here once it's set</TODO>
                  <TODO>Include the duration here once both are set.</TODO>
                  <Stack useFlexGap>
                    {block.exercises.map((exercise, idx) => {
                      return block.active_exercise_id === exercise.id ? (
                        <ActiveExerciseRow
                          key={exercise.id}
                          exercise={exercise}
                          preferences={props.preferences}
                          blockId={block.id}
                          finishExercise={api.finishExercise}
                          failExercise={api.failExercise}
                          skipExercise={api.skipExercise}
                          setName={
                            idx === block.exercises.length - 1
                              ? "Ultima series optima"
                              : setName[exercise.id] || ""
                          }
                        />
                      ) : (
                        <ExerciseRow
                          key={exercise.id}
                          exercise={exercise}
                          preferences={props.preferences}
                          setName={setName[exercise.id] || ""}
                        />
                      );
                    })}
                  </Stack>
                </Stack>
              </StepContent>
            </Step>
          );
        })}
      </Stepper>
      <TODO>Add in a "add block" form thingy here.</TODO>
    </Stack>
  );
};

export default PerformClient;

const usePerformClientAPI = (props: PerformClientProps) => {
  const { userId, initialSuperblock } = props;
  const [superblock, setSuperblock] = useState(initialSuperblock);
  const { id: superblockId } = superblock;

  const [selectedBlockIdx, setSelectedBlockIdx] = useState(() => {
    const activeBlockId = initialSuperblock.active_block_id;
    return initialSuperblock.blocks.findIndex((b) => b.id === activeBlockId);
  });

  useEffect(() => {
    const activeBlockId = superblock.active_block_id;
    const activeBlockIdx = superblock.blocks.findIndex(
      (b) => b.id === activeBlockId,
    );
    setSelectedBlockIdx(activeBlockIdx);
  }, [superblock]);

  const activeBlock = useMemo(
    () => superblock.blocks.find((b) => b.id === superblock.active_block_id),
    [superblock],
  );

  const activeExercise = useMemo(() => {
    if (!activeBlock) {
      return null;
    }
    const activeExerciseId = activeBlock.active_exercise_id;
    return activeBlock.exercises.find((e) => e.id === activeExerciseId);
  }, [activeBlock]);

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
      setSuperblock(result);
    },
    [superblockId, userId],
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
    [superblockId, userId],
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
    [superblockId, userId],
  );

  return {
    failExercise,
    skipExercise,
    finishExercise,
    superblock,
    selectedBlockIdx,
    setSelectedBlockIdx,
    activeBlock,
    activeExercise,
  };
};
