import { ZERO_TIME } from "../constants";
import { toUserDoc, userDocfromJSON } from "../types/db/UserDoc";
import { LocalStorageKey, ONE_REP_MAX } from "./common";
import { LiftType, UserDoc as DBUserDoc } from "./db";
import { HasFirestoreField, withBrand } from "./db/marker";
import { Equals, FirestoreTimestamp, OneRepMax, Weight } from "./index";
import { Timestamp } from "./Timestamp";

interface PR {
  orm: OneRepMax;
  liftType: LiftType;
}

// TODO - records aren't really great. They should be stored in a collection
// instead of ad-hoc inside of the UserDoc type.
export class UserDoc implements HasFirestoreField<DBUserDoc>, Equals<UserDoc> {
  public static fromFirestoreData = toUserDoc;
  public static fromJSON = userDocfromJSON;

  // TODO - This should add some logic that triggers a db request if the value is too out of date.
  public static fromLocalStorage = (): UserDoc | undefined => {
    const fromLocalStorage = window.localStorage.getItem(
      LocalStorageKey.USER_DOC
    );
    if (fromLocalStorage !== null) {
      return UserDoc.fromJSON(fromLocalStorage);
    }
    return undefined;
  };

  public static empty = (): UserDoc => {
    const defaultTime = withBrand(ZERO_TIME());
    return new UserDoc(
      withBrand({
        version: "3",
        [LiftType.Snatch]: {
          [ONE_REP_MAX]: {
            weight: Weight.zero().asFirestore(),
            time: defaultTime
          }
        },
        [LiftType.CleanAndJerk]: {
          [ONE_REP_MAX]: {
            weight: Weight.zero().asFirestore(),
            time: defaultTime
          }
        },
        [LiftType.BenchPress]: {
          [ONE_REP_MAX]: {
            weight: Weight.zero().asFirestore(),
            time: defaultTime
          }
        },
        [LiftType.Deadlift]: {
          [ONE_REP_MAX]: {
            weight: Weight.zero().asFirestore(),
            time: defaultTime
          }
        },
        [LiftType.FrontSquat]: {
          [ONE_REP_MAX]: {
            weight: Weight.zero().asFirestore(),
            time: defaultTime
          }
        },
        [LiftType.OverheadPress]: {
          [ONE_REP_MAX]: {
            weight: Weight.zero().asFirestore(),
            time: defaultTime
          }
        },
        [LiftType.Squat]: {
          [ONE_REP_MAX]: {
            weight: Weight.zero().asFirestore(),
            time: defaultTime
          }
        }
      })
    );
  };

  public firestoreField: DBUserDoc;
  public version: "3" = "3";

  constructor(dbUserDoc: DBUserDoc) {
    this.firestoreField = dbUserDoc;
  }

  // TODO - there should probably be an interface for this functionality.
  public async saveToLocalStorage(): Promise<void> {
    const asString = this.asJSON();
    window.localStorage.setItem(LocalStorageKey.USER_DOC, asString);
  }
  public getVersion() {
    return this.version;
  }

  public setORM(liftType: LiftType, weight: Weight, time: FirestoreTimestamp) {
    this.firestoreField[liftType][ONE_REP_MAX] = {
      weight: weight.asFirestore(),
      time: withBrand(time)
    };
  }

  public getORM(liftType: LiftType): OneRepMax {
    const fieldORM = this.firestoreField[liftType][ONE_REP_MAX];
    return {
      weight: Weight.fromFirestoreData(fieldORM.weight),
      time: Timestamp.from(fieldORM.time).toFirebaseTimestamp()
    };
  }

  public asFirestore(): DBUserDoc {
    return this.firestoreField;
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
