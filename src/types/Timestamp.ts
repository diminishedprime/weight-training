import firebase from "firebase/app";
import moment from "moment";
import { AsFirestore, FirestoreTimestamp } from "./index";

import { TimeStampField } from "./db";

export class Timestamp implements AsFirestore, TimeStampField {

  public static from = (
    ts: { seconds: number; nanoseconds: number } | FirestoreTimestamp
  ): Timestamp => {
    return new Timestamp(ts);
  };
  public seconds: number;
  public nanoseconds: number;

  constructor({ seconds, nanoseconds }: TimeStampField) {
    this.seconds = seconds;
    this.nanoseconds = nanoseconds;
  }

  public toMoment(): moment.Moment {
    return moment(this.toDate());
  }

  public toDate(): Date {
    return this.toFirebaseTimestamp().toDate();
  }

  public toFirebaseTimestamp(): FirestoreTimestamp {
    return new firebase.firestore.Timestamp(this.seconds, this.nanoseconds);
  }

  public asFirestore(): object {
    return this.toFirebaseTimestamp();
  }
}
