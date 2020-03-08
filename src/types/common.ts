import firebase from "firebase/app";
import { Weight } from "./Weight";

export const ONE_REP_MAX = "one-rep-max";
export type Firestore = firebase.firestore.Firestore;
export type Analytics = firebase.analytics.Analytics;
export type Auth = firebase.auth.Auth;
export type FirestoreTimestamp = firebase.firestore.Timestamp;
export type Firebase = typeof firebase;
export type Query = firebase.firestore.Query;

// TODO - refator old code to use Plate instead of custom code on PlateTypes.
export interface Plate {
  weight: Weight;
  cssClass: string;
}

export enum PlateTypes {
  FORTY_FIVE = "forty-five",
  // THIRTY_FIVE = 'thirty-five',
  TWENTY_FIVE = "twenty-five",
  TEN = "ten",
  FIVE = "five",
  TWO_AND_A_HALF = "two-and-a-half"
}

export enum LocalStorageKey {
  ActivePrograms = "@weight-training/active-programs",
  SETTINGS = "@weight-training/settings",
  DAYS_WITH_LIFTS = "@weight-training/days-with-lifts",
  DAYS_WITH_LIFTS_LOCAL = "@weight-training/days-with-lifts-local",
  X_BY_X = "@weight-training/x-by-x",
  FIREBASE_USER = "@weight-training/user",
  USER_DOC = "@weight-training/user-doc",
  LIFTS = "@weight-training/lifts"
}
