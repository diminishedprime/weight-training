"use client";
import { addBlock as addBlockServer } from "@/app/superblocks/[superblock_id]/edit/_components/actions";
import Overviews from "@/app/superblocks/[superblock_id]/edit/_components/Overviews";
import {
  ExerciseType,
  RecentSetOverviewsResult,
  WeightUnit,
} from "@/common-types";
import EditWeight, {
  EditWeightHandle,
} from "@/components/edit/weight/EditWeight";
import LabeledValue from "@/components/LabeledValue";
import SelectExercise from "@/components/select/SelectExercise";
import SelectNumber from "@/components/select/SelectNumber";
import TODO from "@/components/TODO";
import { useRPCMutation } from "@/hooks";
import { TestIds } from "@/test/test-ids";
import { exerciseTypeUIStringLong } from "@/uiStrings";
import { EQUIPMENT_FOR_EXERCISE } from "@/util";
import MultiplyIcon from "@mui/icons-material/Close";
import { Divider, Fab, Paper, Stack, Typography } from "@mui/material";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

interface AddBlockProps {
  userId: string;
  superblockId: string;
}

const AddBlock: React.FC<AddBlockProps> = (props) => {
  const editWeightRef = useRef<EditWeightHandle>(null!);
  const api = useAddBlockAPI(props, editWeightRef);
  return (
    <Stack component={Paper} sx={{ m: 1, p: 1 }}>
      <TODO>
        Adding a block to an existing block doesn't mark it as incomplete and
        set the completed at back to null.
      </TODO>
      <LabeledValue
        label="Add Block"
        labelVariant="h6"
        labelColor="text.primary"
      >
        <Stack mt={1}>
          <SelectExercise
            exercise={api.exercise}
            setExercise={api.setExercise}
          />
          <Overviews
            overviews={api.recentSetOverviews?.overviews}
            exercise={api.exercise}
            api={api.recentSetOverviewsAPI}
            setReps={api.setReps}
            setWeight={api.setActualWeight}
            setSets={api.setSets}
          />
          <LabeledValue label="Weight" alignItems="center">
            <EditWeight
              ref={editWeightRef}
              editing={true}
              serverTarget={50}
              clearValue={50}
              serverActual={api.actualWeight}
              onActualChange={api.setActualWeight}
              weightUnit={"pounds"}
              sub5
              sub10
              add5
              add10
            />
          </LabeledValue>
          <Stack
            direction="row"
            flexWrap="wrap"
            justifyContent="space-around"
            width="100%"
          >
            <TODO>
              It would be nice to allow more customized blocks, i.e. including
              amrap, warmup, different reps per set, etc.
            </TODO>
            <LabeledValue label="Sets" alignItems="center">
              <SelectNumber
                selectedNumber={api.sets}
                setSelectedNumber={api.setSets}
                choices={[3, 4, 5]}
              />
            </LabeledValue>
            <LabeledValue label="Reps" alignItems="center">
              <SelectNumber
                selectedNumber={api.reps}
                setSelectedNumber={api.setReps}
                choices={[5, 8, 10, 12, 15]}
              />
            </LabeledValue>
          </Stack>
        </Stack>
      </LabeledValue>
      <Divider />
      <TODO>
        It'd be cool to have a "bump up" and "bump down" by the volume which
        finds the nearest above and nearest below volumes by changing the weight
        +-5 and reps +-3 and the sets +-2.
      </TODO>
      <Stack alignItems="center" sx={{ p: 1, m: 1 }}>
        <Typography variant="h6">
          {api.exercise && exerciseTypeUIStringLong(api.exercise)}
        </Typography>
        <Stack
          direction="row"
          flexWrap="wrap"
          justifyContent="center"
          alignItems="center"
        >
          <LabeledValue label="Sets" alignItems="center">
            {api.sets}
          </LabeledValue>
          <MultiplyIcon />
          <LabeledValue label="Reps" alignItems="center">
            {api.reps}
          </LabeledValue>
          <MultiplyIcon />
          <LabeledValue label="Weight" alignItems="center">
            {api.actualWeight}
          </LabeledValue>
          <Typography
            component="span"
            variant="inherit"
            sx={(theme) => ({ fontSize: theme.typography.h5.fontSize })}
          >
            =
          </Typography>
          <LabeledValue label="Volume" alignItems="center">
            {api.sets * api.reps * (api.actualWeight ?? 0)}
          </LabeledValue>
        </Stack>
      </Stack>
      <Divider />
      <Stack
        component="form"
        action={api.boundAddBlockAction}
        justifyContent="flex-start"
        alignItems="flex-start"
        direction="row"
      >
        <Stack flex={1}>
          {api.actualWeight === null ||
            (api.actualWeight < 0 && (
              <Typography variant="body2" color="error">
                Weight must be positive.
              </Typography>
            ))}
          {api.reps <= 0 && (
            <Typography variant="body2" color="error">
              Reps must be greater than 0.
            </Typography>
          )}
          {api.sets <= 0 && (
            <Typography variant="body2" color="error">
              Sets must be greater than 0.
            </Typography>
          )}
          {!api.exercise && (
            <Typography variant="body2" color="error">
              Exercise is required.
            </Typography>
          )}
        </Stack>
        <Fab
          variant="extended"
          color="primary"
          sx={{ justifySelf: "flex-end" }}
          type="submit"
          disabled={api.addDisabled}
          data-testid={TestIds.Superblocks_SuperblockId_Edit_AddBlock}
        >
          Add Block
        </Fab>
      </Stack>
    </Stack>
  );
};

export default AddBlock;

// This makes me deeply unhappy, but typescript doesn't let you export a type
// from within a function and I can't seem to get the generic type working since
// it's infered from the actual argument.
const _helper = () =>
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useRPCMutation(
    "recent_set_overviews",
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useCallback(
      (e: Error) => `Error fetching recent set overviews: ${e.message}`,
      [],
    ),
  );
export type RecentSetOverviewsAPI = ReturnType<typeof _helper>;

const useAddBlockAPI = (
  props: AddBlockProps,
  editWeightRef?: React.RefObject<EditWeightHandle>,
) => {
  const { userId, superblockId } = props;
  const [exercise, setExercise] = useState<ExerciseType | null>(null);
  const [reps, setReps] = useState(10);
  const [sets, setSets] = useState(5);
  const [actualWeight, setActualWeight] = useState<number | null>(50);
  const [recentSetOverviews, setRecentSetOverviews] = useState<
    RecentSetOverviewsResult | undefined
  >(undefined);

  const addDisabled = useMemo(() => {
    return (
      !exercise ||
      actualWeight === null ||
      actualWeight < 0 ||
      reps <= 0 ||
      sets <= 0
    );
  }, [exercise, actualWeight, reps, sets]);

  const name = useMemo(() => {
    if (exercise === null) {
      return "";
    }
    return `${exerciseTypeUIStringLong(exercise)} - ${sets}x${reps}`;
  }, [exercise, sets, reps]);

  const equipmentType = useMemo(() => {
    return exercise ? (EQUIPMENT_FOR_EXERCISE.get(exercise) ?? null) : null;
  }, [exercise]);

  const weightUnit: WeightUnit = useMemo(() => {
    return "pounds";
  }, []);

  const recentSetOverviewsAPI = useRPCMutation(
    "recent_set_overviews",
    useCallback(
      (e: Error) => `Error fetching recent set overviews: ${e.message}`,
      [],
    ),
  );

  const { trigger } = recentSetOverviewsAPI;

  useEffect(() => {
    if (exercise !== null) {
      (async () => {
        const overviews = await trigger({
          p_user_id: userId,
          p_exercise_type: exercise,
        });
        setRecentSetOverviews(overviews as RecentSetOverviewsResult);
      })();
      return;
    }
    setRecentSetOverviews(undefined);
    setReps(10);
    setSets(5);
    setActualWeight(50);
  }, [exercise, userId, trigger]);

  useEffect(() => {
    if (actualWeight !== null) {
      editWeightRef?.current?.setActual(actualWeight);
    }
  }, [actualWeight, editWeightRef]);

  const boundAddBlockAction = useMemo(() => {
    if (!exercise || !equipmentType || actualWeight === null) {
      return;
    }
    return addBlockServer.bind(
      null,
      userId,
      superblockId,
      name,
      equipmentType,
      exercise,
      sets,
      reps,
      actualWeight,
      weightUnit,
    );
  }, [
    userId,
    superblockId,
    name,
    equipmentType,
    exercise,
    sets,
    reps,
    actualWeight,
    weightUnit,
  ]);

  return {
    recentSetOverviewsAPI,
    addDisabled,
    boundAddBlockAction,
    exercise,
    setExercise,
    reps,
    setReps,
    sets,
    setSets,
    actualWeight,
    setActualWeight,
    recentSetOverviews,
  };
};
