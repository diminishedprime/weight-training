import { Exercise, exerciseUIString } from '@/types';
import { fromDBExercise, nameForExercise } from '@/util';

describe('switch-based helpers', () => {
  test('exerciseUIString has values for every enum entry.', () => {
    Object.values(Exercise).forEach((exercise) => {
      const actual = exerciseUIString(exercise);
      expect(actual).toBeDefined();
    });
  });

  test('nameForExercise has values for every enum entry.', () => {
    Object.values(Exercise).forEach((exercise) => {
      const actual = nameForExercise(exercise);
      expect(actual).toBeDefined();
    });
  });

  test('fromDBExercise has values for every entry.', () => {
    Object.values(Exercise).forEach((exercise) => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const actual = fromDBExercise(nameForExercise(exercise)!);
      expect(actual).toBeDefined();
    });
  });

  test('fromDBExercise & nameForExercise are symettric', () => {
    Object.values(Exercise).forEach((exercise) => {
      const dbName = nameForExercise(exercise);
      expect(dbName).toBeDefined();
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const actualE = fromDBExercise(dbName!);
      expect(actualE).toStrictEqual(exercise);
    });
  });
});
