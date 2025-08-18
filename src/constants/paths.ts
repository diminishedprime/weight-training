import { EquipmentType, ExerciseType } from "@/common-types";

const Home = "/";

// Exercise
const Exercise = `/exercise`;

const Exercise_EquipmentType = (equipmentType: EquipmentType) =>
  `${Exercise}/${equipmentType}`;

const Exercise_EquipmentType_ExerciseType = (
  equipmentType: EquipmentType,
  exerciseType: ExerciseType,
) => `${Exercise_EquipmentType(equipmentType)}/${exerciseType}`;

const Exercise_EquipmentType_ExerciseType_Edit_ExerciseId = (
  equipmentType: EquipmentType,
  exerciseType: ExerciseType,
  exerciseId: string,
) =>
  `${Exercise_EquipmentType_ExerciseType(equipmentType, exerciseType)}/edit/${exerciseId}`;

// Login
const Login = `/login`;

// Personal Records
const PersonalRecords = `/personal-records`;

const PersonalRecords_ExerciseType = (exerciseType: ExerciseType) =>
  `${PersonalRecords}/${exerciseType}`;

// Preferences
const Preferences = `/preferences`;

const Preferences_RestTimes = `${Preferences}/rest-times`;

// Programs
const Programs = `/programs`;
const Programs_Add = `${Programs}/add`;
const Programs_ProgramId = (programId: string) => `${Programs}/${programId}`;

// Superblocks
const Superblocks = `/superblocks`;

const Superblocks_SuperblockId = (superblockId: string) =>
  `${Superblocks}/${superblockId}`;

const Superblocks_SuperblockId_Edit = (superblockId: string) =>
  `${Superblocks_SuperblockId(superblockId)}/edit`;

const Superblocks_SuperblockId_Perform = (superblockId: string) =>
  `${Superblocks_SuperblockId(superblockId)}/perform`;

// TODO: Add in a export const PathLabel which is directly used by breadcrumbs
// so we don't have to have the using component figure out the labeling.
// TODO: rename this const to Path instead of Paths.
export const Paths = {
  // Base path
  Home,
  // Exercise
  Exercise,
  Exercise_EquipmentType,
  Exercise_EquipmentType_ExerciseType,
  Exercise_EquipmentType_ExerciseType_Edit_ExerciseId,
  // Login
  Login,
  // Personal Records
  PersonalRecords,
  PersonalRecords_ExerciseType,
  // Preferences
  Preferences,
  Preferences_RestTimes,
  // Programs
  Programs,
  Programs_Add,
  Programs_ProgramId,
  // Superblocks
  Superblocks,
  Superblocks_SuperblockId,
  Superblocks_SuperblockId_Perform,
  Superblocks_SuperblockId_Edit,
} as const;

export const SearchParam = {
  BackTo: "back_to",
  PageNum: "page_num",
  Editable: "editable",
} as const;

export const WithSearchParams = (
  basePath: string,
  ...params: [(typeof SearchParam)[keyof typeof SearchParam], string][]
) => {
  const searchParams = new URLSearchParams(params);
  return `${basePath}?${searchParams.toString()}`;
};
