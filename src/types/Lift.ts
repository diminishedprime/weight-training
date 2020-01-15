import firebase from "firebase/app";
import { Lift as DBLift } from "./db";
import { AsJson, DisplayLift } from "./index";
import { AsFirestore, LiftType, Timestamp, Weight } from "./index";

export class Lift implements DBLift, AsFirestore, AsJson {
  public static s = (): Lift => {
    return new Lift({
      date: firebase.firestore.Timestamp.now(),
      weight: Weight.zero(),
      type: LiftType.BENCH_PRESS,
      reps: 0,
      warmup: false
    });
  };

  public static fromFirestoreData = (o: object): Lift => {
    switch ((o as any).version) {
      case "1":
      case undefined: {
        const dbVal: {
          date: Timestamp;
          weight: Weight;
          type: LiftType;
          reps: number;
          warmup: boolean | undefined;
        } = o as any;
        return new Lift(dbVal);
      }
      default: {
        throw new Error(`Cannot parse version: ${(o as any).version}`);
      }
    }
  };
  public version = "1";
  public date: Timestamp;
  public weight: Weight;
  public type: LiftType;
  public reps: number;
  public warmup: boolean | undefined;

  constructor(lift: DBLift) {
    this.date = lift.date;
    this.weight = Weight.fromFirestoreData(lift.weight);
    this.type = lift.type;
    this.reps = lift.reps;
    this.warmup = lift.warmup;
  }

  public getVersion(): string {
    return this.version;
  }

  public asJSON(): string {
    return JSON.stringify(this);
  }

  public asObject(): object {
    return JSON.parse(this.asJSON());
  }

  public withUid(uid: string): DisplayLift {
    return new DisplayLift(this, uid);
  }
}
