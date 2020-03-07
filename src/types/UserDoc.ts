import { ZERO_TIME } from "../constants";
import { toUserDoc, userDocfromJSON } from "../types/db/UserDoc";
import * as util from "../util";
import { ONE_REP_MAX } from "./common";
import { LiftType, UserDoc as DBUserDoc } from "./db";
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
  implements
    DBUserDoc,
    AsFirestore<DBUserDoc>,
    AsJson,
    Versioned,
    Equals<UserDoc> {
  public static fromFirestoreData = toUserDoc;
  public static fromJSON = userDocfromJSON;

  public static empty = (): UserDoc => {
    const defaultTime = ZERO_TIME();
    return new UserDoc({
      version: "3",
      [LiftType.Snatch]: {
        [ONE_REP_MAX]: {
          weight: Weight.zero(),
          time: defaultTime
        }
      },
      [LiftType.CleanAndJerk]: {
        [ONE_REP_MAX]: {
          weight: Weight.zero(),
          time: defaultTime
        }
      },
      [LiftType.BenchPress]: {
        [ONE_REP_MAX]: {
          weight: Weight.zero(),
          time: defaultTime
        }
      },
      [LiftType.Deadlift]: {
        [ONE_REP_MAX]: {
          weight: Weight.zero(),
          time: defaultTime
        }
      },
      [LiftType.FrontSquat]: {
        [ONE_REP_MAX]: {
          weight: Weight.zero(),
          time: defaultTime
        }
      },
      [LiftType.OverheadPress]: {
        [ONE_REP_MAX]: {
          weight: Weight.zero(),
          time: defaultTime
        }
      },
      [LiftType.Squat]: {
        [ONE_REP_MAX]: {
          weight: Weight.zero(),
          time: defaultTime
        }
      }
    });
  };
  public [LiftType.BenchPress]: LiftMeta;
  public [LiftType.Deadlift]: LiftMeta;
  public [LiftType.FrontSquat]: LiftMeta;
  public [LiftType.OverheadPress]: LiftMeta;
  public [LiftType.Squat]: LiftMeta;
  public [LiftType.CleanAndJerk]: LiftMeta;
  public [LiftType.Snatch]: LiftMeta;
  public version: "3" = "3";

  constructor(dbUserDoc: DBUserDoc) {
    Object.values(LiftType).forEach((liftType) => {
      const value = dbUserDoc[liftType];
      const orm = value[ONE_REP_MAX];
      if (orm !== undefined) {
        const oneRepMax: OneRepMax = {
          weight: Weight.fromFirestoreData(orm.weight),
          time: util.timestamp(orm.time.seconds, orm.time.nanoseconds)
        };
        value[ONE_REP_MAX] = oneRepMax;
      }
    });

    const userDoc = dbUserDoc as UserDoc;

    this[LiftType.BenchPress] = userDoc[LiftType.BenchPress];
    this[LiftType.Deadlift] = userDoc[LiftType.Deadlift];
    this[LiftType.FrontSquat] = userDoc[LiftType.FrontSquat];
    this[LiftType.OverheadPress] = userDoc[LiftType.OverheadPress];
    this[LiftType.Squat] = userDoc[LiftType.Squat];
    this[LiftType.Snatch] = userDoc[LiftType.Snatch];
    this[LiftType.CleanAndJerk] = userDoc[LiftType.CleanAndJerk];
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

  public asFirestore(): DBUserDoc {
    // TODO - this can be cleaned up if I switch to this implementing
    // 'HasField<T>' where T is DBUserDoc.
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
