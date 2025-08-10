import {
  EquipmentType,
  RoundingMode,
  UserPreferences,
  WeightUnit,
} from "@/common-types";
import EditBarbell from "@/components/edit/weight/EditBarbell";
import EditDumbbell from "@/components/edit/weight/EditDumbbell";
import EditKettlebell from "@/components/edit/weight/EditKettlebell";
import EditMachineStack from "@/components/edit/weight/EditMachineStack";
import EditPlateStack from "@/components/edit/weight/EditPlateStack";
import { throwIfNull } from "@/util";
import { Stack, Typography } from "@mui/material";
import EditWeight from "./EditWeight";

export interface EquipmentWeightEditorProps {
  editing: boolean;
  equipmentType: EquipmentType;
  serverTarget: number;
  serverActual: number | null;
  weightUnit: WeightUnit;
  preferences: UserPreferences;
  // TODO: this value should come from preferences and be removed as a prop.
  barWeight: number | null;
  // TODO: this value should come from preferences and be removed as a prop.
  roundingMode: RoundingMode;
  onActualChange?: (value: number | null) => void;
  onTargetChange?: (value: number) => void;
  ignoreTarget?: boolean;
}

const EquipmentWeightEditor: React.FC<EquipmentWeightEditorProps> = (props) => {
  switch (props.equipmentType) {
    case "barbell":
      throwIfNull(
        props.barWeight,
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
          {...props}
          barWeight={props.barWeight}
          availablePlates={props.preferences.available_plates_lbs}
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
          {...props}
          availableDumbbells={props.preferences.available_dumbbells_lbs}
        />
      );
    case "machine":
      return <EditMachineStack {...props} />;
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
          {...props}
          availableKettlebells={props.preferences.available_kettlebells_lbs}
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
          {...props}
          availablePlates={props.preferences.available_plates_lbs}
        />
      );
    case "bodyweight":
      // TODO: consider making EditWeight support proper labels instead of doing
      // it custom, here.
      return (
        <Stack spacing={1} alignItems="center">
          <Typography>Added Weight</Typography>
          <EditWeight {...props} add5 add25 sub5 sub25 />
        </Stack>
      );
    default: {
      const _exhaustiveCheck: never = props.equipmentType;
      return _exhaustiveCheck;
    }
  }
};

export default EquipmentWeightEditor;
