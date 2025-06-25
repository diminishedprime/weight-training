import { Constants, Database } from "@/database.types";
import { equipmentForExercise } from "@/util";

// Types
export type EquipmentType = Database["public"]["Enums"]["equipment_type_enum"];

export type SortableEquipment = Record<EquipmentType, number>;

// Utility: Map equipment type to a sortable number
export const equipmentToNum: SortableEquipment =
  Constants.public.Enums.equipment_type_enum
    .map((a, idx) => ({ [a]: idx }))
    .reduce((a, b) => ({ ...a, ...b }), {}) as never as SortableEquipment;

/**
 * Comparison function for exercises.
 * @param a - First preference object
 * @param b - Second preference object
 * @returns -1, 0, or 1 for sort order
 */
export const exerciseSorter = (
  a: { exercise_type: Database["public"]["Enums"]["exercise_type_enum"] },
  b: { exercise_type: Database["public"]["Enums"]["exercise_type_enum"] }
) => {
  const aNum = equipmentToNum[equipmentForExercise(a.exercise_type!)];
  const bNum = equipmentToNum[equipmentForExercise(b.exercise_type!)];
  if (aNum < bNum) return -1;
  if (aNum > bNum) return 1;
  // If equipment is the same, sort alphabetically by exercise_type
  if (a.exercise_type! < b.exercise_type!) return -2;
  if (a.exercise_type! > b.exercise_type!) return 2;
  return 0;
};

export const sortPreferencesData = (
  preferencesData: Array<{
    exercise_type: Database["public"]["Enums"]["exercise_type_enum"];
  }>
) => {
  preferencesData.sort((a, b) => exerciseSorter(a, b));
  return preferencesData;
};
