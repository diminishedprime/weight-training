import firebase from "firebase/app";
import { LiftType } from "../LiftType/v2";
import { WeightField } from "../WeightField";

interface DeadliftDoc {
  date: firebase.firestore.Timestamp;
  weight: WeightField;
  type: LiftType.Deadlift;
  reps: number;
  warmup: boolean;
}

interface SquatDoc {
  date: firebase.firestore.Timestamp;
  weight: WeightField;
  type: LiftType.Squat;
  reps: number;
  warmup: boolean;
}

interface FrontSquatDoc {
  date: firebase.firestore.Timestamp;
  weight: WeightField;
  type: LiftType.FrontSquat;
  reps: number;
  warmup: boolean;
}

interface BenchPressDoc {
  date: firebase.firestore.Timestamp;
  weight: WeightField;
  type: LiftType.BenchPress;
  reps: number;
  warmup: boolean;
}

interface OverheadPressDoc {
  date: firebase.firestore.Timestamp;
  weight: WeightField;
  type: LiftType.OverheadPress;
  reps: number;
  warmup: boolean;
}

interface SnatchDoc {
  date: firebase.firestore.Timestamp;
  weight: WeightField;
  type: LiftType.Snatch;
  reps: number;
  warmup: boolean;
  style: "full" | "muscle" | "power";
  startPosition: "high hang" | "above the knee" | "below the knee" | "floor";
}

interface CleanAndJerkDoc {
  date: firebase.firestore.Timestamp;
  weight: WeightField;
  type: LiftType.CleanAndJerk;
  reps: number;
  warmup: boolean;
  style: "full" | "muscle" | "power";
  startPosition: "high hang" | "above the knee" | "below the knee" | "floor";
}

type BaseLiftDoc =
  | CleanAndJerkDoc
  | SnatchDoc
  | DeadliftDoc
  | SquatDoc
  | FrontSquatDoc
  | BenchPressDoc
  | OverheadPressDoc;

export type LiftDoc = BaseLiftDoc & { v: "3" };
