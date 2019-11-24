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
  lift: "deadlift";
  reps: number;
  missed: boolean;
};
