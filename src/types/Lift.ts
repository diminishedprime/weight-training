import * as fromFirestore from "../fromFirestore";
import { LiftDoc } from "./db";
import { AsJson, DisplayLift } from "./index";
import {
  AsFirestore,
  Equals,
  FirestoreTimestamp,
  LiftType,
  Weight
} from "./index";

export class Lift implements AsFirestore, AsJson, Equals<Lift> {
  public static VERSION: "1" = "1";
  public static fromFirestoreData = fromFirestore.liftFromFirestore;

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

  public version = Lift.VERSION;
  public date: FirestoreTimestamp;
  public weight: Weight;
  public type: LiftType;
  public reps: number;
  public warmup: boolean | undefined;

  constructor(
    date: FirestoreTimestamp,
    weight: Weight,
    type: LiftType,
    reps: number,
    warmup: boolean
  ) {
    this.date = date;
    this.weight = weight;
    this.type = type;
    this.reps = reps;
    this.warmup = warmup;
    this.firestoreDoc = {
      date,
      weight,
      type,
      reps,
      warmup,
      version: "1"
    };
  }

  public clone(): Lift {
    return new Lift(
      this.date,
      this.weight.clone(),
      this.type,
      this.reps,
      this.warmup || false
    );
  }
  public equals(other: Lift): boolean {
    return this.asJSON() === other.asJSON();
  }

  public getVersion(): string {
    return this.version;
  }

  public asJSON(): string {
    return JSON.stringify(this);
  }

  public asFirestore(): object {
    const nu = JSON.parse(this.asJSON());
    // This is necessary because firestore does special handling of timestamps.
    nu.date = this.date;
    return nu;
  }

  public withUid(uid: string): DisplayLift {
    return new DisplayLift(
      this.date,
      this.weight,
      this.type,
      this.reps,
      this.warmup || false,
      uid
    );
  }
}
