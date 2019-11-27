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

export const updateLift = async (
  firestore: firebase.firestore.Firestore,
  userUid: string,
  liftUid: string,
  liftUpdate: t.Optional<t.Lift>
): Promise<void> => {
  return firestore
    .collection("users")
    .doc(userUid)
    .collection("lifts")
    .doc(liftUid)
    .update(liftUpdate);
};

export const getLifts = (
  firestore: firebase.firestore.Firestore,
  userUid: string
): firebase.firestore.CollectionReference => {
  return firestore
    .collection("users")
    .doc(userUid)
    .collection("lifts");
};

export const onSnapshotGroupedBy = async <T>(
  query: firebase.firestore.Query,
  groupBy: (t: firebase.firestore.QueryDocumentSnapshot) => string,
  docTransform: (t: firebase.firestore.QueryDocumentSnapshot) => T,
  onSnapshot: (grouping: t.Grouping<T>) => void
) => {
  query.onSnapshot(snapshot => {
    const grouped: t.Grouping<T> = snapshot.docs.reduce((acc, doc) => {
      const groupKey = groupBy(doc);
      if (!acc[groupKey]) {
        acc[groupKey] = [];
      }
      acc[groupKey].push(docTransform(doc));
      return acc;
    }, {} as t.Grouping<T>);
    onSnapshot(grouped);
  });
};
