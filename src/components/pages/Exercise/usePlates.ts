import { useCallback, useMemo, useState } from 'react';
import { OneOfEachPlate } from '@/constants';
import { PlateCount, PlateWeight } from '@/types';
import { platesForWeight } from '@/util';

const usePlates = (
  plates: PlateWeight[],
  setPlates: React.Dispatch<React.SetStateAction<PlateWeight[]>>,
) => {
  const [consolidate] = useState(true);

  const clearPlates = useCallback(() => {
    setPlates([]);
  }, [setPlates]);

  const plateCounts: PlateCount[] = useMemo(
    () =>
      OneOfEachPlate.reduce((acc, plate) => {
        const count = plates.filter(
          (p) =>
            p.value === plate.value &&
            p.unit === plate.unit &&
            p.version === plate.version,
        ).length;
        return acc.concat([[plate, count]]);
      }, [] as PlateCount[]),
    [plates],
  );

  const addPlate = useCallback(
    (plate: PlateWeight) => {
      setPlates((old) => {
        const withNewPlate = old.concat([plate]);
        if (consolidate) {
          return platesForWeight(
            withNewPlate.reduce((acc, p) => acc + p.value, 0),
          );
        }
        return withNewPlate;
      });
    },
    [consolidate, setPlates],
  );

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
