import { EquipmentType, WeightUnit } from "@/common-types";
import BarbellEditor from "@/components/BarbellEditor/index";
import DumbbellEditor from "@/components/DumbbellEditor";

export function EquipmentWeightEditor({
  equipment,
  weightValue,
  setWeightValue,
  weightUnit,
  setWeightUnit,
}: {
  equipment: EquipmentType;
  weightValue: number;
  setWeightValue: (v: number) => void;
  weightUnit: WeightUnit;
  setWeightUnit: (v: WeightUnit) => void;
}) {
  switch (equipment) {
    case "barbell":
      return (
        <BarbellEditor
          totalWeight={weightValue}
          barWeight={45}
          onChange={setWeightValue}
          weightUnit={weightUnit}
          onUnitChange={(unit) => setWeightUnit(unit)}
        />
      );
    case "dumbbell":
      return (
        <DumbbellEditor
          weight={weightValue}
          onChange={setWeightValue}
          weightUnit={weightUnit}
          onUnitChange={(unit) => setWeightUnit(unit)}
        />
      );
    default:
      return null;
  }
}
