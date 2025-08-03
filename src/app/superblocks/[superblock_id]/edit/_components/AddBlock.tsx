"use client";
import {
  addBlock as addBlockServer,
  recentSetOverviews as recentSetOverviewsServer,
} from "@/app/superblocks/[superblock_id]/edit/_components/actions";
import {
  ExerciseType,
  RecentSetOverviewsResult,
  WeightUnit,
} from "@/common-types";
import DisplayDate from "@/components/display/DisplayDate";
import EditWeight from "@/components/edit/EditWeight";
import LabeledValue from "@/components/LabeledValue";
import SelectExercise from "@/components/select/SelectExercise";
import SelectNumber from "@/components/select/SelectNumber";
import TODO from "@/components/TODO";
import { useRequiredLabel } from "@/hooks";
import { exerciseTypeUIStringLong } from "@/uiStrings";
import { EQUIPMENT_FOR_EXERCISE } from "@/util";
import MultiplyIcon from "@mui/icons-material/Close";
import { Divider, Fab, Paper, Stack, Typography } from "@mui/material";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

interface AddBlockProps {
  userId: string;
  superblockId: string;
}

const AddBlock: React.FC<AddBlockProps> = (props) => {
  const api = useAddBlockAPI(props);
  return (
    <Stack spacing={1} component={Paper} sx={{ m: 1, p: 1 }}>
      <TODO>
        Adding a block to an existing block doesn't mark it as incomplete and
        set the completed at back to null.
      </TODO>
      <LabeledValue
        label="Add Block"
        labelVariant="h6"
        labelColor="text.primary"
      >
        <LabeledValue
          label={api.exerciseLabel}
          labelVariant="body2"
          labelColor="text.primary"
          help={
            <React.Fragment>
              Select the exercise type you'd like to use for your block. Blocks
              can only have one exercise type.
            </React.Fragment>
          }
        >
          <SelectExercise
            exercise={api.exercise}
            setExercise={api.setExercise}
          />
        </LabeledValue>
        <Stack
          direction="row"
          spacing={1}
          flexWrap="wrap"
          justifyContent="space-around"
        >
          <LabeledValue label="Weight">
            <EditWeight
              sub5
              sub10
              add5
              add10
              targetWeight={50}
              clearValue={50}
              actualWeight={api.actualWeight}
              setActualWeight={api.setActualWeight}
            />
            <TODO>
              This works okay, but it's not obvious you can click these. I need
              to think through how to handle this, A button would work, but I
              think there's too much data here, I want it to be super compact
              like it is now, though.
            </TODO>
            <Stack
              sx={{ my: 1 }}
              direction="row"
              spacing={0.5}
              justifyContent="space-between"
              flexWrap="wrap"
            >
              {api.recentSetOverviews?.overviews?.length === 0 && (
                <Typography variant="caption" color="text.secondary">
                  No recent sets for exercise.
                </Typography>
              )}
              {api.recentSetOverviews?.overviews?.map((overview, idx) => (
                <LabeledValue
                  key={idx}
                  alignItems={"center"}
                  onClick={() => api.setFromOverview(overview)}
                  label={
                    <DisplayDate
                      variant="caption"
                      timestamp={overview.started_at}
                      twoDigitYear
                      noTime
                    />
                  }
                >
                  {overview.average_weight.toFixed(0)}x
                  {overview.average_reps.toFixed(0)}
                </LabeledValue>
              ))}
            </Stack>
            <TODO>
              It would be nice to allow more customized blocks, i.e. including
              amrap, warmup, different reps per set, etc.
            </TODO>
          </LabeledValue>
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
      </LabeledValue>
      <Divider />
      <Stack alignItems="center" sx={{ p: 1, m: 1 }}>
        <Typography variant="h6">
          {api.exercise && exerciseTypeUIStringLong(api.exercise)}
        </Typography>
        <Stack
          direction="row"
          spacing={1}
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
        <Stack spacing={1} flex={1}>
          {api.actualWeight === undefined ||
            (api.actualWeight <= 0 && (
              <Typography variant="body2" color="error">
                Weight must be greater than 0.
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
        >
          Add Block
        </Fab>
      </Stack>
    </Stack>
  );
};

export default AddBlock;

const useAddBlockAPI = (props: AddBlockProps) => {
  const { userId, superblockId } = props;
  const [exercise, setExercise] = useState<ExerciseType | null>(null);
  const [reps, setReps] = useState(10);
  const [sets, setSets] = useState(5);
  const [actualWeight, setActualWeight] = useState<number>();
  const [recentSetOverviews, setRecentSetOverviews] = useState<
    RecentSetOverviewsResult | undefined
  >(undefined);

  const exerciseLabel = useRequiredLabel("Exercise", exercise === null);

  const addDisabled = useMemo(() => {
    return (
      !exercise ||
      actualWeight === undefined ||
      actualWeight <= 0 ||
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

  const setFromOverview = useCallback(
    (overview: RecentSetOverviewsResult["overviews"][number]) => {
      setActualWeight(Math.floor(overview.average_weight));
      setReps(Math.floor(overview.average_reps));
    },
    [setActualWeight, setReps],
  );

  // TODO: I'm not sure if I really need to debounce this or not.
  const debouncedSetOverviews = useDebouncedCallback(
    async (userId: string, exercise: ExerciseType) => {
      const overviews = await recentSetOverviewsServer(userId, exercise);
      setRecentSetOverviews(overviews);
    },
    1000,
    { leading: true },
  );

  useEffect(() => {
    if (!exercise) {
      setRecentSetOverviews(undefined);
      return;
    }
    debouncedSetOverviews(userId, exercise);
  }, [userId, exercise]);

  const boundAddBlockAction = useMemo(() => {
    if (!exercise || !equipmentType || actualWeight === undefined) {
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
    setFromOverview,
    exerciseLabel,
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
