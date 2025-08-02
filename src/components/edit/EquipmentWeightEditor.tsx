import {
  EquipmentType,
  RoundingMode,
  UserPreferences,
  WeightUnit,
} from "@/common-types";
import EditBarbell from "@/components/edit/EditBarbell";
import EditDumbbell from "@/components/edit/EditDumbbell";
import EditKettlebell from "@/components/edit/EditKettlebell";
import EditMachineStack from "@/components/edit/EditMachineStack";
import EditPlateStack from "@/components/edit/EditPlateStack";
import EditWeight from "@/components/edit/EditWeight";
import { throwIfNull } from "@/util";
import { Stack, Typography } from "@mui/material";

interface EquipmentWeightEditorProps {
  equipmentType: EquipmentType;
  targetWeightValue: number;
  actualWeightValue: number | undefined;
  weightUnit: WeightUnit;
  setActualWeightValue: React.Dispatch<React.SetStateAction<number>>;
  roundingMode: RoundingMode;
  preferences: UserPreferences;
  barWeightValue: number | undefined;
  editing?: boolean;
}

const EquipmentWeightEditor: React.FC<EquipmentWeightEditorProps> = (props) => {
  switch (props.equipmentType) {
    case "barbell":
      throwIfNull(
        props.barWeightValue,
        () =>
          new Error("barWeightValue is required for barbell equipment type"),
      );
      throwIfNull(
        props.preferences.available_plates_lbs,
        () =>
          new Error(
            "available_plates_lbs is required for barbell equipment type",
          ),
      );
      return (
        <EditBarbell
          editing={props.editing}
          targetWeightValue={props.targetWeightValue}
          actualWeightValue={props.actualWeightValue}
          setActualWeightValue={props.setActualWeightValue}
          roundingMode={props.roundingMode}
          weightUnit={props.weightUnit}
          availablePlates={props.preferences.available_plates_lbs}
          barWeightValue={props.barWeightValue}
        />
      );
    case "dumbbell":
      throwIfNull(
        props.preferences.available_dumbbells_lbs,
        () =>
          new Error(
            "available_dumbbells_lbs is required for dumbbell equipment type",
          ),
      );
      return (
        <EditDumbbell
          weightValue={props.targetWeightValue}
          onChange={props.setActualWeightValue}
          weightUnit={props.weightUnit}
          availableDumbbells={props.preferences.available_dumbbells_lbs}
        />
      );
    case "machine":
      return (
        <EditMachineStack
          weightValue={props.targetWeightValue}
          setWeightValue={props.setActualWeightValue}
          weightUnit={props.weightUnit}
        />
      );
    case "kettlebell":
      throwIfNull(
        props.preferences.available_kettlebells_lbs,
        () =>
          new Error(
            "available_kettlebells_lbs is required for kettlebell equipment type",
          ),
      );
      return (
        <EditKettlebell
          weightValue={props.targetWeightValue}
          setWeightValue={props.setActualWeightValue}
          weightUnit={props.weightUnit}
          roundingMode={props.roundingMode}
          availableKettlebells={props.preferences.available_kettlebells_lbs}
          size={undefined}
        />
      );
    case "plate_stack":
      throwIfNull(
        props.preferences.available_plates_lbs,
        () =>
          new Error(
            "available_plates_lbs is required for plate_stack equipment type",
          ),
      );
      return (
        <EditPlateStack
          weightValue={props.targetWeightValue}
          setWeightValue={props.setActualWeightValue}
          weightUnit={props.weightUnit}
          availablePlates={props.preferences.available_plates_lbs}
        />
      );
    case "bodyweight":
      // TODO: consider making EditWeight support proper labels instead of doing
      // it custom, here.
      return (
        <Stack spacing={1} alignItems="center">
          <Typography>Added Weight</Typography>
          <EditWeight
            add5
            add25
            sub5
            sub25
            weightValue={props.targetWeightValue}
            setWeightValue={props.setActualWeightValue}
          />
        </Stack>
      );
    default: {
      const _exhaustiveCheck: never = props.equipmentType;
      return _exhaustiveCheck;
    }
  }
};

export default EquipmentWeightEditor;
