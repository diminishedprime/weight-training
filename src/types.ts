import firebase from "firebase/app";
import * as ta from "typesafe-actions";
import * as rr from "react-redux";
import deadliftImage from "./images/deadlift.png";
import frontSquatImage from "./images/front_squat.png";
import backSquatImage from "./images/back_squat.png";
import overheadPressImage from "./images/overhead_press.png";
import benchPressImage from "./images/bench_press.png";

export * from "./actions";

export type Firestore = firebase.firestore.Firestore;

export const BAR_WEIGHT = 45;
export const ONE_REP_MAX = "one-rep-max";

export enum PlateTypes {
  FORTY_FIVE = "forty-five",
  // THIRTY_FIVE = 'thirty-five',
  TWENTY_FIVE = "twenty-five",
  TEN = "ten",
  FIVE = "five",
  TWO_AND_A_HALF = "two-and-a-half"
}

export const PlateWeight: { [plate in PlateTypes]: number } = {
  [PlateTypes.FORTY_FIVE]: 45,
  [PlateTypes.TWENTY_FIVE]: 25,
  [PlateTypes.TEN]: 10,
  [PlateTypes.FIVE]: 5,
  [PlateTypes.TWO_AND_A_HALF]: 2.5
};

export type PlateConfig = { [plate in PlateTypes]: number } | "not-possible";

export enum LiftType {
  DEADLIFT = "deadlift",
  SQUAT = "squat",
  FRONT_SQUAT = "front-squat",
  BENCH_PRESS = "bench-press",
  OVERHEAD_PRESS = "overhead-press"
}

export enum WorkoutType {
  CUSTOM = "custom",
  FIVE_BY_FIVE = "five-by-five",
  THREE_BY_THREE = "three-by-three"
}

export const WorkoutTypeLabel = {
  [WorkoutType.FIVE_BY_FIVE]: "5x5",
  [WorkoutType.CUSTOM]: "Custom",
  [WorkoutType.THREE_BY_THREE]: "3x3"
};

export type DisplayLift = { uid: string } & Lift;

export type Program = Array<ProgramLift>;

export type ProgramLift = {
  weight: number;
  type: LiftType;
  reps: number;
};

// db type
export type UserDoc = {
  [lift in LiftType]?: { [ONE_REP_MAX]?: number };
};

// db type (ish) the actual date is a firebase timestamp object.
export type Lift = {
  date: Date;
  weight: number;
  type: LiftType;
  reps: number;
};

export type Optional<T> = { [P in keyof T]?: T[P] };
export type Grouping<T> = { [grouping: string]: T[] };

export const liftSvgMap: { [lifttype in LiftType]: string } = {
  [LiftType.DEADLIFT]: deadliftImage,
  [LiftType.SQUAT]: backSquatImage,
  [LiftType.FRONT_SQUAT]: frontSquatImage,
  [LiftType.OVERHEAD_PRESS]: overheadPressImage,
  [LiftType.BENCH_PRESS]: benchPressImage
};

export type RootAction = ta.ActionType<typeof import("./actions")>;

export type RootState = {
  localStorage: {
    userDoc?: UserDoc;
  };
};

declare module "typesafe-actions" {
  interface Types {
    RootAction: RootAction;
  }
}

export const useSelector: rr.TypedUseSelectorHook<RootState> = rr.useSelector;

export type RecordLiftProps = {
  liftType: LiftType;
};

export enum LocalStorageKey {
  X_BY_X = "@weight-training/x-by-x",
  USER = "@weight-training/user",
  LIFTS = "@weight-training/lifts"
}

export interface User {
  uid: string;
}
