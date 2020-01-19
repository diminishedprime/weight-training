import { LiftType, WorkoutType, ProgramLift } from "./index";
import { Weight } from "./Weight";

type ProgramLifts = Array<ProgramLift>;

type Exercises = Array<ProgramLifts>;

// TODO - create a method on Program2 that creates tables for each Exercises
// entry.

export class Program2 {
  private exercises: Exercises;

  constructor(exercises: Exercises) {
    this.exercises = exercises;
  }

  static forLift = (
    liftType: LiftType,
    workoutType: WorkoutType,
    targetORM: Weight
  ): Program2 => {
    let data: ProgramLifts = [];
    switch (workoutType) {
      case WorkoutType.FIVE_BY_FIVE:
        data = progressionFor(targetORM, 0.8, 5, 5, liftType);
        break;
      case WorkoutType.THREE_BY_THREE:
        data = progressionFor(targetORM, 0.9, 3, 3, liftType);
        break;
      default:
        throw new Error(`${workoutType} is not accounted for yet.`);
    }
    return new Program2([data]);
  };
}

const progressionFor = (
  oneRepMax: Weight,
  fraction: number,
  liftsAtWeight: number,
  reps: number,
  type: LiftType
): ProgramLifts => {
  const bar = Weight.bar();
  const targetWeight = oneRepMax.multiply(fraction).nearestFive();
  const jump = targetWeight.subtract(bar).divide(4);
  const warmup = false;
  const oneJump = bar.add(jump).nearestFive();
  const twoJump = bar.add(jump.multiply(2)).nearestFive();
  const threeJump = bar.add(jump.multiply(3)).nearestFive();
  return [
    { weight: bar, reps: 5, type, warmup: true },
    { weight: oneJump, reps: 5, type, warmup: true },
    { weight: twoJump, reps: 3, type, warmup: true },
    { weight: threeJump, reps: 2, type, warmup: true },
    ...range(liftsAtWeight).map(() => ({
      weight: targetWeight,
      reps,
      type,
      warmup
    }))
  ];
};

const range = (to: number): undefined[] => {
  const a: undefined[] = [];
  for (let i = 0; i < to; i++) {
    a.push(undefined);
  }
  return a;
};
