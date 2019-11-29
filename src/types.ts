import * as firebase from "firebase/app";

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
  FIVE_BY_FIVE = "five-by-five"
}

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
  [LiftType.DEADLIFT]:
    "https://img.icons8.com/ios-filled/50/000000/deadlift.png",
  [LiftType.SQUAT]: "https://img.icons8.com/ios-filled/50/000000/squats.png",
  [LiftType.FRONT_SQUAT]:
    "https://i2.wp.com/www.winetoweightlifting.com/wp-content/uploads/2012/06/front-squat1-300x266.jpg?zoom=1.2999999523162842&resize=300%2C266",
  [LiftType.OVERHEAD_PRESS]:
    "https://img.icons8.com/ios-glyphs/50/000000/pullups.png",
  [LiftType.BENCH_PRESS]:
    "https://img.icons8.com/ios-filled/50/000000/bench-press.png"
};
