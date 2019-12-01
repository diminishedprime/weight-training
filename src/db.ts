import * as firebase from "firebase/app";
import * as t from "./types";

export const setOneRepMax = async (
  firestore: t.Firestore,
  userUid: string,
  liftType: t.LiftType,
  weight: number,
  options: { checkPrevious: boolean } = { checkPrevious: false }
) => {
  const userDoc = firestore.collection("users").doc(userUid);
  const userDocData = await userDoc.get();
  const userData: t.UserDoc = { [liftType]: { [t.ONE_REP_MAX]: weight } };
  if (userDocData.exists) {
    if (!options.checkPrevious) {
      return userDoc.update(userData);
    } else {
      const currentData = userDocData.data() as t.UserDoc;
      if (
        currentData &&
        currentData[liftType] &&
        currentData[liftType]![t.ONE_REP_MAX] &&
        currentData[liftType]![t.ONE_REP_MAX]! < weight
      ) {
        return userDoc.update(userData);
      }
    }
  } else {
    return userDoc.set(userData);
  }
};

export const getOneRepMax = async (
  firestore: t.Firestore,
  userUid: string,
  liftType: t.LiftType
): Promise<number | undefined> => {
  const userDoc = await firestore
    .collection("users")
    .doc(userUid)
    .get();
  const userData = userDoc.data() as t.UserDoc;
  if (userData === undefined) {
    return undefined;
  }
  const liftData = userData[liftType];
  if (liftData === undefined) {
    return undefined;
  }
  return liftData[t.ONE_REP_MAX];
};

export const getLift = async (
  firestore: t.Firestore,
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
  firestore: t.Firestore,
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
  firestore: t.Firestore,
  uid: string,
  lift: t.Lift
): Promise<firebase.firestore.DocumentReference> => {
  const docReference = firestore
    .collection("users")
    .doc(uid)
    .collection("lifts")
    .add(lift);
  return docReference.then(async doc => {
    await setOneRepMax(firestore, uid, lift.type, lift.weight, {
      checkPrevious: true
    });
    return doc;
  });
};

export const updateLift = async (
  firestore: t.Firestore,
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
  firestore: t.Firestore,
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
