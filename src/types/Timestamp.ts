import moment from "moment";
import * as util from "../util";
import { FirestoreTimestamp } from "./index";
import { HasFirestoreField, withBrand } from "./db/marker";
import { TimeStampField } from "./db";

export class Timestamp implements HasFirestoreField<TimeStampField> {
  public static from = (
    ts: { seconds: number; nanoseconds: number } | FirestoreTimestamp
  ): Timestamp => {
    return new Timestamp(withBrand(ts));
  };

  public firestoreField: TimeStampField;
  private version = "1";

  constructor(timestampField: TimeStampField) {
    this.firestoreField = timestampField;
  }

  public toMoment(): moment.Moment {
    return moment(this.toDate());
  }

  public toDate(): Date {
    return this.toFirebaseTimestamp().toDate();
  }

  public toFirebaseTimestamp(): FirestoreTimestamp {
    return util.timestamp(
      this.firestoreField.seconds,
      this.firestoreField.nanoseconds
    );
  }

  public asFirestore(): TimeStampField {
    return this.firestoreField;
  }

  public getVersion(): string {
    return this.version;
  }

  public asJSON(): string {
    return JSON.stringify(this.firestoreField);
  }
}
