"use client";
import { revalidatePaths } from "@/app/superblocks/[superblock_id]/edit/_components/actions";
import Overviews from "@/app/superblocks/[superblock_id]/edit/_components/Overviews";
import {
  ExerciseType,
  GetPerformSuperblockResult,
  RDispatch,
  WeightUnit,
} from "@/common-types";
import EditWeight, {
  EditWeightHandle,
} from "@/components/edit/weight/EditWeight";
import LabeledValue from "@/components/LabeledValue";
import { Notification } from "@/components/Notify";
import SelectExercise from "@/components/select/SelectExercise";
import SelectNumber from "@/components/select/SelectNumber";
import TODO from "@/components/TODO";
import { LOADING_SX } from "@/constants";
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
  setSuperblock: RDispatch<GetPerformSuperblockResult>;
  setNotifications: RDispatch<Notification[]>;
}

const AddBlock: React.FC<AddBlockProps> = (props) => {
  const editWeightRef = useRef<EditWeightHandle>(null!);
  const api = useAddBlockAPI(props, editWeightRef);
  return (
    <Stack component={Paper} sx={{ p: 1 }}>
      <TODO>
        Adding a block to an existing block doesn't mark it as incomplete and
        set the completed at back to null.
      </TODO>
      <LabeledValue
        label="Add Block"
        labelVariant="h6"
        labelColor="text.primary"
      >
        <Stack mt={1} sx={{ ...LOADING_SX(api.overviewsLoading) }}>
          <SelectExercise
            exercise={api.exercise}
            setExercise={api.setExercise}
          />
          <Overviews
            exerciseType={api.exercise}
            setReps={api.setReps}
            setWeight={api.setActualWeight}
            setSets={api.setSets}
            userId={props.userId}
            setOverviewsLoading={api.setOverviewsLoading}
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
                data-testid={
                  TestIds.Superblocks_SuperblockId_Edit_AddBlock_Sets
                }
                selectedNumber={api.sets}
                setSelectedNumber={api.setSets}
                choices={[3, 4, 5]}
              />
            </LabeledValue>
            <LabeledValue label="Reps" alignItems="center">
              <SelectNumber
                data-testid={
                  TestIds.Superblocks_SuperblockId_Edit_AddBlock_Reps
                }
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
            {api.volume}
          </LabeledValue>
        </Stack>
      </Stack>
      <Divider />
      <Stack
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
          {api.reps === null ||
            (api.reps <= 0 && (
              <Typography variant="body2" color="error">
                Reps must be greater than 0.
              </Typography>
            ))}
          {api.sets === null ||
            (api.sets <= 0 && (
              <Typography variant="body2" color="error">
                Sets must be greater than 0.
              </Typography>
            ))}
          {api.exercise === null && (
            <Typography variant="body2" color="error">
              Exercise is required.
            </Typography>
          )}
        </Stack>
        <Fab
          variant="extended"
          color="primary"
          sx={{ justifySelf: "flex-end" }}
          disabled={api.addDisabled}
          onClick={api.addBlock}
          data-testid={TestIds.Superblocks_SuperblockId_Edit_AddBlock}
        >
          Add Block
        </Fab>
      </Stack>
    </Stack>
  );
};

export default AddBlock;

const useAddBlockAPI = (
  props: AddBlockProps,
  editWeightRef?: React.RefObject<EditWeightHandle>,
) => {
  const { userId, superblockId, setSuperblock, setNotifications } = props;

  const [exerciseType, setExerciseType] = useState<ExerciseType | null>(null);
  const [reps, setReps] = useState<number | null>(null);
  const [sets, setSets] = useState<number | null>(null);
  const [actualWeight, setActualWeight] = useState<number | null>(null);
  const [overviewsLoading, setOverviewsLoading] = useState(false);

  const name = useMemo(() => {
    if (exerciseType === null) {
      return null;
    }
    return `${exerciseTypeUIStringLong(exerciseType)} - ${sets}x${reps}`;
  }, [exerciseType, sets, reps]);

  const equipmentType = useMemo(() => {
    return exerciseType
      ? (EQUIPMENT_FOR_EXERCISE.get(exerciseType) ?? null)
      : null;
  }, [exerciseType]);

  const weightUnit: WeightUnit = useMemo(() => {
    return "pounds";
  }, []);

  const addDisabled = useMemo(() => {
    return (
      exerciseType === null ||
      equipmentType === null ||
      actualWeight === null ||
      reps === null ||
      sets === null ||
      name === null ||
      actualWeight < 0 ||
      reps <= 0 ||
      sets <= 0
    );
  }, [exerciseType, actualWeight, reps, sets, equipmentType, name]);

  const { trigger: addBlockToSuperblockServer } = useRPCMutation(
    "add_block_to_superblock",
    useCallback((e) => `Error calling add_block_to_superblock: ${e}`, []),
    useCallback(async () => {
      await revalidatePaths(superblockId);
    }, [superblockId]),
    useCallback(
      (result: GetPerformSuperblockResult) => {
        setSuperblock(result);
        setNotifications((old) => [
          ...old,
          { message: `Added block: ${name}`, key: new Date() },
        ]);
        setExerciseType(null);
      },
      [setSuperblock, setNotifications, name],
    ),
  );

  const addBlock = useCallback(async () => {
    if (
      exerciseType === null ||
      equipmentType === null ||
      actualWeight === null ||
      reps === null ||
      sets === null ||
      name === null ||
      actualWeight < 0 ||
      reps <= 0 ||
      sets <= 0
    ) {
      return;
    }
    await addBlockToSuperblockServer({
      p_equipment_type: equipmentType,
      p_exercise_type: exerciseType,
      p_name: name,
      p_reps: reps,
      p_sets: sets,
      p_superblock_id: superblockId,
      p_user_id: userId,
      p_weight_unit: weightUnit,
      p_weight_value: actualWeight,
    });
  }, [
    addBlockToSuperblockServer,
    equipmentType,
    exerciseType,
    name,
    reps,
    sets,
    superblockId,
    userId,
    weightUnit,
    actualWeight,
  ]);

  const volume = useMemo(() => {
    if (sets === null || reps === null || actualWeight === null) {
      return "";
    }
    return sets * reps * actualWeight;
  }, [sets, reps, actualWeight]);

  useEffect(() => {
    if (actualWeight !== null) {
      editWeightRef?.current?.setActual(actualWeight);
    }
  }, [actualWeight, editWeightRef]);

  return {
    addDisabled,
    exercise: exerciseType,
    setExercise: setExerciseType,
    reps,
    setReps,
    sets,
    setSets,
    actualWeight,
    setActualWeight,
    setOverviewsLoading,
    overviewsLoading,
    addBlock,
    volume,
  };
};
