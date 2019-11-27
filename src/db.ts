import * as firebase from "firebase/app";
import * as t from "./types";

export const getLift = async (
  firestore: firebase.firestore.Firestore,
  userUid: string,
  liftUid: string
): Promise<firebase.firestore.DocumentSnapshot> => {
  return firestore
    .collection("users")
    .doc(userUid)
    .collection("lifts")
    .doc(liftUid)
    .get();
};

export const deleteLift = (
  firestore: firebase.firestore.Firestore,
  userUid: string,
  liftUid: string
): Promise<void> => {
  return firestore
    .collection("users")
    .doc(userUid)
    .collection("lifts")
    .doc(liftUid)
    .delete();
};

export const addLift = async (
  firestore: firebase.firestore.Firestore,
  uid: string,
  lift: t.Lift
): Promise<firebase.firestore.DocumentReference> => {
  return firestore
    .collection("users")
    .doc(uid)
    .collection("lifts")
    .add(lift);
};
