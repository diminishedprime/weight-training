import { BarbellLiftType } from "./db";
import { WorkoutType } from "./index";
import { Weight } from "./Weight";

interface BodyWeightExercise {
  reps: number;
  type: "pullup" | "chinup" | "pushup";
  warmup: boolean;
}

export interface BarbellLift {
  weight: Weight;
  targetORM: Weight;
  liftType: BarbellLiftType;
  reps: number;
  warmup: boolean;
}

interface BarbellLifts {
  rows: BarbellLift[];
  type: "BarbellLifts";
}

interface BodyWeightExercises {
  rows: BodyWeightExercise[];
  type: "BodyWeightExercise";
}

type ProgramSectionData = BarbellLifts | BodyWeightExercises;

export interface ProgramSection {
  data: ProgramSectionData;
  titleText: string;
}

export class ProgramBuilder {
  public static pushups = (): ProgramSection => {
    const rows: BodyWeightExercise[] = [
      { reps: 2, type: "pullup", warmup: true },
      { reps: 5, type: "pullup", warmup: false }
    ];
    return {
      titleText: "Simple Pullup",
      data: { rows, type: "BodyWeightExercise" }
    };
  };

  public static xByX = (
    liftType: BarbellLiftType,
    workoutType: WorkoutType,
    targetORM: Weight
  ): ProgramSection => {
    let rows: BarbellLift[] = [];
    switch (workoutType) {
      case WorkoutType.FIVE_BY_FIVE:
        rows = progressionFor(targetORM, 0.8, 5, 5, liftType);
        break;
      case WorkoutType.THREE_BY_THREE:
        rows = progressionFor(targetORM, 0.9, 3, 3, liftType);
        break;
      default:
        throw new Error(`${workoutType} is not accounted for yet.`);
    }
    return {
      titleText: `${liftType} ${workoutType}`,
      data: {
        rows,
        type: "BarbellLifts"
      }
    };
  };
  private data: ProgramSection[];
  private displayName: string;

  constructor() {
    this.data = [];
    this.displayName = "";
  }

  public setDisplayName(displayName: string) {
    this.displayName = displayName;
    return this;
  }

  public addProgramSection(programSection: ProgramSection) {
    this.data.push(programSection);
    return this;
  }

  public build() {
    if (this.displayName === "") {
      throw new Error(
        "Display name cannot be blank, make sure to call .setDisplayName() in the builder"
      );
    }
    return new Program(this.data, this.displayName);
  }
}

export class Program {
  public static builder = (): ProgramBuilder => {
    return new ProgramBuilder();
  };
  // TODO - Add section for notes from the trainer, both for the Program, and
  // for each program section.
  private exercises: ProgramSection[];
  private displayName: string;

  constructor(exercises: ProgramSection[], displayName: string) {
    this.exercises = exercises;
    this.displayName = displayName;
  }

  public getExercises() {
    return this.exercises;
  }

  public getDisplayName(): string {
    return this.displayName;
  }
}

const progressionFor = (
  oneRepMax: Weight,
  fraction: number,
  liftsAtWeight: number,
  reps: number,
  liftType: BarbellLiftType
): BarbellLift[] => {
  const bar = Weight.bar();
  const targetORM = oneRepMax.multiply(fraction).nearestFive();
  const jump = targetORM.subtract(bar).divide(4);
  const warmup = false;
  const oneJump = bar.add(jump).nearestFive();
  const twoJump = bar.add(jump.multiply(2)).nearestFive();
  const threeJump = bar.add(jump.multiply(3)).nearestFive();
  return [
    {
      weight: bar,
      reps: 5,
      liftType,
      warmup: true,
      targetORM
    },
    {
      weight: oneJump,
      reps: 5,
      liftType,
      warmup: true,
      targetORM
    },
    {
      weight: twoJump,
      reps: 3,
      liftType,
      warmup: true,
      targetORM
    },
    {
      weight: threeJump,
      reps: 2,
      liftType,
      warmup: true,
      targetORM
    },
    ...range(liftsAtWeight).map(() => ({
      weight: targetORM,
      reps,
      liftType,
      warmup,
      targetORM
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
