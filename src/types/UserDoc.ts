import firebase from "firebase/app";
import * as fromFirestore from "../fromFirestore";
import { LiftType, ONE_REP_MAX } from "./common";
import { UserDoc as DBUserDoc } from "./db";
import {
  AsFirestore,
  AsJson,
  OneRepMax,
  Timestamp,
  Versioned,
  Weight
} from "./index";

interface LiftMeta {
  [ONE_REP_MAX]: OneRepMax;
}

interface PR {
  orm: OneRepMax;
  liftType: LiftType;
}

export class UserDoc implements DBUserDoc, AsFirestore, AsJson, Versioned {
  public static fromFirestoreData = fromFirestore.userDocFromFirestore;
  public static fromJSON = fromFirestore.userDocFromJSON;

  public static empty = (): UserDoc => {
    return new UserDoc({
      [LiftType.BENCH_PRESS]: {
        [ONE_REP_MAX]: {
          weight: Weight.zero(),
          time: firebase.firestore.Timestamp.now()
        }
      },
      [LiftType.CLEAN_AND_JERK]: {
        [ONE_REP_MAX]: {
          weight: Weight.zero(),
          time: firebase.firestore.Timestamp.now()
        }
      },
      [LiftType.DEADLIFT]: {
        [ONE_REP_MAX]: {
          weight: Weight.zero(),
          time: firebase.firestore.Timestamp.now()
        }
      },
      [LiftType.FRONT_SQUAT]: {
        [ONE_REP_MAX]: {
          weight: Weight.zero(),
          time: firebase.firestore.Timestamp.now()
        }
      },
      [LiftType.OVERHEAD_PRESS]: {
        [ONE_REP_MAX]: {
          weight: Weight.zero(),
          time: firebase.firestore.Timestamp.now()
        }
      },
      [LiftType.SNATCH]: {
        [ONE_REP_MAX]: {
          weight: Weight.zero(),
          time: firebase.firestore.Timestamp.now()
        }
      },
      [LiftType.SQUAT]: {
        [ONE_REP_MAX]: {
          weight: Weight.zero(),
          time: firebase.firestore.Timestamp.now()
        }
      }
    });
  };
  public [LiftType.BENCH_PRESS]: LiftMeta;
  public [LiftType.CLEAN_AND_JERK]: LiftMeta;
  public [LiftType.DEADLIFT]: LiftMeta;
  public [LiftType.FRONT_SQUAT]: LiftMeta;
  public [LiftType.OVERHEAD_PRESS]: LiftMeta;
  public [LiftType.SNATCH]: LiftMeta;
  public [LiftType.SQUAT]: LiftMeta;
  public version = "2";

  constructor(dbUserDoc: DBUserDoc) {
    Object.values(dbUserDoc).forEach((value) => {
      const orm = value[ONE_REP_MAX];
      if (orm !== undefined) {
        value[ONE_REP_MAX] = {
          weight: Weight.fromFirestoreData(orm.weight),
          time: orm.time
        };
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

  public setORM(liftType: LiftType, weight: Weight, time: Timestamp) {
    this[liftType][ONE_REP_MAX] = { weight, time };
  }

  public getORM(liftType: LiftType): OneRepMax {
    return this[liftType][ONE_REP_MAX];
  }

  public asObject(): object {
    return JSON.parse(JSON.stringify(this));
  }

  public asJSON(): string {
    return JSON.stringify(this.asObject());
  }
  public getRecords(): PR[] {
    return Object.values(LiftType)
      .map((liftType) => {
        return { liftType, orm: this.getORM(liftType) };
      })
      .filter((pr) => !pr.orm.weight.equal(Weight.zero()));
  }
  public getEmptyRecords(): PR[] {
    return Object.values(LiftType)
      .map((liftType) => {
        return { liftType, orm: this.getORM(liftType) };
      })
      .filter((pr) => pr.orm.weight.equal(Weight.zero()));
  }
}
