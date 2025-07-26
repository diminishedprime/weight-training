import { EquipmentType, ExerciseType, WeightUnit } from "@/common-types";

export const DEFAULT_BAR_WEIGHT = 45; // lbs
export const ALL_PLATES = [55, 45, 35, 25, 10, 5, 2.5];
export const DEFAULT_PLATE_SIZES = [45, 25, 10, 5, 2.5];

export const PARAMS = {
  BackTo: "back_to",
  PageNum: "page_num",
};

export const PLATE_COLORS: Record<number, { bg: string; fg: string }> = {
  45: { bg: "red", fg: "white" },
  35: { bg: "blue", fg: "white" },
  25: { bg: "yellow", fg: "black" },
  10: { bg: "green", fg: "white" },
  5: { bg: "black", fg: "white" },
  2.5: { bg: "pink", fg: "black" },
  1.25: { bg: "orange", fg: "black" },
};

export const AVAILABLE_PLATES: number[] = [
  1.25, 2.5, 5, 10, 25, 35, 45, 50, 55, 100,
];
export const COMMON_AVAILABLE_PLATES: number[] = [2.5, 5, 10, 25, 45];

export const AVAILABLE_DUMBBELLS: Array<number> = [
  1, 2, 3, 5, 8, 10, 12, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80,
  85, 90, 95, 100,
];

export const WENDLER_EXERCISE_TYPES: ExerciseType[] = [
  "barbell_overhead_press",
  "barbell_bench_press",
  "barbell_back_squat",
  "barbell_deadlift",
];

const AVAILABLE_KETTLEBELLS_LBS = [18, 26, 35, 44, 53];

export const DEFAULT_VALUES = {
  PREFERRED_WEIGHT_UNIT: "pounds" as WeightUnit,
  REST_TIME_SECONDS: 120,
  AVAILABLE_PLATES_LBS: AVAILABLE_PLATES,
  AVAILABLE_DUMBBELLS_LBS: AVAILABLE_DUMBBELLS,
  AVAILABLE_KETTLEBELLS_LBS: AVAILABLE_KETTLEBELLS_LBS,
  SELECTED_PLATES: COMMON_AVAILABLE_PLATES,
};

// Page paths
export const pathForBarbellPage = `/exercise/barbell`;

export const pathForEquipmentPage = (equipmentType: EquipmentType) =>
  `/exercise/${equipmentType}`;

export const pathForEquipmentExercisePage = (
  eqipmentType: EquipmentType,
  exerciseType: ExerciseType,
) => `${pathForEquipmentPage(eqipmentType)}/${exerciseType}`;

export const pathForPaginatedEquipmentExercisePage = (
  equipmentType: EquipmentType,
  exerciseType: ExerciseType,
  pageNum: number,
) => {
  const searchParams = new URLSearchParams();
  searchParams.set(PARAMS.PageNum, pageNum.toString());
  const search = `?${searchParams.toString()}`;
  return `${pathForEquipmentExercisePage(equipmentType, exerciseType)}${search}`;
};
const pathForExerciseBlocksPage = `/exercise-block`;

export const pathForPaginatedExerciseBlocksPage = (pageNum: number) => {
  const searchParams = new URLSearchParams();
  searchParams.set(PARAMS.PageNum, pageNum.toString());
  const search = `?${searchParams.toString()}`;
  return `${pathForExerciseBlocksPage}${search}`;
};

export const pathForEquipmentExerciseEdit = (
  equipmentType: EquipmentType,
  exerciseType: ExerciseType,
  exerciseId: string,
  backTo?: string,
) => {
  const searchParams = new URLSearchParams();
  if (backTo) {
    searchParams.set(PARAMS.BackTo, backTo);
  }
  const searchParamsString = searchParams.toString();
  const search = searchParamsString ? `?${searchParamsString}` : "";
  return `${pathForEquipmentExercisePage(equipmentType, exerciseType)}/edit/${exerciseId}${search}`;
};

export const pathForBarbellExercisePage = (barbell_exercise_type: string) =>
  `/exercise/barbell/${barbell_exercise_type}`;

export const pathForBarbellExerciseEdit = (
  barbell_exercise_type: string,
  exerciseId: string,
) => `/exercise/barbell/${barbell_exercise_type}/edit/${exerciseId}`;
export const FIRST_PAGE_NUM = 1;
