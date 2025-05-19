import { useCallback, useMemo } from 'react';
import {
  Exercise,
  ExerciseMetadata_V1,
  metadataForExercise,
  narrowMachineExercise,
  Weight_V1,
} from '@/types';

const generateStack = (
  minWeight: number,
  maxWeight: number,
  increments: number,
  bump?: Weight_V1,
): StackType => {
  const stack: Weight_V1[] = [];
  for (let i = minWeight; i <= maxWeight; i += increments) {
    stack.push({ value: i, unit: 'lb', version: 1 });
  }
  return { weights: stack, bump };
};

const default_stack = generateStack(10, 200, 10, {
  value: 5,
  unit: 'lb',
  version: 1,
});

const weightsForStackType = (
  stackType: ExerciseMetadata_V1['stackType'],
): StackType => {
  switch (stackType) {
    case '170_10_5':
      return generateStack(10, 170, 10, { value: 5, unit: 'lb', version: 1 });
    case '240_10_5':
      return generateStack(10, 240, 10, { value: 5, unit: 'lb', version: 1 });
    case '200_10_5':
      return generateStack(10, 200, 10, { value: 5, unit: 'lb', version: 1 });
    case '160_10_5':
      return generateStack(10, 160, 10, { value: 5, unit: 'lb', version: 1 });
    case '400_20_10':
      return generateStack(20, 400, 20, { value: 10, unit: 'lb', version: 1 });
    case '_Plates':
      return default_stack;
    // TODO: figure out if there's a clean way to special case this?
    // Probably this is just one of the things to handle better when I just
    // create a custom page for every single exercise type instead of trying
    // to do some in bulk.
    case 'Unknown':
      return default_stack;
    default:
      return default_stack;
  }
};

export type StackType = {
  bump: Weight_V1 | undefined;
  weights: Weight_V1[];
};

const useMachineWeight = (
  weight: Weight_V1,
  setWeight: React.Dispatch<React.SetStateAction<Weight_V1>>,
  exercise: Exercise | null | undefined,
) => {
  const stack: StackType = useMemo(() => {
    if (exercise === null || exercise === undefined) {
      return default_stack;
    }
    if (narrowMachineExercise(exercise)) {
      const metadata = metadataForExercise(exercise);
      const { stackType } = metadata;
      return weightsForStackType(stackType);
    }
    return default_stack;
  }, [exercise]);

  const bumpUp = useCallback(() => {
    setWeight((old) => {
      // Check if the bump weight should be applied
      if (stack.bump && old.value < stack.bump.value) {
        return stack.bump;
      }

      // Iterate through the stack weights to find the next valid weight
      for (let i = 0; i < stack.weights.length; i++) {
        const current = stack.weights[i];
        const bumpedValue = current.value + (stack.bump?.value || 0);

        if (current.value > old.value) {
          return current;
        }

        if (stack.bump && bumpedValue > old.value) {
          return {
            value: bumpedValue,
            unit: current.unit,
            version: current.version,
          };
        }
      }

      // If no higher weight is found, return the last weight in the stack
      return stack.weights[stack.weights.length - 1];
    });
  }, [setWeight, stack]);

  const bumpDown = useCallback(() => {
    setWeight((old) => {
      if (stack.bump) {
        // If there is a bump, decrement the current weight by the bump value
        // If the old weight was 40, the newValue will be 35
        const newValue = old.value - stack.bump.value;

        if (newValue < stack.weights[0].value - stack.bump.value) {
          return old;
        }

        // If a matching weight is found, return it; otherwise, fallback to the lowest weight
        return { ...old, value: newValue };
      }
      // If there is no bump, move to the previous weight in the array
      for (let i = stack.weights.length - 1; i >= 0; i--) {
        if (stack.weights[i].value < old.value) {
          return stack.weights[i];
        }
      }

      // If no lower weight is found, return the first weight in the stack
      return stack.weights[0];
    });
  }, [setWeight, stack]);

  return { bumpUp, bumpDown, weight, setWeight, stack };
};

export type MachineAPI = ReturnType<typeof useMachineWeight>;

export default useMachineWeight;
