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
  weightValue: number;
  weightUnit: WeightUnit;
  setWeightValue: React.Dispatch<React.SetStateAction<number>>;
  roundingMode: RoundingMode;
  preferences: UserPreferences;
  barWeightValue: number | undefined;
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
          editing
          targetWeightValue={props.weightValue}
          onTargetWeightChange={props.setWeightValue}
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
          weightValue={props.weightValue}
          onChange={props.setWeightValue}
          weightUnit={props.weightUnit}
          availableDumbbells={props.preferences.available_dumbbells_lbs}
        />
      );
    case "machine":
      return (
        <EditMachineStack
          weightValue={props.weightValue}
          setWeightValue={props.setWeightValue}
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
          weightValue={props.weightValue}
          setWeightValue={props.setWeightValue}
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
          weightValue={props.weightValue}
          setWeightValue={props.setWeightValue}
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
            weightValue={props.weightValue}
            setWeightValue={props.setWeightValue}
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
