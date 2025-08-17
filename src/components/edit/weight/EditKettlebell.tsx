"use client";
import DisplayKettlebell from "@/components/display/DisplayKettlebell";
import { EquipmentWeightEditorProps } from "@/components/edit/weight/EquipmentWeightEditor";
import useEditableWeight from "@/components/edit/weight/useEditableWeight";
import { TestIds } from "@/test-ids";
import { Button, Stack } from "@mui/material";
import { scaleLinear } from "d3-scale";
import { useCallback, useMemo } from "react";

interface EditKettlebellProps extends EquipmentWeightEditorProps {
  availableKettlebells: number[];
}

const EditKettlebell: React.FC<EditKettlebellProps> = (props) => {
  const api = useEditKettlebellAPI(props);
  return (
    <Stack alignItems="center">
      <Stack
        justifyContent="flex-end"
        sx={(theme) => ({ height: theme.spacing(api.maxSize) })}
      >
        <DisplayKettlebell
          size={api.size}
          weightValue={api.actual}
          weightUnit={props.weightUnit}
        />
      </Stack>
      {props.editing && (
        <Stack direction="row" alignItems="center">
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
      )}
    </Stack>
  );
};

export default EditKettlebell;

const useEditKettlebellAPI = (props: EditKettlebellProps) => {
  const {
    serverActual,
    serverTarget,
    onActualChange,
    onTargetChange,
    availableKettlebells,
  } = props;

  const sortedKettlebells = useMemo(() => {
    return [...availableKettlebells].sort((a, b) => a - b);
  }, [availableKettlebells]);

  const targetToActual = useCallback(
    (target: number) =>
      sortedKettlebells.findLast((a) => a <= target) ?? sortedKettlebells[0],
    [sortedKettlebells],
  );

  const { actual, setActual } = useEditableWeight(
    serverTarget,
    serverActual,
    targetToActual,
    onActualChange,
    onTargetChange,
  );

  const currentKettlebellIdx = useMemo(() => {
    const idx = sortedKettlebells.findIndex(
      (kettlebell) => kettlebell === actual,
    );
    return idx === -1 ? 0 : idx;
  }, [actual, sortedKettlebells]);

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
    () => heavierKettlebell === actual,
    [heavierKettlebell, actual],
  );

  const decrementDisabled = useMemo(
    () => lighterKettlebell === actual,
    [lighterKettlebell, actual],
  );

  const onDecrement = useCallback(() => {
    setActual(lighterKettlebell);
  }, [lighterKettlebell, setActual]);

  const onIncrement = useCallback(() => {
    setActual(heavierKettlebell);
  }, [heavierKettlebell, setActual]);

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

  const size = useMemo(() => sizeScale(actual), [actual, sizeScale]);

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
    actual,
  };
};
