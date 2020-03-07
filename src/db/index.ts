import moment from "moment";
import * as actions from "../actions";
import store from "../store";
import * as t from "../types";
import * as docs from "./docs";

// TODO - remove store.dispatch from the db entirely and have it be managed through redux or something.

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
  user: t.FirebaseUser,
  liftType: t.LiftType,
  weight: t.Weight,
  time: t.FirestoreTimestamp,
  options: { checkPrevious: boolean } = { checkPrevious: false }
) => {
  const currentUserDoc = await getUserDocH(firestore, user);
  const userDoc = docs.userDoc(firestore, user);
  if (
    !options.checkPrevious ||
    currentUserDoc.getORM(liftType).weight.lessThan(weight)
  ) {
    currentUserDoc.setORM(liftType, weight, time);
    return userDoc.update(currentUserDoc.asFirestore());
  }
};

// const alwaysBust = (_1: any, _2: moment.Moment) => {
//   return false;
// };

const oneMinuteSince = (_: any, then: moment.Moment) => {
  const now = moment.utc();
  const diff = moment.duration(now.diff(then));
  return diff.asMinutes() < 1;
};

const oneDaySince = (_: any, then: moment.Moment) => {
  const now = moment.utc();
  const diff = moment.duration(now.diff(then));
  return diff.asDays() < 1;
};

export const getUserDocCached = async (
  firestore: t.Firestore,
  user: t.FirebaseUser
): Promise<t.UserDoc> => {
  return requestWithCache(
    () => getUserDocH(firestore, user),
    t.LocalStorageKey.USER_DOC,
    oneMinuteSince,
    t.UserDoc.fromJSON
  );
};

export const setUserDoc = async (
  firestore: t.Firestore,
  user: t.FirebaseUser,
  userDoc: t.UserDoc
): Promise<void> => {
  const docReference = docs.userDoc(firestore, user);
  return docReference.set(userDoc.asFirestore());
};

export const getUserDocH = async (
  firestore: t.Firestore,
  user: t.FirebaseUser
): Promise<t.UserDoc> => {
  const docReference = docs.userDoc(firestore, user);
  const doc = await docReference.get();
  if (doc.exists) {
    const data = doc.data();
    if (data === undefined) {
      throw new Error(`This shouldn't be able to happen`);
    }
    return t.UserDoc.fromFirestoreData(data);
  } else {
    const nu = t.UserDoc.empty();
    await docReference.set(nu.asFirestore());
    return nu;
  }
};

export const getOneRepMax = async (
  firestore: t.Firestore,
  user: t.FirebaseUser,
  liftType: t.LiftType
): Promise<t.OneRepMax> => {
  const userData = await getUserDocH(firestore, user);
  return userData.getORM(liftType);
};

export const getLift = async (
  firestore: t.Firestore,
  user: t.FirebaseUser,
  liftUid: string
): Promise<t.Lift | undefined> => {
  const doc = await docs.liftDoc(firestore, user, liftUid).get();
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
  user: t.FirebaseUser,
  liftUid: string
): Promise<void> => {
  const deletedLift = await docs.liftDoc(firestore, user, liftUid).delete();
  store.dispatch(actions.nextForceUpdateLift());
  return deletedLift;
};

export const addLift = async (
  firestore: t.Firestore,
  user: t.FirebaseUser,
  lift: t.Lift
): Promise<t.DisplayLift> => {
  const docReference = docs
    .liftsCollection(firestore, user)
    .add(lift.asFirestore());
  const newLift = await docReference.then(async (doc) => {
    await setOneRepMax(
      firestore,
      user,
      lift.getType(),
      lift.getWeight(),
      lift.getDate(),
      {
        checkPrevious: true
      }
    );
    const d = await doc.get();
    const data = d.data();
    if (data === undefined) {
      throw new Error("Doc was not added successfully");
    }
    return t.Lift.fromFirestoreData(data).withUid(doc.id);
  });
  store.dispatch(actions.nextForceUpdateLift());
  addLocalLift(firestore, newLift);
  return newLift;
};

export const updateLift = async (
  firestore: t.Firestore,
  user: t.FirebaseUser,
  liftUid: string,
  // TODO - this might need some special handling.
  // TODO - part duex - it does. This has caused problems.
  liftUpdate: t.Optional<t.LiftDoc>
): Promise<void> => {
  const copy = { ...liftUpdate };
  // This is a bit of a hack, but better than nothing.
  if (copy.weight !== undefined) {
    copy.weight = (copy.weight as t.Weight).asFirestore();
  }
  const updatedLift = await docs.liftDoc(firestore, user, liftUid).update(copy);
  store.dispatch(actions.nextForceUpdateLift());
  return updatedLift;
};

type ModifyQuery = (query: t.Query) => t.Query;

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
  user: t.FirebaseUser,
  modifyQuery: ModifyQuery
): Promise<t.DisplayLift[]> => {
  const liftsCollection = await modifyQuery(
    docs.liftsCollection(firestore, user)
  ).get();
  return toDisplayLifts(liftsCollection as LiftsQuerySnapshot);
};

export const getDaysWithLifts = async (
  firestore: t.Firestore,
  user: t.FirebaseUser
): Promise<DaysWithLifts> => {
  const cached = await requestWithCache(
    () => {
      const result = getDaysWithLiftsH(firestore, user);
      // Clear out local storage when we actually query firebase.
      window.localStorage.removeItem(t.LocalStorageKey.DAYS_WITH_LIFTS_LOCAL);
      return result;
    },
    t.LocalStorageKey.DAYS_WITH_LIFTS,
    oneDaySince,
    DaysWithLifts.fromJSON
  );
  const localLifts = DaysWithLifts.fromJSON(
    window.localStorage.getItem(t.LocalStorageKey.DAYS_WITH_LIFTS_LOCAL) || "[]"
  );
  cached.data = cached.data.concat(localLifts.data);
  return cached;
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

const addLocalLift = async (firestore: t.Firestore, lift: t.Lift) => {
  const currentLocal = DaysWithLifts.fromJSON(
    window.localStorage.getItem(t.LocalStorageKey.DAYS_WITH_LIFTS_LOCAL) || "[]"
  );
  currentLocal.data.push(moment.utc(lift.getDate().toDate()));
  const newLocal = currentLocal.asJSON();
  window.localStorage.setItem(
    t.LocalStorageKey.DAYS_WITH_LIFTS_LOCAL,
    newLocal
  );
};

const getDaysWithLiftsH = async (
  firestore: t.Firestore,
  user: t.FirebaseUser
): Promise<DaysWithLifts> => {
  const daysWithLifts = await docs.liftTimesCollection(firestore, user).get();
  return new DaysWithLifts(
    daysWithLifts.docs.map((doc) =>
      t.Timestamp.from(doc.data().t as t.FirestoreTimestamp).toMoment()
    )
  );
};

export const getRecentPrograms = async (
  firestore: t.Firestore,
  user: t.FirebaseUser
): Promise<t.ProgramDoc[]> => {
  const programsCollection = await docs
    .programsCollection(firestore, user)
    .orderBy("time", "desc")
    .limit(5)
    .get();
  return programsCollection.docs.map((doc) => doc.data() as t.ProgramDoc);
};

export const addProgram = async (
  firestore: t.Firestore,
  user: t.FirebaseUser,
  program: t.ProgramDoc
): Promise<t.ProgramDoc> => {
  const added = await docs.programsCollection(firestore, user).add(program);
  const thing = await added.get();
  return thing.data() as t.ProgramDoc;
};

const addSnatch = async (
  firestore: t.Firestore,
  user: t.FirebaseUser,
  date: t.FirestoreTimestamp,
  weight: t.Weight,
  reps: number,
  warmup: boolean,
  style: t.SnatchStyle,
  startPosition: t.SnatchPosition
): Promise<t.DisplayLift> => {
  const lift = t.Lift.snatch(date, weight, reps, warmup, style, startPosition);
  const docReference = docs
    .liftsCollection(firestore, user)
    .add(lift.asFirestore());
  const newLift = await docReference.then(async (doc) => {
    // TODO - figure out how 1RMs should work for snatches, etc.
    // await setOneRepMax(...);
    const d = await doc.get();
    const data = d.data();
    if (data === undefined) {
      throw new Error("Doc was not added successfully");
    }
    return t.Lift.fromFirestoreData(data).withUid(doc.id);
  });
  store.dispatch(actions.nextForceUpdateLift());
  addLocalLift(firestore, newLift);
  return newLift;
};

export const initializedWith = (firestore: t.Firestore): t.WeightTrainingDb => {
  return {
    addSnatch: (
      user: t.FirebaseUser,
      date: t.FirestoreTimestamp,
      weight: t.Weight,
      reps: number,
      warmup: boolean,
      style: t.SnatchStyle,
      startPosition: t.SnatchPosition
    ) =>
      addSnatch(
        firestore,
        user,
        date,
        weight,
        reps,
        warmup,
        style,
        startPosition
      )
  };
};
