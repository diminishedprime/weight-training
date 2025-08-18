"use client";
import ExerciseRestTime from "@/app/preferences/rest-times/_components/ExerciseRestTime";
import { EquipmentType, ExerciseType } from "@/common-types";
import EditRestTime from "@/components/edit/EditRestTime";
import LabeledValue from "@/components/LabeledValue";
import TODO from "@/components/TODO";
import { equipmentTypeUIString, exerciseTypeUIStringBrief } from "@/uiStrings";
import { EQUIPMENT_FOR_EXERCISE } from "@/util";
import TrashIcon from "@mui/icons-material/DeleteOutlined";
import { Chip, IconButton, Stack } from "@mui/material";
import { OrderedMap as ImmutableMap } from "immutable";
import React, { useEffect, useState } from "react";

interface Props {
  equipmentType: EquipmentType;
  equipmentRest: number;
  removeEquipmentRest: (equipmentType: EquipmentType) => void;
  removeExerciseRest: (exerciseType: ExerciseType) => void;
  onEquipmentRestChange: (equipmentType: EquipmentType, rest: number) => void;
  onExerciseRestChange: (exerciseType: ExerciseType, rest: number) => void;
  availableExerciseTypes: ExerciseType[];
  exerciseRests: ImmutableMap<ExerciseType, number>;
}

const EquipmentRestTime: React.FC<Props> = (props) => {
  const api = useEquipmentRestTimeAPI(props);
  return (
    <Stack>
      <TODO>
        It'd be nice if this UI was a bit cleaner. This works okay, but it feels
        very noisy.
      </TODO>
      <LabeledValue
        labelVariant="h6"
        label={equipmentTypeUIString(props.equipmentType)}
        help={
          <React.Fragment>
            Configure the default rest for{" "}
            {equipmentTypeUIString(props.equipmentType)} exercises here. Click
            the chips below to configure the rest time for only that exercise.
          </React.Fragment>
        }
      >
        <Stack>
          <Stack direction="row">
            <EditRestTime
              restTime={api.equipmentRest}
              setRestTime={api.setEquipmentRest}
            />
            <IconButton
              color="error"
              onClick={() => props.removeEquipmentRest(props.equipmentType)}
            >
              <TrashIcon />
            </IconButton>
          </Stack>
        </Stack>
      </LabeledValue>

      <LabeledValue
        label={`${equipmentTypeUIString(props.equipmentType)} exercises`}
        labelVariant="body1"
      >
        <Stack direction="row" flexWrap="wrap">
          {props.availableExerciseTypes
            .filter(
              (exerciseType) =>
                EQUIPMENT_FOR_EXERCISE.get(exerciseType) ===
                props.equipmentType,
            )
            .map((exercise_type) => (
              <Chip
                key={exercise_type}
                size="small"
                color="secondary"
                label={exerciseTypeUIStringBrief(exercise_type)}
                clickable
                onClick={() => props.onExerciseRestChange(exercise_type, 120)}
              />
            ))}
        </Stack>
        {props.exerciseRests
          .entrySeq()
          .filter(
            ([exerciseType]) =>
              EQUIPMENT_FOR_EXERCISE.get(exerciseType) === props.equipmentType,
          )
          .map(([exerciseType, restTime]) => (
            <ExerciseRestTime
              key={exerciseType}
              exerciseType={exerciseType}
              exerciseRest={restTime}
              removeExerciseRest={props.removeExerciseRest}
              onExerciseRestChange={props.onExerciseRestChange}
            />
          ))}
      </LabeledValue>
    </Stack>
  );
};

export default EquipmentRestTime;

const useEquipmentRestTimeAPI = (props: Props) => {
  const { onEquipmentRestChange, equipmentType } = props;
  const [equipmentRest, setEquipmentRest] = useState(props.equipmentRest);

  useEffect(() => {
    onEquipmentRestChange(equipmentType, equipmentRest);
  }, [equipmentRest, equipmentType, onEquipmentRestChange]);

  return { equipmentRest, setEquipmentRest };
};
