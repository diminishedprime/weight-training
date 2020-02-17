import { BarbellLiftType, LiftDoc } from "./db";
import {
  CleanAndJerkPosition,
  CleanAndJerkStyle,
  SnatchPosition,
  SnatchStyle,
  toLift
} from "./db/LiftDoc";
import { DisplayLift } from "./index";
import {
  AsFirestore,
  Equals,
  FirestoreTimestamp,
  LiftType,
  Weight
} from "./index";

export class Lift implements AsFirestore, Equals<Lift> {
  public static fromFirestoreData = toLift;

  public static cleanAndJerk = (
    date: FirestoreTimestamp,
    weight: Weight,
    reps: number,
    warmup: boolean,
    style: CleanAndJerkStyle,
    startPosition: CleanAndJerkPosition
  ): Lift => {
    return new Lift({
      type: LiftType.CleanAndJerk,
      startPosition,
      style,
      date,
      weight,
      reps,
      warmup,
      version: "3"
    });
  };

  public static snatch = (
    date: FirestoreTimestamp,
    weight: Weight,
    reps: number,
    warmup: boolean,
    style: SnatchStyle,
    startPosition: SnatchPosition
  ): Lift => {
    return new Lift({
      type: LiftType.Snatch,
      startPosition,
      style,
      date,
      weight,
      reps,
      warmup,
      version: "3"
    });
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
        return new Lift({
          version: "3",
          ...{
            weight,
            type: liftType,
            reps,
            warmup,
            date
          }
        });
      case LiftType.FrontSquat:
        return new Lift({
          version: "3",
          ...{
            weight,
            type: liftType,
            reps,
            warmup,
            date
          }
        });
      case LiftType.Deadlift:
        return new Lift({
          version: "3",
          ...{
            weight,
            type: liftType,
            reps,
            warmup,
            date
          }
        });
      case LiftType.OverheadPress:
        return new Lift({
          version: "3",
          ...{
            weight,
            type: liftType,
            reps,
            warmup,
            date
          }
        });
      case LiftType.Squat:
        return new Lift({
          version: "3",
          ...{
            weight,
            type: liftType,
            reps,
            warmup,
            date
          }
        });
    }
  };

  public static fromDb = (lift: LiftDoc) => {
    return new Lift(lift);
  };

  private firestoreDoc: LiftDoc;

  constructor(firestoreDoc: LiftDoc) {
    this.firestoreDoc = firestoreDoc;
  }

  public getWeight(): Weight {
    return Weight.fromFirestoreData(this.firestoreDoc.weight);
  }

  public getDate(): FirestoreTimestamp {
    return this.firestoreDoc.date;
  }

  public getType(): LiftType {
    return this.firestoreDoc.type;
  }

  public getReps(): number {
    return this.firestoreDoc.reps;
  }

  public getWarmup(): boolean {
    return this.firestoreDoc.warmup || false;
  }

  public clone(): Lift {
    return new Lift({ ...this.firestoreDoc });
  }
  public equals(other: Lift): boolean {
    return this.asJSON() === other.asJSON();
  }

  public getVersion(): string {
    return this.firestoreDoc.version;
  }

  public asJSON(): string {
    return JSON.stringify(this.firestoreDoc);
  }

  public asFirestore(): object {
    const nu = JSON.parse(this.asJSON());
    // This is necessary because firestore does special handling of timestamps.
    nu.date = this.firestoreDoc.date;
    return nu;
  }

  public withUid(uid: string): DisplayLift {
    return new DisplayLift({ ...this.firestoreDoc, uid });
  }
}
