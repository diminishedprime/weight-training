import firebase from "firebase/app";
import * as rr from "react-redux";
import * as ta from "typesafe-actions";
import { LiftType } from "./common";
import { PlateTypes } from "./common";
import { LiftDoc as DBLiftDoc } from "./db/LiftDoc";
import { Lift } from "./Lift";
import { Program2 } from "./Program";
import { UserDoc } from "./UserDoc";
import { Weight } from "./Weight";
import { WeightUnit } from "./WeightUnit";

// TODO - This should be removed once I make a proper UserDoc class
export * from "./common";
export * from "./Program";
export * from "./WeightUnit";
export { Weight } from "./Weight";
export { UserDoc } from "./UserDoc";
export * from "./db";
export { Lift } from "./Lift";
export * from "./Timestamp";
export * from "../actions";

export interface OneRepMax {
  weight: Weight;
  time: FirestoreTimestamp;
}

export type Firestore = firebase.firestore.Firestore;
export type FirestoreTimestamp = firebase.firestore.Timestamp;

export type FromFirestore<T> = (o: object) => T;

export const BAR_WEIGHT = 45;

export interface Equals<T> {
  equals(a: T): boolean;
}
export interface AsFirestore extends Versioned {
  asFirestore(): object;
}

export interface Versioned {
  getVersion: () => string;
}

export interface AsJson extends Versioned {
  asJSON(): string;
}

export type PlateConfig = { [plate in PlateTypes]: number } | "not-possible";

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

export type Program = ProgramLift[];

export interface ProgramLift {
  weight: Weight;
  type: LiftType;
  reps: number;
  warmup: boolean;
}

export type Optional<T> = { [P in keyof T]?: T[P] };
export interface Grouping<T> {
  [grouping: string]: T[];
}

export type RootAction = ta.ActionType<typeof import("../actions")>;

export interface RootState {
  localStorage: {
    userDoc?: UserDoc;
  };
  forceUpdateLift: number;
  program?: Program2;
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
  SETTINGS = "@weight-training/settings",
  DAYS_WITH_LIFTS = "@weight-training/days-with-lifts",
  DAYS_WITH_LIFTS_LOCAL = "@weight-training/days-with-lifts-local",
  X_BY_X = "@weight-training/x-by-x",
  FIREBASE_USER = "@weight-training/user",
  USER_DOC = "@weight-training/user-doc",
  LIFTS = "@weight-training/lifts"
}

export interface FirebaseUser {
  uid: string;
}

export interface Settings {
  version: "1";
  showOlympic: boolean;
  unit: WeightUnit;
}

export class DisplayLift extends Lift {
  public uid: string;

  constructor({ uid, ...firestoreDoc }: DBLiftDoc & { uid: string }) {
    super(firestoreDoc);
    this.uid = uid;
  }
}
