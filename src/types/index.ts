import * as rr from "react-redux";
import * as ta from "typesafe-actions";
import {
  Analytics,
  Auth,
  Firestore,
  FirestoreTimestamp,
  Plate
} from "./common";
import {
  LiftDoc as DBLiftDoc,
  SnatchPosition,
  SnatchStyle
} from "./db/LiftDoc";
import { Lift } from "./Lift";
import { Program } from "./Program";
import { UserDoc } from "./UserDoc";
import { Weight } from "./Weight";
import { WeightUnit } from "./WeightUnit";

export * from "./common";
export * from "./Program";
export * from "./WeightUnit";
export { Weight } from "./Weight";
export { UserDoc } from "./UserDoc";
export * from "./db";
export { Lift } from "./Lift";
export * from "./Timestamp";
export * from "../actions";
export * from "./Metadata";

export interface OneRepMax {
  weight: Weight;
  time: FirestoreTimestamp;
}

// TODO - this method should be generic on o. It should only work for signatures
// from versioed firestoreFields. (which requires me to add a marker interface
// for versioned firestore fields.)
export type FromFirestore<T> = (o: object) => T;

export const BAR_WEIGHT = 45;

export interface Equals<T> {
  equals(a: T): boolean;
}

// Deprecated
export interface AsFirestore<T> extends Versioned {
  asFirestore(): T;
}

export interface Versioned {
  getVersion: () => string;
}

// Deprecated
export interface AsJson extends Versioned {
  asJSON(): string;
}

export type PlateConfig = Plate[] | "not-possible";

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

export type Optional<T> = { [P in keyof T]?: T[P] };
export interface Grouping<T> {
  [grouping: string]: T[];
}

export type RootAction = ta.ActionType<typeof import("../actions")>;

export interface WeightTrainingDb {
  addSnatch: (
    user: FirebaseUser,
    date: FirestoreTimestamp,
    weight: Weight,
    reps: number,
    warmup: boolean,
    style: SnatchStyle,
    startPosition: SnatchPosition
  ) => Promise<DisplayLift>;
}

export interface RootState {
  analytics: Analytics;
  auth: Auth;
  firestore: Firestore;
  userDoc?: UserDoc;
  db: WeightTrainingDb;
  forceUpdateLift: number;
  program?: Program;
}

declare module "typesafe-actions" {
  interface Types {
    RootAction: RootAction;
  }
}

export const useSelector: rr.TypedUseSelectorHook<RootState> = rr.useSelector;

export const cacheDateKey = "@weight-training/cache-date-key";

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
