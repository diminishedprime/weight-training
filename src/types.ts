export const BAR_WEIGHT = 45;

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
