"use client";

import {
  finishExercise as serverFinishExercise,
  setActiveBlock as serverSetActiveBlock,
} from "@/app/superblocks/[superblock_id]/perform/_components/actions";
import ActiveExerciseRow from "@/app/superblocks/[superblock_id]/perform/_components/ActiveExerciseRow";
import ExerciseRow from "@/app/superblocks/[superblock_id]/perform/_components/ExerciseRow";
import {
  GetPerformSuperblockResult,
  PerceivedEffort,
  UserPreferences,
} from "@/common-types";
import TODO from "@/components/TODO";
import {
  Button,
  Stack,
  Step,
  StepButton,
  StepContent,
  Stepper,
  Typography,
} from "@mui/material";
import { useCallback, useState } from "react";

interface PerformClientProps {
  userId: string;
  initialSuperblock: GetPerformSuperblockResult;
  preferences: UserPreferences;
}

const PerformClient: React.FC<PerformClientProps> = (props) => {
  const api = usePerformClientAPI(props);
  return (
    <Stack spacing={1}>
      <Stepper orientation="vertical" nonLinear activeStep={api.activeBlockIdx}>
        {api.superblock.blocks.map((block, idx) => (
          <Step key={block.id} completed={block.completed_at !== null}>
            <StepButton onClick={() => api.setActiveBlockIdx(idx)}>
              <Stack spacing={1} direction="row" alignItems="center">
                <Typography
                  fontWeight={api.activeBlockIdx === idx ? "bold" : "inherit"}
                  fontSize="inherit"
                >
                  {block.name}
                </Typography>
              </Stack>
            </StepButton>
            <StepContent>
              <Stack spacing={1}>
                <TODO>Include the wendler detail data right around here.</TODO>
                <TODO>Include the start-time here once it's set</TODO>
                <TODO>Include the end-time here once it's set</TODO>
                <TODO>Include the duration here once both are set.</TODO>
                {api.superblock.active_block_id !== block.id && (
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ alignSelf: "start" }}
                    onClick={() =>
                      api.setActiveBlock(api.superblock.id, block.id)
                    }
                  >
                    Start Block
                  </Button>
                )}
                <Stack spacing={1}>
                  {block.exercises.map((exercise) =>
                    exercise.id === api.activeExerciseId ? (
                      <ActiveExerciseRow
                        key={exercise.id}
                        exercise={exercise}
                        preferences={props.preferences}
                        finishExercise={api.finishExercise}
                        blockId={block.id}
                      />
                    ) : (
                      <ExerciseRow key={exercise.id} exercise={exercise} />
                    ),
                  )}
                </Stack>
              </Stack>
            </StepContent>
          </Step>
        ))}
      </Stepper>
      <TODO>Add in a "add block" form thingy here.</TODO>
    </Stack>
  );
};

export default PerformClient;

const usePerformClientAPI = (props: PerformClientProps) => {
  const {
    userId,
    initialSuperblock,
    initialSuperblock: { blocks },
  } = props;
  const [superblock, setSuperblock] = useState(initialSuperblock);
  const [activeBlockIdx, setActiveBlockIdx] = useState(
    initialSuperblock.active_block_id
      ? initialSuperblock.blocks.findIndex(
          (b) => b.id === initialSuperblock.active_block_id,
        )
      : 0,
  );
  const [activeExerciseId, setActiveExerciseId] = useState(
    initialSuperblock.blocks?.[activeBlockIdx].active_exercise_id,
  );

  const setActiveBlock = useCallback(
    async (superblockId: string, blockId: string) => {
      const { active_block_id, active_exercise_id, superblock } =
        await serverSetActiveBlock(userId, superblockId, blockId);
      const idx = blocks.findIndex((b) => b.id === active_block_id);
      setActiveBlockIdx(idx === -1 ? 0 : idx);
      if (active_exercise_id) {
        setActiveExerciseId(active_exercise_id);
      }
      setSuperblock(superblock);
    },
    [userId, blocks],
  );

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
        superblock.id,
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
      const { active_block_id } = result;
      const activeIdx = result.blocks.findIndex(
        (b) => b.id === active_block_id,
      );
      setActiveBlockIdx(activeIdx === -1 ? 0 : activeIdx);
      const activeBlock = result.blocks[activeIdx];
      setActiveExerciseId(activeBlock.active_exercise_id);
    },
    [superblock.id, userId],
  );

  return {
    superblock,
    finishExercise,
    activeBlockIdx,
    setActiveBlockIdx,
    activeExerciseId,
    setActiveExerciseId: setActiveExerciseId,
    setActiveBlock,
  };
};
