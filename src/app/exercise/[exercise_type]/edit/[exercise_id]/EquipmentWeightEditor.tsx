import { EquipmentType, WeightUnit } from "@/common-types";
import BarbellEditor from "@/components/BarbellEditor";
import DumbbellEditor from "@/components/DumbbellEditor";

interface EquipmentWeightEditorProps {
  equipment: EquipmentType;
  weightValue: number;
  setWeightValue: (v: number) => void;
  weightUnit: WeightUnit;
  availablePlates: number[];
}

export function EquipmentWeightEditor(props: EquipmentWeightEditorProps) {
  switch (props.equipment) {
    case "barbell":
      return (
        <BarbellEditor
          totalWeight={props.weightValue}
          barWeight={45}
          onChange={props.setWeightValue}
          weightUnit={props.weightUnit}
          availablePlates={props.availablePlates}
        />
      );
    case "dumbbell":
      return (
        <DumbbellEditor
          weight={props.weightValue}
          onChange={props.setWeightValue}
          weightUnit={props.weightUnit}
        />
      );
    default:
      return null;
  }
}
