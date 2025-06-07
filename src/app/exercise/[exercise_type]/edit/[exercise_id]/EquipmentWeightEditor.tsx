import BarbellEditor from "@/components/BarbellEditor";
import DumbbellEditor from "@/components/DumbbellEditor";
import { Database } from "@/database.types";

export function EquipmentWeightEditor({
  equipment,
  weightValue,
  setWeightValue,
  weightUnit,
  setWeightUnit,
}: {
  equipment: Database["public"]["Enums"]["equipment_type_enum"];
  weightValue: number;
  setWeightValue: (v: number) => void;
  weightUnit: Database["public"]["Enums"]["weight_unit_enum"];
  setWeightUnit: (v: string) => void;
}) {
  switch (equipment) {
    case "barbell":
      return (
        <BarbellEditor
          totalWeight={weightValue}
          barWeight={45}
          onChange={setWeightValue}
          weightUnit={weightUnit}
          onUnitChange={(unit) =>
            setWeightUnit(
              unit as Database["public"]["Enums"]["weight_unit_enum"]
            )
          }
        />
      );
    case "dumbbell":
      return (
        <DumbbellEditor
          weight={weightValue}
          onChange={setWeightValue}
          weightUnit={weightUnit}
          onUnitChange={(unit) =>
            setWeightUnit(
              unit as Database["public"]["Enums"]["weight_unit_enum"]
            )
          }
        />
      );
    default:
      return null;
  }
}
