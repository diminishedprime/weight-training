import firebase from "firebase/app";
import * as rr from "react-redux";
import * as ta from "typesafe-actions";

export * from "./actions";

export type Firestore = firebase.firestore.Firestore;
export type Timestamp = firebase.firestore.Timestamp;

export const BAR_WEIGHT = 45;
export const ONE_REP_MAX = "one-rep-max";

export enum PlateTypes {
  FORTY_FIVE = "forty-five",
  // THIRTY_FIVE = 'thirty-five',
  TWENTY_FIVE = "twenty-five",
  TEN = "ten",
  FIVE = "five",
  TWO_AND_A_HALF = "two-and-a-half",
}

export type PlateConfig = { [plate in PlateTypes]: number } | "not-possible";

export enum LiftType {
  DEADLIFT = "deadlift",
  SQUAT = "squat",
  FRONT_SQUAT = "front-squat",
  BENCH_PRESS = "bench-press",
  OVERHEAD_PRESS = "overhead-press",
}

export enum WorkoutType {
  CUSTOM = "custom",
  FIVE_BY_FIVE = "five-by-five",
  THREE_BY_THREE = "three-by-three",
}

export const WorkoutTypeLabel = {
  [WorkoutType.FIVE_BY_FIVE]: "5x5",
  [WorkoutType.CUSTOM]: "Custom",
  [WorkoutType.THREE_BY_THREE]: "3x3",
};

export type DisplayLift = { uid: string } & Lift;

export type Program = ProgramLift[];

export interface ProgramLift {
  weight: number;
  type: LiftType;
  reps: number;
  warmup: boolean;
}

// db type
export type UserDoc = {
  [lift in LiftType]?: { [ONE_REP_MAX]?: number };
};

export interface Lift {
  date: Timestamp;
  weight: number;
  type: LiftType;
  reps: number;
  warmup: boolean | undefined;
}

export type Optional<T> = { [P in keyof T]?: T[P] };
export interface Grouping<T> { [grouping: string]: T[] }

export type RootAction = ta.ActionType<typeof import("./actions")>;

export interface RootState {
  localStorage: {
    userDoc?: UserDoc;
  };
  forceUpdateLift: number;
}

declare module "typesafe-actions" {
  interface Types {
    RootAction: RootAction;
  }
}

export const useSelector: rr.TypedUseSelectorHook<RootState> = rr.useSelector;

export interface RecordLiftProps {
  liftType: LiftType;
}

export const cacheDateKey = "@weight-training/cache-date-key";

export enum LocalStorageKey {
  DAYS_WITH_LIFTS = "@weight-training/days-with-lifts",
  X_BY_X = "@weight-training/x-by-x",
  USER = "@weight-training/user",
  USER_DOC = "@weight-training/user-doc",
  LIFTS = "@weight-training/lifts",
}

export interface User {
  uid: string;
}
