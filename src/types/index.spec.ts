import { Exercise } from '@/types';

test('Ensure Exercise values are unique', () => {
  const exercises = Object.values(Exercise);
  const arrayLength = exercises.length;

  const exercisesSet = new Set(exercises);
  const setLength = exercisesSet.size;

  expect(arrayLength).toStrictEqual(setLength);
});
