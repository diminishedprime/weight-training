import React from "react";
import * as c from "../constants";
import { LiftType, WorkoutType, ProgramLift } from "./index";
import { Weight } from "./Weight";

interface Table {
  table(): JSX.Element;
}

interface TableRow {
  header(): JSX.Element;
  row(): JSX.Element;
  length(): number;
}

class BarbellLift implements TableRow {
  weight: Weight;
  targetORM: Weight;
  liftType: LiftType;
  reps: number;
  warmup: boolean;

  length(): number {
    return 4;
  }

  header(): JSX.Element {
    return (
      <thead>
        <tr>
          <th>Weight</th>
          <th>Lift</th>
          <th>Reps</th>
          <th>Warmup</th>
        </tr>
      </thead>
    );
  }

  row(): JSX.Element {
    return (
      <tr>
        <td>{this.weight}</td>
        <td>{c.liftMetadata[this.liftType].displayText}</td>
        <td>{this.reps}</td>
        <td>{this.warmup}</td>
      </tr>
    );
  }

  static from = (thing: {
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

interface DumbellLift {
  weight: Weight;
  dumbellLiftType: "curl" | "hammer-curl";
  reps: number;
  warmup: boolean;
}

interface BodyweightExercise {
  reps: number;
  bodyweightExerciseType: "pullup" | "chinup" | "pushup";
  warmup: boolean;
}

class ProgramSection implements Table {
  data: ProgramSectionData;
  current: undefined | number;
  constructor(data: ProgramSectionData) {
    this.data = data;
  }

  table(): JSX.Element {
    return (
      <table>
        {this.data[0].header()}
        {this.data.map((row, idx) => (
          <>
            {row.row()}
            {idx === this.current && (
              <tr>
                <td colSpan={row.length()}>Hi!</td>
              </tr>
            )}
          </>
        ))}
      </table>
    );
  }
}

type ProgramSectionData = Array<BarbellLift>;

export class Program2 {
  private exercises: Array<ProgramSection>;

  constructor(exercises: Array<ProgramSection>) {
    this.exercises = exercises;
  }

  static forLift = (
    liftType: LiftType,
    workoutType: WorkoutType,
    targetORM: Weight
  ): Program2 => {
    let data: BarbellLift[] = [];
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
    return new Program2([new ProgramSection(data)]);
  };
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
