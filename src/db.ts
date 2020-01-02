import firebase from "firebase/app";
import moment from "moment";
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
        currentData[liftType] !== undefined &&
        currentData[liftType]![t.ONE_REP_MAX] !== undefined &&
        currentData[liftType]![t.ONE_REP_MAX]! > weight
      ) {
        // do nothing, old record is larger than this lift.
        // TODO - this would be wayyy better with the nullish operator once its live in cra.
      } else {
        return userDoc.update(userData);
      }
    }
  } else {
    return userDoc.set(userData);
  }
};

export const getUserDoc = async (
  firestore: t.Firestore,
  userUid: string
): Promise<t.UserDoc | undefined> => {
  const doc = await firestore
    .collection("users")
    .doc(userUid)
    .get();
  if (doc.exists) {
    return doc.data() as t.UserDoc;
  }
  return undefined;
};

export const getOneRepMax = async (
  firestore: t.Firestore,
  userUid: string,
  liftType: t.LiftType
): Promise<number | undefined> => {
  const userData = await getUserDoc(firestore, userUid);
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
): Promise<t.Lift | undefined> => {
  const doc = await firestore
    .collection("users")
    .doc(userUid)
    .collection("lifts")
    .doc(liftUid)
    .get();
  if (!doc.exists) {
    return undefined;
  }
  const data = doc.data();
  if (data === undefined) {
    return undefined;
  }
  data.date = data.date.toDate();
  return data as t.Lift;
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

export const getDaysWithLiftsBetween = async (
  firestore: t.Firestore,
  userUid: string,
  startDate: Date,
  endDate: Date
): Promise<Set<string>> => {
  const lifts = await getLifts(firestore, userUid)
    .where("date", ">=", startDate)
    .where("date", "<=", endDate)
    .get();
  return lifts.docs.reduce((acc, doc) => {
    const m = moment(doc.data().date.toDate());
    acc.add(m.format("YYYY-MM-DD"));
    return acc;
  }, new Set() as Set<string>);
};

export const getLiftsBetween = async (
  firestore: t.Firestore,
  userUid: string,
  dayBefore: Date,
  dayAfter: Date
): Promise<t.DisplayLift[]> => {
  const lifts = await getLifts(firestore, userUid)
    .where("date", ">", dayBefore)
    .where("date", "<", dayAfter)
    .get();
  const displayLifts = lifts.docs.map(doc => {
    const data = doc.data();
    data.date = data.date.toDate();
    data.uid = doc.id;
    return data as t.DisplayLift;
  });
  return displayLifts;
};

export const onSnapshotGroupedBy = <T>(
  query: firebase.firestore.Query,
  groupBy: (t: firebase.firestore.QueryDocumentSnapshot) => string,
  docTransform: (t: firebase.firestore.QueryDocumentSnapshot) => T,
  onSnapshot: (grouping: t.Grouping<T>) => void
): (() => void) => {
  return query.onSnapshot(snapshot => {
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

export const latestLiftOnSnapshot = (
  userUid: string,
  firestore: t.Firestore,
  liftType: t.LiftType,
  onSnapshot: (lift: t.Lift) => void
): (() => void) => {
  const liftsDoc = firestore
    .collection("users")
    .doc(userUid)
    .collection("lifts")
    .where("type", "==", liftType)
    .limitToLast(1)
    .orderBy("date");

  return liftsDoc.onSnapshot(snapshot => {
    const docs = snapshot.docs;
    if (docs.length === 0) {
      return;
    }
    const lift = docs[0].data();
    lift.date = lift.date.toDate();
    onSnapshot(lift as t.Lift);
  });
};
