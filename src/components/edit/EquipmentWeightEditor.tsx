import {
  EquipmentType,
  RoundingMode,
  UserPreferences,
  WeightUnit,
} from "@/common-types";
import EditBarbell from "@/components/edit/EditBarbell";
import EditDumbbell from "@/components/edit/EditDumbbell";
import EditMachineStack from "@/components/edit/EditMachineStack";
import { throwIfNull } from "@/util";

interface EquipmentWeightEditorProps {
  equipmentType: EquipmentType;
  weightValue: number;
  weightUnit: WeightUnit;
  setWeightValue: React.Dispatch<React.SetStateAction<number>>;
  roundingMode: RoundingMode;
  preferences: UserPreferences;
  barWeight: number | undefined;
}

const EquipmentWeightEditor: React.FC<EquipmentWeightEditorProps> = (props) => {
  switch (props.equipmentType) {
    case "barbell":
      throwIfNull(
        props.barWeight,
        () => new Error("barWeight is required for barbell equipment type"),
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
          barWeight={props.barWeight}
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
    default:
      return <div>Unsupported Equipment Type</div>;
  }
};

export default EquipmentWeightEditor;
