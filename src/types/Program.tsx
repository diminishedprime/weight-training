import classnames from "classnames";
import React from "react";
import * as t from "../types";
import { LiftType, WorkoutType } from "./index";
import { Weight } from "./Weight";

interface Title {
  title(): JSX.Element;
}

interface Table {
  table(context: { isActive: boolean; finishSection: () => void }): JSX.Element;
}

interface TableRow {
  header(): JSX.Element;
  completeExercise(user: t.FirebaseUser): void;
  row(context: {
    selected: boolean;
    skipped: boolean;
    finished: boolean;
    user: t.FirebaseUser;
  }): JSX.Element;
  length(): number;
}

class BodyWeightExercise implements TableRow {
  public reps: number;
  public type: "pullup" | "chinup" | "pushup";
  public warmup: boolean;

  constructor(
    reps: number,
    type: "pullup" | "chinup" | "pushup",
    warmup: boolean
  ) {
    this.reps = reps;
    this.type = type;
    this.warmup = warmup;
  }

  public completeExercise() {
    // TODO - update this once I actually have body weight exercises implemented.
    console.log("I did it");
  }

  public length() {
    return 3;
  }

  public row({
    skipped,
    finished,
    selected
  }: {
    selected: boolean;
    skipped: boolean;
    finished: boolean;
  }): JSX.Element {
    // TODO - figure out a better way to get the default units here.
    const cn = classnames({
      "is-selected": selected,
      "has-background-success": finished,
      "has-background-warning": skipped
    });
    return (
      <tr className={cn}>
        <td>{this.type}</td>
        <td>{this.reps}</td>
        <td>{this.warmup}</td>
      </tr>
    );
  }

  public header(): JSX.Element {
    return (
      <thead>
        <tr>
          <th>Exercise</th>
          <th>Reps</th>
          <th>Warmup</th>
        </tr>
      </thead>
    );
  }
}

export class BarbellLift {
  public static from = (thing: {
    weight: Weight;
    targetORM: Weight;
    liftType: LiftType;
    reps: number;
    warmup: boolean;
  }): BarbellLift => {
    return new BarbellLift(
      thing.weight,
      thing.targetORM,
      thing.liftType,
      thing.reps,
      thing.warmup
    );
  };
  public weight: Weight;
  public targetORM: Weight;
  public liftType: LiftType;
  public reps: number;
  public warmup: boolean;

  constructor(
    weight: Weight,
    targetORM: Weight,
    liftType: LiftType,
    reps: number,
    warmup: boolean
  ) {
    this.weight = weight;
    this.targetORM = targetORM;
    this.liftType = liftType;
    this.reps = reps;
    this.warmup = warmup;
  }
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

export class ProgramSection {
  public data: ProgramSectionData;
  public titleText: string;

  constructor(titleText: string, data: ProgramSectionData) {
    this.titleText = titleText;
    this.data = data;
  }
}

export class ProgramBuilder {
  public static pushups = (): ProgramSection => {
    const rows: BodyWeightExercise[] = [
      new BodyWeightExercise(2, "pullup", true),
      new BodyWeightExercise(5, "pullup", false)
    ];
    return new ProgramSection("Simple Pullup", {
      rows,
      type: "BodyWeightExercise"
    });
  };

  public static xByX = (
    liftType: LiftType,
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
    return new ProgramSection(`${liftType} ${workoutType}`, {
      rows,
      type: "BarbellLifts"
    });
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
    return new Program2(this.data, this.displayName);
  }
}

export class Program2 {
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
  liftType: LiftType
): BarbellLift[] => {
  const bar = Weight.bar();
  const targetORM = oneRepMax.multiply(fraction).nearestFive();
  const jump = targetORM.subtract(bar).divide(4);
  const warmup = false;
  const oneJump = bar.add(jump).nearestFive();
  const twoJump = bar.add(jump.multiply(2)).nearestFive();
  const threeJump = bar.add(jump.multiply(3)).nearestFive();
  return [
    BarbellLift.from({
      weight: bar,
      reps: 5,
      liftType,
      warmup: true,
      targetORM
    }),
    BarbellLift.from({
      weight: oneJump,
      reps: 5,
      liftType,
      warmup: true,
      targetORM
    }),
    BarbellLift.from({
      weight: twoJump,
      reps: 3,
      liftType,
      warmup: true,
      targetORM
    }),
    BarbellLift.from({
      weight: threeJump,
      reps: 2,
      liftType,
      warmup: true,
      targetORM
    }),
    ...range(liftsAtWeight).map(() =>
      BarbellLift.from({
        weight: targetORM,
        reps,
        liftType,
        warmup,
        targetORM
      })
    )
  ];
};

const range = (to: number): undefined[] => {
  const a: undefined[] = [];
  for (let i = 0; i < to; i++) {
    a.push(undefined);
  }
  return a;
};
