import classnames from "classnames";
import React from "react";
import { LiftType, WorkoutType } from "./index";
import { Weight } from "./Weight";
import { WeightUnit } from "./WeightUnit";

interface Title {
  title(): JSX.Element;
}

interface Table {
  table(context: { isActive: boolean; finishSection: () => void }): JSX.Element;
}

interface TableRow {
  header(): JSX.Element;
  row(context: {
    skipped: boolean;
    finished: boolean;
    selected: boolean;
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

class BarbellLift implements TableRow {
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

  public length(): number {
    return 4;
  }

  public header(): JSX.Element {
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
        <td>{this.weight.display(WeightUnit.POUND)}</td>
        <td>{this.liftType}</td>
        <td>{this.reps}</td>
        <td>{this.warmup}</td>
      </tr>
    );
  }
}

type ProgramSectionData = ProgramSectionDataGeneric<
  BodyWeightExercise | BarbellLift
>;

class ProgramSection implements Table, Title {
  public data: ProgramSectionData;
  public titleText: string;

  constructor(titleText: string, data: ProgramSectionData) {
    this.titleText = titleText;
    this.data = data;
  }

  public title(): JSX.Element {
    return <div className="is-5">{this.titleText}</div>;
  }

  public table({
    isActive,
    finishSection
  }: {
    isActive: boolean;
    finishSection: () => void;
  }): JSX.Element {
    const [current, setCurrent] = React.useState(0);
    const [skipped, setSkipped] = React.useState<Set<number>>(new Set());
    const [finished, setFinished] = React.useState<Set<number>>(new Set());
    const complete = current >= this.data.length;

    React.useEffect(() => {
      if (current >= this.data.length) {
        finishSection();
      }
    }, [current, finishSection]);

    return (
      <table className="table">
        {this.data[0].header()}
        <tbody>
          {this.data.map((row, idx) => (
            <React.Fragment key={`table-${idx}`}>
              {row.row({
                skipped: skipped.has(idx),
                finished: finished.has(idx),
                selected: isActive && idx === current
              })}
              {isActive && idx === current && (
                <tr>
                  <td colSpan={row.length()}>
                    <div className="control flex flex-center">
                      {idx + 1 < this.data.length && (
                        <div>
                          <button
                            onClick={() => {
                              setSkipped((old) => {
                                for (let i = idx; i <= this.data.length; i++) {
                                  old.add(i);
                                }
                                return new Set(old);
                              });
                              finishSection();
                            }}
                            className={`button is-danger`}
                          >
                            Skip Remaining
                          </button>
                        </div>
                      )}
                      {!complete && (
                        <div className="flex flex-end flex-grow buttons">
                          <button
                            onClick={() => {
                              setCurrent((old) => old + 1);
                              setSkipped((old) => {
                                old.add(idx);
                                return new Set(old);
                              });
                            }}
                            className="button is-outlined is-warning"
                          >
                            Skip
                          </button>
                          <button
                            onClick={() => {
                              setCurrent((old) => old + 1);
                              setFinished((old) => {
                                old.add(idx);
                                return new Set(old);
                              });
                            }}
                            className="button is-outlined is-success"
                          >
                            Done
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    );
  }
}

type ProgramSectionDataGeneric<T extends TableRow> = T[];

export class ProgramBuilder {
  public static pushups = (): ProgramSection => {
    const data: BodyWeightExercise[] = [
      new BodyWeightExercise(2, "pullup", true),
      new BodyWeightExercise(5, "pullup", false)
    ];
    return new ProgramSection("Simple Pullup", data);
  };

  public static xByX = (
    liftType: LiftType,
    workoutType: WorkoutType,
    targetORM: Weight
  ): ProgramSection => {
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
    return new ProgramSection(`${liftType} ${workoutType}`, data);
  };
  private data: ProgramSection[];

  constructor() {
    this.data = [];
  }

  public addProgramSection(programSection: ProgramSection) {
    this.data.push(programSection);
    return this;
  }

  public build() {
    return new Program2(this.data);
  }
}

export class Program2 {
  public static builder = (): ProgramBuilder => {
    return new ProgramBuilder();
  };
  // TODO - Add section for notes from the trainer, both for the Program, and
  // for each program section.
  private exercises: ProgramSection[];

  constructor(exercises: ProgramSection[]) {
    this.exercises = exercises;
  }

  public tables(): () => JSX.Element {
    const [activeExercise, setActiveExercise] = React.useState(0);
    const finishSection = React.useCallback(() => {
      setActiveExercise((old) => old + 1);
    }, []);
    return () => (
      <React.Fragment>
        {this.exercises.map((section, idx) => (
          <React.Fragment key={`program-${idx}`}>
            {section.title()}
            {section.table({ isActive: idx === activeExercise, finishSection })}
          </React.Fragment>
        ))}
      </React.Fragment>
    );
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
