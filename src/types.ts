export enum LiftType {
  DEADLIFT = "deadlift",
  SQUAT = "squat",
  FRONT_SQUAT = "front-squat",
  BENCH_PRESS = "bench-press",
  OVERHEAD_PRESS = "overhead-press"
}

export type DisplayLift = { uid: string } & Lift;

export type Lift = {
  date: Date;
  weight: number;
  type: LiftType;
  reps: number;
};

export type Optional<T> = { [P in keyof T]?: T[P] };
export type Grouping<T> = { [grouping: string]: T[] };
