import { initializeApp } from 'firebase/app';

import { User } from 'firebase/auth';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentData,
  DocumentReference,
  getDoc,
  getDocs,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import {
  BarExercise,
  BarExerciseData,
  DBUserDoc,
  DumbbellExerciseData,
  Exercise,
  ExerciseData,
  MachineExerciseData,
  OneRepMax,
  Update,
  UserDoc_V4,
  WithID,
} from '@/types';
import { nameForExercise } from '@/util';
import { migrateUserDoc } from '@/firebase/migrate';

initializeApp({
  apiKey: 'AIzaSyBBu2D-owaz14CfZvmOqjSoN0oMde5D5NE',
  authDomain: 'weight-training-8a1ac.firebaseapp.com',
  databaseURL: 'https://weight-training-8a1ac.firebaseio.com',
  projectId: 'weight-training-8a1ac',
  storageBucket: 'weight-training-8a1ac.appspot.com',
  messagingSenderId: '21223491336',
  appId: '1:21223491336:web:7378ae65a038e84eda8ebd',
  measurementId: 'G-4F9TH5XYE6',
});

const liftsRef = (user: User) =>
  collection(getFirestore(), 'users', user.uid, 'lifts');

const userRef = (user: User) => doc(getFirestore(), 'users', user.uid);

const liftRef = (user: User, id: string) =>
  doc(getFirestore(), 'users', user.uid, 'lifts', id);

const exerciseWhere = (exercise: Exercise) =>
  where('type', '==', nameForExercise(exercise));

export const getLiftsByType = async (
  user: User,
  exercise: Exercise,
): Promise<ExerciseData[]> => {
  const q = query(
    liftsRef(user),
    exerciseWhere(exercise),
    orderBy('date', 'desc'),
  );
  const snapshot = await getDocs(query(q));
  return snapshot.docs.map((d) => d.data() as ExerciseData);
};

export const subscribeToLiftsByType = (
  user: User,
  exercise: Exercise,
  observer: (e: WithID<ExerciseData>[]) => void,
) => {
  const q = query(
    liftsRef(user),
    exerciseWhere(exercise),
    orderBy('date', 'desc'),
  );
  const unSub = onSnapshot(q, (snapshot) => {
    observer(
      snapshot.docs.map(
        (d) => ({ ...d.data(), id: d.id } as WithID<ExerciseData>),
      ),
    );
  });

  return unSub;
};

export const addExercise = async (
  user: User,
  exerciseData: ExerciseData,
): Promise<DocumentReference<DocumentData>> => {
  try {
    return await addDoc(liftsRef(user), exerciseData);
  } catch (e) {
    throw new Error(`An error occured trying to add the exercise: ${{ e }}`);
  }
};

export const getLift = async (
  user: User,
  id: string,
): Promise<WithID<ExerciseData>> => {
  const snapshot = await getDoc(liftRef(user, id));
  return { ...snapshot.data(), id: snapshot.id } as WithID<ExerciseData>;
};

export const deleteExercise = async (user: User, id: string): Promise<void> => {
  await deleteDoc(liftRef(user, id));
};

export const updateBarExercise = async (
  user: User,
  id: string,
  update: Update<BarExerciseData>,
): Promise<WithID<BarExerciseData>> => {
  await updateDoc(liftRef(user, id), update);
  return (await getLift(user, id)) as WithID<BarExerciseData>;
};

export const updateDumbbellExercise = async (
  user: User,
  id: string,
  update: Update<DumbbellExerciseData>,
): Promise<WithID<DumbbellExerciseData>> => {
  await updateDoc(liftRef(user, id), update);
  return (await getLift(user, id)) as WithID<DumbbellExerciseData>;
};

export const updateMachineExercise = async (
  user: User,
  id: string,
  update: Update<MachineExerciseData>,
): Promise<WithID<MachineExerciseData>> => {
  await updateDoc(liftRef(user, id), update);
  return (await getLift(user, id)) as WithID<MachineExerciseData>;
};

export const updateUserDoc = async (
  user: User,
  update: Update<UserDoc_V4>,
): Promise<void> => {
  await updateDoc(userRef(user), update);
};

export const subscribeToUserDoc = (
  user: User,
  observer: (userDoc: UserDoc_V4) => void,
): (() => void) => {
  const unSub = onSnapshot(userRef(user), (snapshot) => {
    const dbUserDoc = snapshot.data() as DBUserDoc;
    const { userDoc, updated } = migrateUserDoc(dbUserDoc);
    if (updated) {
      updateUserDoc(user, userDoc).then(() => {
        observer(userDoc);
      });
    } else {
      observer(userDoc);
    }
  });

  return unSub;
};

export const getUserDoc = async (user: User): Promise<UserDoc_V4> => {
  const snapshot = await getDoc(userRef(user));
  const dbUserDoc = snapshot.data() as DBUserDoc;
  const { userDoc, updated } = migrateUserDoc(dbUserDoc);
  if (updated) {
    await updateUserDoc(user, userDoc);
  }
  return userDoc;
};

export const getOneRepMax = async (
  user: User,
  barExercise: BarExercise,
): Promise<OneRepMax | undefined> => {
  const userData = await getUserDoc(user);
  const exercise = nameForExercise(barExercise);
  if (exercise === undefined) {
    return undefined;
  }
  const userExercise = userData[exercise];
  return userExercise?.['one-rep-max'];
};
