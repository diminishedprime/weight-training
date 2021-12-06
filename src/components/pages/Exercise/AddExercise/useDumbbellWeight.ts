import { useCallback } from 'react';
import { Weight_V1 } from '@/types';

const Weights: Weight_V1[] = [
  { value: 5, unit: 'lb', version: 1 },
  { value: 8, unit: 'lb', version: 1 },
  { value: 10, unit: 'lb', version: 1 },
  { value: 12, unit: 'lb', version: 1 },
  { value: 15, unit: 'lb', version: 1 },
  { value: 20, unit: 'lb', version: 1 },
  { value: 25, unit: 'lb', version: 1 },
  { value: 30, unit: 'lb', version: 1 },
  { value: 35, unit: 'lb', version: 1 },
  { value: 40, unit: 'lb', version: 1 },
  { value: 45, unit: 'lb', version: 1 },
  { value: 50, unit: 'lb', version: 1 },
  { value: 55, unit: 'lb', version: 1 },
  { value: 60, unit: 'lb', version: 1 },
  { value: 65, unit: 'lb', version: 1 },
  { value: 70, unit: 'lb', version: 1 },
  { value: 75, unit: 'lb', version: 1 },
  { value: 80, unit: 'lb', version: 1 },
  { value: 85, unit: 'lb', version: 1 },
  { value: 90, unit: 'lb', version: 1 },
  { value: 95, unit: 'lb', version: 1 },
  { value: 100, unit: 'lb', version: 1 },
];

const useDumbbellWeight = (
  weight: Weight_V1,
  setWeight: React.Dispatch<React.SetStateAction<Weight_V1>>,
) => {
  const bumpUp = useCallback(() => {
    setWeight((old) => {
      for (let i = 0; i < Weights.length; i++) {
        const current = Weights[i];
        if (current.value > old.value) {
          return current;
        }
      }
      return Weights[Weights.length - 1];
    });
  }, [setWeight]);
  const bumpDown = useCallback(() => {
    setWeight((old) => {
      for (let i = Weights.length - 1; i >= 0; i--) {
        const current = Weights[i];
        if (current.value < old.value) {
          return current;
        }
      }
      return Weights[0];
    });
  }, [setWeight]);

  return { bumpUp, bumpDown, weight, setWeight };
};

export type DumbbellAPI = ReturnType<typeof useDumbbellWeight>;

export default useDumbbellWeight;
