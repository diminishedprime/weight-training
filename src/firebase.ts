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
  BarExerciseData,
  Exercise,
  ExerciseData,
  Update,
  WithID,
} from './types';
import { nameForExercise } from './util';

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
    console.error('An error occured trying to add the exercise');
    console.error(e);
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
