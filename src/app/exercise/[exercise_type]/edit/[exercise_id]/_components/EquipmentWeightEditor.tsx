import { EquipmentType, RoundingMode, WeightUnit } from "@/common-types";
import BarbellEditor from "@/components/BarbellEditor";
import DumbbellEditor from "@/components/DumbbellEditor";

interface EquipmentWeightEditorProps {
  equipment: EquipmentType;
  weightValue: number;
  setWeightValue: (v: number) => void;
  weightUnit: WeightUnit;
  availablePlates: number[];
  availableDumbbells: number[];
}

export function EquipmentWeightEditor(props: EquipmentWeightEditorProps) {
  switch (props.equipment) {
    case "barbell":
      return (
        <BarbellEditor
          editing
          targetWeight={props.weightValue}
          barWeight={45}
          onTargetWeightChange={props.setWeightValue}
          weightUnit={props.weightUnit}
          availablePlates={props.availablePlates}
          roundingMode={RoundingMode.NEAREST}
        />
      );
    case "dumbbell":
      return (
        <DumbbellEditor
          weightValue={props.weightValue}
          onChange={props.setWeightValue}
          weightUnit={props.weightUnit}
          availableDumbbells={props.availableDumbbells}
        />
      );
    default:
      return null;
  }
}
