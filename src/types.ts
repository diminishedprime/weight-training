export enum LiftType {
  DEADLIFT = "deadlift",
  SQUAT = "squat",
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
