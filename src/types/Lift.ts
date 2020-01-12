import { Lift as DBLift } from "./db";
import { DisplayLift } from "./index";
import { LiftType, Timestamp, ToFirestore, Weight } from "./index";

export class Lift implements DBLift, ToFirestore {
  public static s = (): Lift => {
    return new Lift({
      date: Timestamp.now(),
      weight: Weight.zero(),
      type: LiftType.BENCH_PRESS,
      reps: 0,
      warmup: false
    });
  };

  public static fromFirestoreData = (o: object): Lift => {
    const lift: DBLift = o as DBLift;
    return new Lift(lift);
  };
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

  public asObject(): object {
    return JSON.parse(JSON.stringify(this));
  }

  public withUid(uid: string): DisplayLift {
    return new DisplayLift(this, uid);
  }
}
