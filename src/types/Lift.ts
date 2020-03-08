import { BarbellLiftType, LiftDoc } from "./db";
import {
  CleanAndJerkPosition,
  CleanAndJerkStyle,
  SnatchDoc,
  SnatchPosition,
  SnatchStyle,
  toLift
} from "./db/LiftDoc";
import { HasFirestoreField, withBrand } from "./db/marker";
import { DisplayLift } from "./index";
import { Equals, FirestoreTimestamp, LiftType, Weight } from "./index";

export class Lift implements HasFirestoreField<LiftDoc>, Equals<Lift> {
  public static fromFirestoreData = toLift;

  public static cleanAndJerk = (
    date: FirestoreTimestamp,
    weight: Weight,
    reps: number,
    warmup: boolean,
    style: CleanAndJerkStyle,
    startPosition: CleanAndJerkPosition
  ): Lift => {
    return new Lift(
      withBrand({
        type: LiftType.CleanAndJerk,
        startPosition,
        style,
        date,
        weight: weight.asFirestore(),
        reps,
        warmup,
        version: "3"
      })
    );
  };

  public static snatch = (
    date: FirestoreTimestamp,
    weight: Weight,
    reps: number,
    warmup: boolean,
    style: SnatchStyle,
    startPosition: SnatchPosition
  ): Lift => {
    return new Lift(
      withBrand({
        type: LiftType.Snatch,
        startPosition,
        style,
        date,
        weight: weight.asFirestore(),
        reps,
        warmup,
        version: "3"
      })
    );
  };

  public static forBarbellLift = (
    weight: Weight,
    liftType: BarbellLiftType,
    reps: number,
    warmup: boolean,
    date: FirestoreTimestamp
  ) => {
    switch (liftType) {
      case LiftType.BenchPress:
        return new Lift(
          withBrand({
            version: "3",
            ...{
              weight: weight.asFirestore(),
              type: liftType,
              reps,
              warmup,
              date
            }
          })
        );
      case LiftType.FrontSquat:
        return new Lift(
          withBrand({
            version: "3",
            ...{
              weight: weight.asFirestore(),
              type: liftType,
              reps,
              warmup,
              date
            }
          })
        );
      case LiftType.Deadlift:
        return new Lift(
          withBrand({
            version: "3",
            ...{
              weight: weight.asFirestore(),
              type: liftType,
              reps,
              warmup,
              date
            }
          })
        );
      case LiftType.OverheadPress:
        return new Lift(
          withBrand({
            version: "3",
            ...{
              weight: weight.asFirestore(),
              type: liftType,
              reps,
              warmup,
              date
            }
          })
        );
      case LiftType.Squat:
        return new Lift(
          withBrand({
            version: "3",
            ...{
              weight: weight.asFirestore(),
              type: liftType,
              reps,
              warmup,
              date
            }
          })
        );
    }
  };

  public static fromDb = (lift: LiftDoc) => {
    return new Lift(lift);
  };

  public firestoreField: LiftDoc;

  constructor(firestoreDoc: LiftDoc) {
    this.firestoreField = firestoreDoc;
  }

  public getWeight(): Weight {
    return Weight.fromFirestoreData(this.firestoreField.weight);
  }

  public getDate(): FirestoreTimestamp {
    return this.firestoreField.date;
  }

  public getType(): LiftType {
    return this.firestoreField.type;
  }

  public getReps(): number {
    return this.firestoreField.reps;
  }

  public getWarmup(): boolean {
    return this.firestoreField.warmup || false;
  }

  public clone(): Lift {
    return new Lift({ ...this.firestoreField });
  }
  public equals(other: Lift): boolean {
    return this.asJSON() === other.asJSON();
  }

  public getVersion(): string {
    return this.firestoreField.version;
  }

  public asJSON(): string {
    return JSON.stringify(this.firestoreField);
  }

  public asFirestore(): LiftDoc {
    return this.firestoreField;
  }

  public withUid(uid: string): DisplayLift {
    return new DisplayLift({ ...this.firestoreField, uid });
  }

  public prettyName(): string {
    const doc = this.firestoreField;
    switch (doc.type) {
      case LiftType.Snatch:
        return prettyNameSnatch(doc);
      default:
        return "Not implemented complain at matt.";
    }
  }
}

const prettyNameSnatch = (snatch: SnatchDoc): string => {
  if (
    snatch.startPosition === SnatchPosition.Floor &&
    snatch.style === SnatchStyle.Full
  ) {
    return "Full";
  }
  let firstPart;
  switch (snatch.startPosition) {
    case SnatchPosition.HighHang:
      firstPart = "HH";
      break;
    case SnatchPosition.AboveTheKnee:
      firstPart = "AK";

      break;
    case SnatchPosition.BelowTheKnee:
      firstPart = "BK";
      break;
    case SnatchPosition.Floor:
      firstPart = "F";
      break;
  }

  let secondPart;
  switch (snatch.style) {
    case SnatchStyle.Muscle:
      secondPart = "M";
      break;
    case SnatchStyle.Power:
      secondPart = "P";
      break;
    case SnatchStyle.Full:
      secondPart = "F";
  }
  return `${firstPart}-${secondPart}`;
};
