import firebase from "firebase/app";
import * as t from "./types";
import store from "./store";
import * as actions from "./actions";

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
  return data as t.Lift;
};

export const deleteLift = async (
  firestore: t.Firestore,
  userUid: string,
  liftUid: string
): Promise<void> => {
  const deletedLift = await firestore
    .collection("users")
    .doc(userUid)
    .collection("lifts")
    .doc(liftUid)
    .delete();
  store.dispatch(actions.nextForceUpdateLift());
  return deletedLift;
};

export const addLift = async (
  firestore: t.Firestore,
  uid: string,
  lift: t.Lift
): Promise<t.DisplayLift> => {
  const docReference = firestore
    .collection("users")
    .doc(uid)
    .collection("lifts")
    .add(lift);
  const newLift = await docReference.then(async doc => {
    await setOneRepMax(firestore, uid, lift.type, lift.weight, {
      checkPrevious: true
    });
    const d = await doc.get();
    const data = d.data();
    if (data === undefined) {
      throw new Error("Doc was not added successfully");
    }
    data.uid = doc.id;
    return data as t.DisplayLift;
  });
  store.dispatch(actions.nextForceUpdateLift());
  return newLift;
};

export const updateLift = async (
  firestore: t.Firestore,
  userUid: string,
  liftUid: string,
  liftUpdate: t.Optional<t.Lift>
): Promise<void> => {
  const updatedLift = await firestore
    .collection("users")
    .doc(userUid)
    .collection("lifts")
    .doc(liftUid)
    .update(liftUpdate);
  store.dispatch(actions.nextForceUpdateLift());
  return updatedLift;
};

const getLiftsCollection = (
  firestore: t.Firestore,
  userUid: string
): firebase.firestore.CollectionReference => {
  return firestore
    .collection("users")
    .doc(userUid)
    .collection("lifts");
};

type ModifyQuery = (
  query: firebase.firestore.Query
) => firebase.firestore.Query;

// This is a bit of a hack, but hopefully it'll help me to not shoot myself in
// the foot as much.
interface LiftsQuerySnapshot extends firebase.firestore.QuerySnapshot {
  marker: "liftsQuerySnapshot";
}

const toDisplayLifts = (
  liftsCollection: LiftsQuerySnapshot
): t.DisplayLift[] => {
  const displayLifts = liftsCollection.docs.map(doc => {
    const data = doc.data() as t.Lift;
    const displayLift: t.DisplayLift = { ...data, uid: doc.id };
    return displayLift;
  });
  return displayLifts;
};

export const lifts = async (
  firestore: t.Firestore,
  user: t.User,
  modifyQuery: ModifyQuery
): Promise<t.DisplayLift[]> => {
  const liftsCollection = await modifyQuery(
    getLiftsCollection(firestore, user.uid)
  ).get();
  return toDisplayLifts(liftsCollection as LiftsQuerySnapshot);
};

export const getDaysWithLifts = async (
  firestore: t.Firestore,
  user: t.User
): Promise<Array<moment.Moment>> => {
  const daysWithLifts = await firestore
    .collection("users")
    .doc(user.uid)
    .collection("daysWithLifts")
    .get();
  return daysWithLifts.docs.map(doc => moment.utc(doc.id, "YYYY-MM-DD"));
};
