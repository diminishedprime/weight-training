import { bustCache } from "@/app/superblocks/[superblock_id]/perform/_components/actions";
import { UserPreferences } from "@/common-types";
import { GetPerformSuperblockExercise } from "@/common-types/get-perform-superblock";
import LabeledValue from "@/components/LabeledValue";
import Link from "@/components/Link";
import DisplayCompletionStatus from "@/components/display/DisplayCompletionStatus";
import DisplayDuration from "@/components/display/DisplayDuration";
import DisplayNotes from "@/components/display/DisplayNotes";
import DisplayWeight from "@/components/display/DisplayWeight";
import SelectPerceivedEffort from "@/components/mutate/select/SelectPerceivedEffort";
import { Paths, SearchParam, WithSearchParams } from "@/constants";
import { TestIds } from "@/test/test-ids";
import PencilIcon from "@mui/icons-material/Edit";
import { IconButton, Stack, Typography } from "@mui/material";
import { useCallback, useMemo, useState } from "react";

interface CompletedExerciseRowProps {
  userId: string;
  superblockId: string;
  exercise: GetPerformSuperblockExercise;
  preferences: UserPreferences;
  setName: string;
  currentPath: string;
  idx: number;
  restTime: number;
}

const CompletedExerciseRow: React.FC<CompletedExerciseRowProps> = (props) => {
  const { exercise } = props;
  const api = useCompletedExerciseRowAPI(props);

  return (
    <Stack
      sx={{ my: 1 }}
      data-testid={TestIds.Superblocks_SuperblockId_Perform__CompletedExerciseRow(
        props.idx,
      )}
    >
      <Stack
        alignItems="center"
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
        }}
      >
        <DisplayCompletionStatus
          completionStatus={exercise.completion_status}
        />
        <Typography variant="body2" sx={{ justifySelf: "center" }}>
          {props.setName}
        </Typography>
        <IconButton
          size="small"
          component={Link}
          href={api.editLink}
          sx={{ justifySelf: "end" }}
        >
          <PencilIcon />
        </IconButton>
      </Stack>
      <SelectPerceivedEffort
        userId={props.userId}
        exerciseId={exercise.id}
        perceivedEffort={api.perceivedEffort}
        setPerceivedEffort={api.setPerceivedEffort}
        initialEditingState={api.perceivedEffort === null}
        afterServerAction={api.afterServerAction}
      />
      <Stack
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
        }}
        data-testid="completed-exercise-row-grid"
      >
        <LabeledValue
          label={exercise.actual_weight_value ? "Actual" : "Target"}
          alignItems="center"
          sx={{ justifySelf: "start" }}
        >
          <DisplayWeight
            column
            weightUnit={exercise.weight_unit}
            weightValue={
              exercise.actual_weight_value ?? exercise.target_weight_value
            }
          />
        </LabeledValue>
        <LabeledValue
          label="Reps"
          alignItems="center"
          sx={{ justifySelf: "center" }}
        >
          <Typography component="span" color="secondary">
            {exercise.reps}
            {exercise.is_amrap ? " (AMRAP)" : ""}
          </Typography>
        </LabeledValue>
        <LabeledValue
          label="Rest"
          alignItems="center"
          sx={{ justifySelf: "end" }}
        >
          {exercise.last_performed_at && exercise.performed_at ? (
            <DisplayDuration
              from={new Date(exercise.last_performed_at)}
              to={new Date(exercise.performed_at)}
              restTimeSeconds={props.restTime}
              highResolution
            />
          ) : (
            "N/A"
          )}
        </LabeledValue>
      </Stack>
      <DisplayNotes notes={exercise.notes} />
    </Stack>
  );
};

export default CompletedExerciseRow;

const useCompletedExerciseRowAPI = (props: CompletedExerciseRowProps) => {
  const {
    exercise: { equipment_type, exercise_type, id },
    superblockId,
    currentPath,
  } = props;

  const [perceivedEffort, setPerceivedEffort] = useState(
    props.exercise.perceived_effort ?? null,
  );

  const afterServerAction = useCallback(async () => {
    await bustCache(superblockId);
  }, [superblockId]);

  const editLink = useMemo(
    () =>
      WithSearchParams(
        Paths.Exercise_EquipmentType_ExerciseType_Edit_ExerciseId(
          equipment_type,
          exercise_type,
          id,
        ),
        [SearchParam.BackTo, currentPath],
      ),
    [equipment_type, exercise_type, id, currentPath],
  );

  return { perceivedEffort, setPerceivedEffort, editLink, afterServerAction };
};
