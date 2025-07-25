"use client";
import { RoundingMode, WeightUnit } from "@/common-types";
import DisplayKettlebell from "@/components/display/DisplayKettlebell";
import { TestIds } from "@/test-ids";
import { Button, Stack, useTheme } from "@mui/material";
import { scaleLinear } from "d3-scale";
import { useCallback, useMemo } from "react";

interface EditKettlebellProps {
  weightValue: number;
  setWeightValue: React.Dispatch<React.SetStateAction<number>>;
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
        <DisplayKettlebell {...props} size={api.size} />
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
  const { weightValue, setWeightValue, availableKettlebells } = props;

  const sortedKettlebells = useMemo(() => {
    return [...availableKettlebells].sort((a, b) => a - b);
  }, [availableKettlebells]);

  const currentKettlebellIdx = useMemo(() => {
    const idx = sortedKettlebells.findIndex(
      (kettlebell) => kettlebell === weightValue,
    );
    return idx === -1 ? 0 : idx;
  }, [weightValue, sortedKettlebells]);

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
    () => heavierKettlebell === weightValue,
    [heavierKettlebell, weightValue],
  );

  const decrementDisabled = useMemo(
    () => lighterKettlebell === weightValue,
    [lighterKettlebell, weightValue],
  );

  const onDecrement = useCallback(() => {
    setWeightValue(lighterKettlebell);
  }, [lighterKettlebell, setWeightValue]);

  const onIncrement = useCallback(() => {
    setWeightValue(heavierKettlebell);
  }, [heavierKettlebell, setWeightValue]);

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

  const size = useMemo(() => sizeScale(weightValue), [weightValue, sizeScale]);

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
  };
};
