import firebase from "firebase/app";

export const ONE_REP_MAX = "one-rep-max";
export type Firestore = firebase.firestore.Firestore;
export type Analytics = firebase.analytics.Analytics;
export type FirestoreTimestamp = firebase.firestore.Timestamp;
export type Firebase = typeof firebase;
export type Query = firebase.firestore.Query;
export enum PlateTypes {
  FORTY_FIVE = "forty-five",
  // THIRTY_FIVE = 'thirty-five',
  TWENTY_FIVE = "twenty-five",
  TEN = "ten",
  FIVE = "five",
  TWO_AND_A_HALF = "two-and-a-half"
}
