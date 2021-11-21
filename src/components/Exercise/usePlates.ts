import { useCallback, useMemo, useState } from 'react';
import { OneOfEachPlate } from '@/constants';
import usePersistentArray, { ArrayKey } from '@/hooks/usePersistentArray';
import { PlateWeight } from '@/types';

const usePlates = (qualifier: string) => {
  const [consolidate] = useState(true);
  const [plates, setPlates] = usePersistentArray<PlateWeight>(
    ArrayKey.Plates,
    [],
    qualifier,
  );

  const clearPlates = useCallback(() => {
    setPlates([]);
  }, []);

  const plateCounts: [PlateWeight, number][] = useMemo(
    () =>
      OneOfEachPlate.reduce((acc, plate) => {
        const count = plates.filter(
          (p) =>
            p.value === plate.value &&
            p.unit === plate.unit &&
            p.version === plate.version,
        ).length;
        return acc.concat([[plate, count]]);
      }, []),
    [plates],
  );

  const addPlate = useCallback((plate: PlateWeight) => {
    setPlates((old) => {
      const withNewPlate = old.concat([plate]);
      if (consolidate) {
        let remainingWeight = withNewPlate.reduce((acc, p) => acc + p.value, 0);
        // Note it's important that OneOfEachPlate is sorted largest to
        // smallest for this to work properly.
        return OneOfEachPlate.reduce((acc, plate) => {
          const additionalPlates = [];
          while (remainingWeight >= plate.value) {
            remainingWeight -= plate.value;
            additionalPlates.push(plate);
          }
          return acc.concat(additionalPlates);
        }, []);
      }
      return withNewPlate;
    });
  }, []);

  const add45 = useCallback(() => {
    addPlate({ value: 45, unit: 'lb', version: 1 });
  }, [addPlate]);

  const add25 = useCallback(() => {
    addPlate({ value: 25, unit: 'lb', version: 1 });
  }, [addPlate]);

  const add10 = useCallback(() => {
    addPlate({ value: 10, unit: 'lb', version: 1 });
  }, [addPlate]);

  const add5 = useCallback(() => {
    addPlate({ value: 5, unit: 'lb', version: 1 });
  }, [addPlate]);

  const add2_5 = useCallback(() => {
    addPlate({ value: 2.5, unit: 'lb', version: 1 });
  }, [addPlate]);

  return {
    plates,
    add45,
    add25,
    add10,
    add5,
    add2_5,
    clearPlates,
    consolidate,
    plateCounts,
  };
};

export default usePlates;
