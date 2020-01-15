import firebase from "firebase/app";
import moment from "moment";
import * as actions from "./actions";
import store from "./store";
import * as t from "./types";

const updateCacheDateKeys = (
  cacheKey: t.LocalStorageKey,
  newMoment: moment.Moment
) => {
  const fromStorage = window.localStorage.getItem(t.cacheDateKey) || "{}";
  const parsed = JSON.parse(fromStorage);
  const newValue = { ...parsed, [cacheKey]: newMoment.unix() };
  window.localStorage.setItem(t.cacheDateKey, JSON.stringify(newValue));
};

type CacheMoments = { [t in t.LocalStorageKey]?: moment.Moment };
const getCacheDateKeys = (): CacheMoments => {
  const fromStorage = window.localStorage.getItem(t.cacheDateKey) || "{}";
  const parsed = JSON.parse(fromStorage) as {
    [t in t.LocalStorageKey]: number;
  };
  const initialValue: CacheMoments = {};
  const keys: t.LocalStorageKey[] = Object.keys(parsed) as t.LocalStorageKey[];
  const cacheMoments = keys.reduce(
    (acc: CacheMoments, key: t.LocalStorageKey) => {
      const asMoment = moment.unix(parsed[key]);
      acc[key] = asMoment;
      return acc;
    },
    initialValue
  );
  return cacheMoments;
};

const requestWithCache = async <T extends t.AsJson>(
  request: () => Promise<T>,
  cacheKey: t.LocalStorageKey,
  invalidateCache: (t: T, lastUpdate: moment.Moment) => boolean,
  fromJSON: (asString: string) => T
): Promise<T> => {
  const fromCache = window.localStorage.getItem(cacheKey);
  if (fromCache === null) {
    const newValue = await request();
    const jsoned = newValue.asJSON();
    updateCacheDateKeys(cacheKey, moment.utc());
    window.localStorage.setItem(cacheKey, jsoned);
    return newValue;
  } else {
    const cachedValue: T = fromJSON(fromCache);
    const cacheMoments = getCacheDateKeys();
    const useCache = invalidateCache(cachedValue, cacheMoments[cacheKey]!);
    if (useCache) {
      return cachedValue;
    } else {
      const newValue = await request();
      const jsoned = newValue.asJSON();
      updateCacheDateKeys(cacheKey, moment.utc());
      window.localStorage.setItem(cacheKey, jsoned);
      return newValue;
    }
  }
};

export const setOneRepMax = async (
  firestore: t.Firestore,
  userUid: string,
  liftType: t.LiftType,
  weight: t.Weight,
  options: { checkPrevious: boolean } = { checkPrevious: false }
) => {
  const currentUserDoc = await getUserDocH(firestore, userUid);
  const userDoc = getUserDocReference(firestore, userUid);
  if (
    !options.checkPrevious ||
    currentUserDoc.getORM(liftType).lessThan(weight)
  ) {
    currentUserDoc.setORM(liftType, weight);
    return userDoc.update(currentUserDoc.asObject());
  }
};

const oneMinuteSince = (_: any, then: moment.Moment) => {
  const now = moment.utc();
  const diff = moment.duration(now.diff(then));
  return diff.asMinutes() < 1;
};

export const getUserDocCached = async (
  firestore: t.Firestore,
  userUid: string
): Promise<t.UserDoc> => {
  return requestWithCache(
    () => getUserDocH(firestore, userUid),
    t.LocalStorageKey.USER_DOC,
    oneMinuteSince,
    t.UserDoc.fromJSON
  );
};

export const getUserDocReference = (
  firestore: t.Firestore,
  userUid: string
) => {
  const docReference = firestore.collection("users").doc(userUid);
  return docReference;
};
export const getUserDocH = async (
  firestore: t.Firestore,
  userUid: string
): Promise<t.UserDoc> => {
  const docReference = getUserDocReference(firestore, userUid);
  const doc = await docReference.get();
  if (doc.exists) {
    const data = doc.data();
    if (data === undefined) {
      throw new Error(`This shouldn't be able to happen`);
    }
    return t.UserDoc.fromFirestoreData(data);
  } else {
    const nu = t.UserDoc.empty();
    await docReference.set(nu.asObject());
    return nu;
  }
};

export const getOneRepMax = async (
  firestore: t.Firestore,
  userUid: string,
  liftType: t.LiftType
): Promise<t.Weight> => {
  const userData = await getUserDocH(firestore, userUid);
  return userData.getORM(liftType);
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
  return t.Lift.fromFirestoreData(data);
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
  const copy = { ...lift };
  (copy as any).weight = copy.weight.asObject();
  const docReference = firestore
    .collection("users")
    .doc(uid)
    .collection("lifts")
    .add(copy);
  const newLift = await docReference.then(async (doc) => {
    await setOneRepMax(firestore, uid, lift.type, lift.weight, {
      checkPrevious: true
    });
    const d = await doc.get();
    const data = d.data();
    if (data === undefined) {
      throw new Error("Doc was not added successfully");
    }
    return t.Lift.fromFirestoreData(data).withUid(doc.id);
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
  const copy = { ...liftUpdate };
  if (copy.weight !== undefined) {
    (copy as any).weight = copy.weight.asObject();
  }
  const updatedLift = await firestore
    .collection("users")
    .doc(userUid)
    .collection("lifts")
    .doc(liftUid)
    .update(copy);
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
  const displayLifts = liftsCollection.docs.map((doc) => {
    const data = doc.data();
    return t.Lift.fromFirestoreData(data).withUid(doc.id);
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
): Promise<DaysWithLifts> => {
  return requestWithCache(
    () => getDaysWithLiftsH(firestore, user),
    t.LocalStorageKey.DAYS_WITH_LIFTS,
    oneMinuteSince,
    DaysWithLifts.fromJSON
  );
};

class DaysWithLifts implements t.AsJson {
  public static fromJSON = (s: string): DaysWithLifts => {
    const o: any = JSON.parse(s);
    if (o.version === "1" || o.version === undefined) {
      const parsed = o as string[];
      return new DaysWithLifts(parsed.map((s) => moment.utc(s)));
    }
    if (o.version === "2") {
      const parsed: { data: moment.Moment[]; version: string } = o as any;
      return new DaysWithLifts(parsed.data.map((s) => moment.utc(s)));
    }
    throw new Error("Cannot parse data");
  };
  public data: moment.Moment[];
  public version = "2";
  constructor(days: moment.Moment[]) {
    this.data = days;
  }
  public getVersion(): string {
    return this.version;
  }
  public asJSON() {
    return JSON.stringify(this);
  }
}

const getDaysWithLiftsH = async (
  firestore: t.Firestore,
  user: t.User
): Promise<DaysWithLifts> => {
  const daysWithLifts = await firestore
    .collection("users")
    .doc(user.uid)
    .collection("liftTimes")
    .get();
  return new DaysWithLifts(
    daysWithLifts.docs.map((doc) => moment(doc.data().t.toDate(), "YYYY-MM-DD"))
  );
};
