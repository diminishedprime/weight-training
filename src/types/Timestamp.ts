import firebase from "firebase/app";
import moment from "moment";
import { AsFirestore, FirestoreTimestamp } from "./index";

import { TimeStampField } from "./db";

export class Timestamp implements AsFirestore, TimeStampField {
  seconds: number;
  nanoseconds: number;

  constructor({ seconds, nanoseconds }: TimeStampField) {
    this.seconds = seconds;
    this.nanoseconds = nanoseconds;
  }

  static from = (
    ts: { seconds: number; nanoseconds: number } | FirestoreTimestamp
  ): Timestamp => {
    return new Timestamp(ts);
  };

  toMoment(): moment.Moment {
    return moment(this.toDate());
  }

  toDate(): Date {
    return this.toFirebaseTimestamp().toDate();
  }

  toFirebaseTimestamp(): FirestoreTimestamp {
    return new firebase.firestore.Timestamp(this.seconds, this.nanoseconds);
  }

  asFirestore(): object {
    return this.toFirebaseTimestamp();
  }
}
