import { LiftType, ONE_REP_MAX, WeightUnit } from "./common";
import { UserDoc as DBUserDoc } from "./db";
import { AsFirestore, AsJson, Versioned, Weight } from "./index";

interface MaybeORM {
  [ONE_REP_MAX]: Weight;
}

export class UserDoc implements DBUserDoc, AsFirestore, AsJson, Versioned {
  public static empty = (): UserDoc => {
    return new UserDoc({
      [LiftType.BENCH_PRESS]: {},
      [LiftType.CLEAN_AND_JERK]: {},
      [LiftType.DEADLIFT]: {},
      [LiftType.FRONT_SQUAT]: {},
      [LiftType.OVERHEAD_PRESS]: {},
      [LiftType.SNATCH]: {},
      [LiftType.SQUAT]: {}
    });
  };

  public static fromFirestoreData = (o: object): UserDoc => {
    switch ((o as any).version) {
      case "1":
      case undefined: {
        const userDoc: {
          [lift in LiftType]: {
            [ONE_REP_MAX]: { value: number; unit: WeightUnit };
          };
        } = o as any;
        return new UserDoc(userDoc);
      }
      default: {
        throw new Error(`Cannot parse version: ${(o as any).version}`);
      }
    }
  };
  public static fromJSON = (s: string): UserDoc => {
    return UserDoc.fromFirestoreData(JSON.parse(s));
  };
  public [LiftType.BENCH_PRESS]: MaybeORM;
  public [LiftType.CLEAN_AND_JERK]: MaybeORM;
  public [LiftType.DEADLIFT]: MaybeORM;
  public [LiftType.FRONT_SQUAT]: MaybeORM;
  public [LiftType.OVERHEAD_PRESS]: MaybeORM;
  public [LiftType.SNATCH]: MaybeORM;
  public [LiftType.SQUAT]: MaybeORM;
  public version = "1";

  constructor(dbUserDoc: DBUserDoc) {
    Object.values(dbUserDoc).forEach((value) => {
      const orm = value![ONE_REP_MAX];
      if (orm !== undefined) {
        value![ONE_REP_MAX] = Weight.fromFirestoreData(orm);
      }
    });

    const userDoc = dbUserDoc as UserDoc;

    this[LiftType.BENCH_PRESS] = userDoc[LiftType.BENCH_PRESS];
    this[LiftType.CLEAN_AND_JERK] = userDoc[LiftType.CLEAN_AND_JERK];
    this[LiftType.DEADLIFT] = userDoc[LiftType.DEADLIFT];
    this[LiftType.FRONT_SQUAT] = userDoc[LiftType.FRONT_SQUAT];
    this[LiftType.OVERHEAD_PRESS] = userDoc[LiftType.OVERHEAD_PRESS];
    this[LiftType.SNATCH] = userDoc[LiftType.SNATCH];
    this[LiftType.SQUAT] = userDoc[LiftType.SQUAT];
  }
  public getVersion() {
    return this.version;
  }

  public setORM(liftType: LiftType, weight: Weight) {
    this[liftType][ONE_REP_MAX] = weight;
  }

  public getORM(liftType: LiftType): Weight {
    return this[liftType][ONE_REP_MAX] || Weight.zero();
  }

  public asObject(): object {
    return JSON.parse(JSON.stringify(this));
  }

  public asJSON(): string {
    return JSON.stringify(this.asObject());
  }
}
