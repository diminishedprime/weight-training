import { LiftType as V1 } from "./v1";

export enum LiftType {
  Deadlift = "deadlift",
  Squat = "squat",
  FrontSquat = "front-squat",
  BenchPress = "bench-press",
  OverheadPress = "overhead-press",
  Snatch = "snatch",
  CleanAndJerk = "clean-and-jerk"
}

export const migrateV1 = (liftType: V1): LiftType => {
  switch (liftType) {
    case V1.BENCH_PRESS:
      return LiftType.BenchPress;
    case V1.DEADLIFT:
      return LiftType.BenchPress;
    case V1.FRONT_SQUAT:
      return LiftType.FrontSquat;
    case V1.OVERHEAD_PRESS:
      return LiftType.OverheadPress;
    case V1.SQUAT:
      return LiftType.Squat;
  }
};
