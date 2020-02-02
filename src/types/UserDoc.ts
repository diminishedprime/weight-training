import firebase from "firebase/app";
import { fromFirestore, fromJSON } from "../types/db/UserDoc";
import { LiftType, ONE_REP_MAX } from "./common";
import { UserDoc as DBUserDoc } from "./db";
import {
  AsFirestore,
  AsJson,
  Equals,
  FirestoreTimestamp,
  OneRepMax,
  Versioned,
  Weight
} from "./index";

// TODO - change this to be an indexed type of a new enum for the types of lifts
// that can have records (1s, 3s, 5s, 10s).
interface LiftMeta {
  [ONE_REP_MAX]: OneRepMax;
}

interface PR {
  orm: OneRepMax;
  liftType: LiftType;
}

export class UserDoc
  implements DBUserDoc, AsFirestore, AsJson, Versioned, Equals<UserDoc> {
  public static fromFirestoreData = fromFirestore;
  public static fromJSON = fromJSON;

  public static empty = (): UserDoc => {
    const defaultTime = firebase.firestore.Timestamp.fromMillis(0);
    return new UserDoc({
      [LiftType.BENCH_PRESS]: {
        [ONE_REP_MAX]: {
          weight: Weight.zero(),
          time: defaultTime
        }
      },
      [LiftType.DEADLIFT]: {
        [ONE_REP_MAX]: {
          weight: Weight.zero(),
          time: defaultTime
        }
      },
      [LiftType.FRONT_SQUAT]: {
        [ONE_REP_MAX]: {
          weight: Weight.zero(),
          time: defaultTime
        }
      },
      [LiftType.OVERHEAD_PRESS]: {
        [ONE_REP_MAX]: {
          weight: Weight.zero(),
          time: defaultTime
        }
      },
      [LiftType.SQUAT]: {
        [ONE_REP_MAX]: {
          weight: Weight.zero(),
          time: defaultTime
        }
      }
    });
  };
  public [LiftType.BENCH_PRESS]: LiftMeta;
  public [LiftType.DEADLIFT]: LiftMeta;
  public [LiftType.FRONT_SQUAT]: LiftMeta;
  public [LiftType.OVERHEAD_PRESS]: LiftMeta;
  public [LiftType.SQUAT]: LiftMeta;
  public version = "2";

  constructor(dbUserDoc: DBUserDoc) {
    Object.values(dbUserDoc).forEach((value) => {
      const orm = value[ONE_REP_MAX];
      if (orm !== undefined) {
        const oneRepMax: OneRepMax = {
          weight: Weight.fromFirestoreData(orm.weight),
          time: new firebase.firestore.Timestamp(
            orm.time.seconds,
            orm.time.nanoseconds
          )
        };
        value[ONE_REP_MAX] = oneRepMax;
      }
    });

    const userDoc = dbUserDoc as UserDoc;

    this[LiftType.BENCH_PRESS] = userDoc[LiftType.BENCH_PRESS];
    this[LiftType.DEADLIFT] = userDoc[LiftType.DEADLIFT];
    this[LiftType.FRONT_SQUAT] = userDoc[LiftType.FRONT_SQUAT];
    this[LiftType.OVERHEAD_PRESS] = userDoc[LiftType.OVERHEAD_PRESS];
    this[LiftType.SQUAT] = userDoc[LiftType.SQUAT];
  }
  public getVersion() {
    return this.version;
  }

  public setORM(liftType: LiftType, weight: Weight, time: FirestoreTimestamp) {
    this[liftType][ONE_REP_MAX] = { weight, time };
  }

  public getORM(liftType: LiftType): OneRepMax {
    return this[liftType][ONE_REP_MAX];
  }

  public asFirestore(): object {
    return JSON.parse(JSON.stringify(this));
  }

  public asJSON(): string {
    return JSON.stringify(this.asFirestore());
  }
  public getRecords(): PR[] {
    return Object.values(LiftType)
      .map((liftType) => {
        return { liftType, orm: this.getORM(liftType) };
      })
      .filter((pr) => !pr.orm.weight.equals(Weight.zero()));
  }
  public getEmptyRecords(): PR[] {
    return Object.values(LiftType)
      .map((liftType) => {
        return { liftType, orm: this.getORM(liftType) };
      })
      .filter((pr) => pr.orm.weight.equals(Weight.zero()));
  }

  public equals(other: UserDoc): boolean {
    return this.asJSON() === other.asJSON();
  }
}
