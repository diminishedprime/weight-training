import ActiveExerciseRow from "@/app/superblocks/[superblock_id]/perform/_components/ActiveExerciseRow";
import CompletedExerciseRow from "@/app/superblocks/[superblock_id]/perform/_components/CompletedExerciseRow";
import ExerciseRow from "@/app/superblocks/[superblock_id]/perform/_components/ExerciseRow";
import {
  GetPerformSuperblockResult,
  RDispatch,
  SuperblockBlock,
  UserPreferences,
} from "@/common-types";
import DisplayCompletionStatus from "@/components/display/DisplayCompletionStatus";
import TODO from "@/components/TODO";
import { TestIds } from "@/test/test-ids";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import { Map as ImmutableMap } from "immutable";
import React, { useMemo } from "react";

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
    <Accordion
      disableGutters
      defaultExpanded={props.open}
      expanded={props.open}
      onChange={props.setOpen}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ px: 1 }}>
        <Typography display="flex" alignItems={"center"} gap={1} variant="h6">
          <DisplayCompletionStatus completionStatus={block.completion_status} />
          {block.name}
        </Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ p: 1 }}>
        <Stack
          data-testid={TestIds.Superblocks_SuperblockId_Perform__Block(
            block.name,
          )}
        >
          <TODO>
            There should be a way to add additional exercises to an on-going
            block. For example, adding extra warmups or cooldowns.
          </TODO>
          <TODO>Include the wendler detail data right around here.</TODO>
          <TODO>Include the start-time here once it's set</TODO>
          <TODO>Include the end-time here once it's set</TODO>
          <TODO>Include the duration here once both are set.</TODO>
          <Stack>
            {block.exercises.map((exercise, idx) => {
              return (
                <React.Fragment key={exercise.id}>
                  <Divider />
                  {block.active_exercise_id === exercise.id ? (
                    <ActiveExerciseRow
                      userId={props.userId}
                      blockId={block.id}
                      superblockId={props.initialSuperblock.id}
                      exercise={exercise}
                      preferences={props.preferences}
                      setSuperblock={props.setSuperblock}
                      setName={api.setNames.get(exercise.id, "")}
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
                      idx={idx}
                    />
                  ) : (
                    <ExerciseRow
                      exercise={exercise}
                      preferences={props.preferences}
                      setName={api.setNames.get(exercise.id, "")}
                      idx={idx}
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

const useBlockAPI = (props: Props) => {
  const { block } = props;

  const setNames = useMemo(() => {
    return [
      ...block.exercises
        .filter((e) => e.is_warmup)
        .map((e, idx) => [e.id, `Warmup ${idx + 1}`]),
      ...block.exercises
        .filter((e) => !e.is_warmup)
        .map((e, idx) => [e.id, `Working Set ${idx + 1}`]),
    ]
      .reduce(
        (acc, [id, name]) => acc.set(id, name),
        ImmutableMap<string, string>(),
      )
      .set(
        block.exercises[block.exercises.length - 1].id,
        "Ultima series optima",
      );
  }, [block]);

  return {
    setNames,
  };
};
