import { initializeApp } from 'firebase/app';

import { User } from 'firebase/auth';
import {
  collection,
  getDocs,
  getFirestore,
  orderBy,
  query,
  where,
} from 'firebase/firestore';
import { Exercise, ExerciseData } from './types';
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
