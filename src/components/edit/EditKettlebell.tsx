"use client";
import { RDispatch, RoundingMode, WeightUnit } from "@/common-types";
import DisplayKettlebell from "@/components/display/DisplayKettlebell";
import { useResolvableWeight } from "@/hooks";
import { TestIds } from "@/test-ids";
import { Button, Stack, useTheme } from "@mui/material";
import { scaleLinear } from "d3-scale";
import { useCallback, useMemo } from "react";

interface EditKettlebellProps {
  actualWeight: number | undefined;
  setActualWeight: RDispatch<number | undefined>;
  targetWeight: number;
  weightUnit: WeightUnit;
  roundingMode: RoundingMode;
  availableKettlebells: number[];
  size: number | undefined;
}

const EditKettlebell: React.FC<EditKettlebellProps> = (props) => {
  const theme = useTheme();
  const api = useEditKettlebellAPI(props);
  return (
    <Stack spacing={1} alignItems="center">
      <Stack
        justifyContent="flex-end"
        sx={{ height: theme.spacing(api.maxSize) }}
      >
        <DisplayKettlebell
          size={api.size}
          weightValue={api.resolvedWeight}
          weightUnit={"pounds"}
        />
      </Stack>
      <Stack spacing={1} direction="row" alignItems="center">
        <Button
          color="secondary"
          variant="outlined"
          size="small"
          onClick={api.onDecrement}
          disabled={api.decrementDisabled}
        >
          -
        </Button>
        <Button
          data-testid={TestIds.KettlebellPlus}
          color="primary"
          variant="outlined"
          size="small"
          onClick={api.onIncrement}
          disabled={api.incrementDisabled}
        >
          +
        </Button>
      </Stack>
    </Stack>
  );
};

export default EditKettlebell;

const useEditKettlebellAPI = (props: EditKettlebellProps) => {
  const { actualWeight, setActualWeight, availableKettlebells, targetWeight } =
    props;

  const sortedKettlebells = useMemo(() => {
    return [...availableKettlebells].sort((a, b) => a - b);
  }, [availableKettlebells]);

  const targetToActual = useCallback(
    (target: number) =>
      sortedKettlebells.findLast((a) => a <= target) ?? sortedKettlebells[0],
    [sortedKettlebells],
  );

  const [resolvedWeight, setResolvedWeight] = useResolvableWeight(
    actualWeight,
    setActualWeight,
    targetWeight,
    targetToActual,
  );

  const currentKettlebellIdx = useMemo(() => {
    const idx = sortedKettlebells.findIndex(
      (kettlebell) => kettlebell === resolvedWeight,
    );
    return idx === -1 ? 0 : idx;
  }, [resolvedWeight, sortedKettlebells]);

  const heavierKettlebell = useMemo(() => {
    const length = sortedKettlebells.length;
    const nextIdx = Math.min(currentKettlebellIdx + 1, length - 1);
    return sortedKettlebells[nextIdx];
  }, [sortedKettlebells, currentKettlebellIdx]);

  const lighterKettlebell = useMemo(() => {
    const prevIdx = Math.max(currentKettlebellIdx - 1, 0);
    return sortedKettlebells[prevIdx];
  }, [sortedKettlebells, currentKettlebellIdx]);

  const incrementDisabled = useMemo(
    () => heavierKettlebell === resolvedWeight,
    [heavierKettlebell, resolvedWeight],
  );

  const decrementDisabled = useMemo(
    () => lighterKettlebell === resolvedWeight,
    [lighterKettlebell, resolvedWeight],
  );

  const onDecrement = useCallback(() => {
    setResolvedWeight(lighterKettlebell);
  }, [lighterKettlebell, setResolvedWeight]);

  const onIncrement = useCallback(() => {
    setResolvedWeight(heavierKettlebell);
  }, [heavierKettlebell, setResolvedWeight]);

  const sizeScale = useMemo(
    () =>
      scaleLinear()
        .domain([
          Math.min(...sortedKettlebells),
          Math.max(...sortedKettlebells),
        ])
        .range([8, 12]),
    [sortedKettlebells],
  );

  const size = useMemo(
    () => sizeScale(resolvedWeight),
    [resolvedWeight, sizeScale],
  );

  const maxSize = useMemo(
    () => sizeScale(sortedKettlebells.reduce((a, b) => Math.max(a, b))),
    [sizeScale, sortedKettlebells],
  );

  return {
    onIncrement,
    onDecrement,
    incrementDisabled,
    decrementDisabled,
    size,
    maxSize,
    resolvedWeight,
  };
};
