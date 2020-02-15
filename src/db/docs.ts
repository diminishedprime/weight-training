import { Firestore, FirebaseUser } from "../types";

export const userDoc = (firestore: Firestore, user: FirebaseUser) => {
  return firestore.collection("users").doc(user.uid);
};

export const liftsCollection = (firestore: Firestore, user: FirebaseUser) => {
  return firestore
    .collection("users")
    .doc(user.uid)
    .collection("lifts");
};

export const liftDoc = (
  firestore: Firestore,
  user: FirebaseUser,
  liftUid: string
) => {
  return firestore
    .collection("users")
    .doc(user.uid)
    .collection("lifts")
    .doc(liftUid);
};

export const liftTimesCollection = (
  firestore: Firestore,
  user: FirebaseUser
) => {
  return firestore
    .collection("users")
    .doc(user.uid)
    .collection("liftTimes");
};

export const programsCollection = (
  firestore: Firestore,
  user: FirebaseUser
) => {
  return firestore
    .collection("users")
    .doc(user.uid)
    .collection("programs");
};
