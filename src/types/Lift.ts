import { LiftDoc, LiftDocType } from "./db";
import { toLift } from "./db/LiftDoc";
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

  public static fromDb = (lift: LiftDoc) => {
    return new Lift(
      lift.date,
      Weight.fromFirestoreData(lift.weight),
      lift.type,
      lift.reps,
      lift.warmup || false
    );
  };

  private firestoreDoc: LiftDoc;

  constructor(
    date: FirestoreTimestamp,
    weight: Weight,
    type: LiftType,
    reps: number,
    warmup: boolean
  ) {
    this.firestoreDoc = {
      liftDocVersion: "1",
      liftDocType: LiftDocType.BARBELL,
      date,
      weight,
      type,
      reps,
      warmup,
      version: "1"
    };
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
    return new Lift(
      this.firestoreDoc.date,
      this.getWeight(),
      this.firestoreDoc.type,
      this.firestoreDoc.reps,
      this.firestoreDoc.warmup || false
    );
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
    return new DisplayLift(
      this.firestoreDoc.date,
      this.getWeight(),
      this.firestoreDoc.type,
      this.firestoreDoc.reps,
      this.firestoreDoc.warmup || false,
      uid
    );
  }
}
