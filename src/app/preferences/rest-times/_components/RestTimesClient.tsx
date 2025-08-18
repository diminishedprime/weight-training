"use client";
import EquipmentRestTime from "@/app/preferences/rest-times/_components/EquipmentRestTime";
import { bustCache } from "@/app/preferences/rest-times/_components/actions";
import { EquipmentType, ExerciseType, HydrateRestTimes } from "@/common-types";
import LabeledValue from "@/components/LabeledValue";
import {
  EQUIPMENT_TYPES,
  EXERCISE_TYPES,
  LOADING_SX,
  SearchParam,
} from "@/constants";
import { useRPCMutation } from "@/hooks";
import { equipmentTypeUIString } from "@/uiStrings";
import { Button, Chip, Divider, Stack, Typography } from "@mui/material";
import { OrderedMap as ImmutableMap } from "immutable";
import { isEqual } from "lodash";
import { useSearchParams } from "next/navigation";
import React, { useCallback, useMemo, useState } from "react";

interface Props {
  hydratedEquipmentRestTimes: HydrateRestTimes;
  userId: string;
}

const RestTimesClient: React.FC<Props> = (props) => {
  const api = useRestTimesClient(props);
  return (
    <Stack sx={{ ...LOADING_SX(api.pending) }}>
      <Typography variant="h5">Rest Times</Typography>
      <Typography variant="body2">
        Here you can configure rest times for an equipment type, or an exercise
        type.
      </Typography>
      {api.availableEquipmentTypes.length !== 0 && (
        <LabeledValue
          label="Add Equipment Rest Time"
          help="Click on a chip in order to configure a rest time."
        >
          <Stack direction="row" flexWrap="wrap">
            {api.availableEquipmentTypes.map((equipmentType) => (
              <Chip
                clickable
                key={equipmentType}
                size="small"
                color="primary"
                onClick={() => api.onEquipmentRestChange(equipmentType, 120)}
                label={equipmentTypeUIString(equipmentType)}
              />
            ))}
          </Stack>
        </LabeledValue>
      )}
      {api.equipmentRestTimes.entrySeq().map(([equipmentType, restTime]) => (
        <React.Fragment key={equipmentType}>
          <Divider />
          <EquipmentRestTime
            equipmentType={equipmentType}
            equipmentRest={restTime}
            removeEquipmentRest={api.removeEquipmentRest}
            removeExerciseRest={api.removeExerciseRest}
            onEquipmentRestChange={api.onEquipmentRestChange}
            onExerciseRestChange={api.onExerciseRestChange}
            availableExerciseTypes={api.availableExerciseTypes}
            exerciseRests={api.exerciseRestTimes}
          />
        </React.Fragment>
      ))}
      <Button
        variant="contained"
        disabled={api.saveDisabled}
        onClick={api.save}
        sx={{ alignSelf: "flex-end" }}
      >
        Save
      </Button>
    </Stack>
  );
};

export default RestTimesClient;

const useRestTimesClient = (props: Props) => {
  const params = useSearchParams();
  const backTo = useMemo(
    () => params.get(SearchParam.BackTo)?.toString(),
    [params],
  );

  const {
    userId,
    hydratedEquipmentRestTimes: {
      equipment_rest_times: hydrated_equipment_rests,
      exercise_rest_times: hydrated_exercise_rests,
    },
  } = props;

  const fromHydratedEquipment = useCallback(
    (hydratedEquipmentRests: typeof hydrated_equipment_rests) =>
      (hydratedEquipmentRests || []).reduce(
        (acc, a) => acc.set(a.equipment_type, a.rest_time),
        ImmutableMap<EquipmentType, number>(),
      ),
    [],
  );

  const fromHydratedExercise = useCallback(
    (hydratedExerciseRests: typeof hydrated_exercise_rests) =>
      (hydratedExerciseRests || []).reduce(
        (acc, a) => acc.set(a.exercise_type, a.rest_time),
        ImmutableMap<ExerciseType, number>(),
      ),
    [],
  );

  const toHydratedEquipment = useCallback(
    (equipmentRestTimes: ImmutableMap<EquipmentType, number>) =>
      equipmentRestTimes
        .entrySeq()
        .toArray()
        .map(([equipment_type, rest_time]) => ({
          equipment_type,
          rest_time,
        })),
    [],
  );

  const toHydratedExercise = useCallback(
    (exerciseRestTimes: ImmutableMap<ExerciseType, number>) =>
      exerciseRestTimes
        .entrySeq()
        .toArray()
        .map(([exercise_type, rest_time]) => ({
          exercise_type,
          rest_time,
        })),
    [],
  );

  const [equipmentRestTimes, setEquipmentRestTimes] = useState(
    fromHydratedEquipment(hydrated_equipment_rests),
  );

  const availableEquipmentTypes = useMemo(
    () => EQUIPMENT_TYPES.filter((a) => !equipmentRestTimes.has(a)),
    [equipmentRestTimes],
  );

  const [exerciseRestTimes, setExerciseRestTimes] = useState(
    fromHydratedExercise(hydrated_exercise_rests),
  );

  const availableExerciseTypes = useMemo(
    () => EXERCISE_TYPES.filter((a) => !exerciseRestTimes.has(a)),
    [exerciseRestTimes],
  );

  const onEquipmentRestChange = useCallback(
    (equipmentType: EquipmentType, rest: number) => {
      setEquipmentRestTimes((old) => old.set(equipmentType, rest));
    },
    [],
  );

  const onExerciseRestChange = useCallback(
    (exerciseType: ExerciseType, rest: number) => {
      setExerciseRestTimes((old) => old.set(exerciseType, rest));
    },
    [],
  );

  const removeEquipmentRest = useCallback((equipmentType: EquipmentType) => {
    setEquipmentRestTimes((prev) => prev.remove(equipmentType));
  }, []);

  const removeExerciseRest = useCallback((exerciseType: ExerciseType) => {
    setExerciseRestTimes((prev) => prev.remove(exerciseType));
  }, []);

  const { trigger: serverSave, isMutating: pending } = useRPCMutation(
    "set_rest_times",
    useCallback((e) => `Error calling set equipment rest times: ${e}`, []),
    useCallback(async () => {
      await bustCache(backTo);
    }, [backTo]),
    useCallback(
      (result: HydrateRestTimes) => {
        setEquipmentRestTimes(
          fromHydratedEquipment(result.equipment_rest_times),
        );
        setExerciseRestTimes(fromHydratedExercise(result.exercise_rest_times));
      },
      [fromHydratedEquipment, fromHydratedExercise],
    ),
  );

  const saveDisabled = useMemo(
    () =>
      isEqual(
        equipmentRestTimes,
        fromHydratedEquipment(hydrated_equipment_rests),
      ) &&
      isEqual(exerciseRestTimes, fromHydratedExercise(hydrated_exercise_rests)),
    [
      equipmentRestTimes,
      hydrated_equipment_rests,
      exerciseRestTimes,
      hydrated_exercise_rests,
      fromHydratedEquipment,
      fromHydratedExercise,
    ],
  );

  const save = useCallback(async () => {
    await serverSave({
      p_user_id: userId,
      p_equipment_rests: toHydratedEquipment(equipmentRestTimes),
      p_exercise_rests: toHydratedExercise(exerciseRestTimes),
    });
  }, [
    userId,
    equipmentRestTimes,
    exerciseRestTimes,
    serverSave,
    toHydratedEquipment,
    toHydratedExercise,
  ]);

  return {
    pending,
    saveDisabled,
    save,
    availableEquipmentTypes,
    availableExerciseTypes,
    equipmentRestTimes,
    exerciseRestTimes,
    removeEquipmentRest,
    removeExerciseRest,
    onEquipmentRestChange,
    onExerciseRestChange,
  };
};
