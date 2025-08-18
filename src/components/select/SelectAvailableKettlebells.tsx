import { RDispatch, WeightUnit } from "@/common-types";
import DisplayKettlebell from "@/components/display/DisplayKettlebell";
import { Stack } from "@mui/material";
import { scaleLinear } from "d3-scale";
import { useCallback, useMemo } from "react";

interface SelectAvailableKettlebellsProps {
  availableKettlebells: number[];
  selectedKettlebells: number[] | null;
  setSelectedKettlebells: RDispatch<number[] | null>;
  weightUnit: WeightUnit;
}

const SelectAvailableKettlebells: React.FC<SelectAvailableKettlebellsProps> = (
  props,
) => {
  const api = useSelectAvailableKettlebellsAPI(props);
  return (
    <Stack direction="row" flexWrap="wrap" alignItems="flex-end">
      {props.availableKettlebells.map((kettlebell) => (
        <DisplayKettlebell
          onClick={() => api.onClick(kettlebell)}
          selected={api.isSelected(kettlebell)}
          key={kettlebell}
          weightValue={kettlebell}
          weightUnit={props.weightUnit}
          size={api.sizeScale(kettlebell)}
        />
      ))}
    </Stack>
  );
};

export default SelectAvailableKettlebells;

const useSelectAvailableKettlebellsAPI = (
  props: SelectAvailableKettlebellsProps,
) => {
  const { selectedKettlebells, setSelectedKettlebells, availableKettlebells } =
    props;

  const isSelected = useCallback(
    (kettlebell: number) => (selectedKettlebells || []).includes(kettlebell),
    [selectedKettlebells],
  );

  const onClick = useCallback(
    (kettlebell: number) => {
      setSelectedKettlebells((o) => {
        const current = o || [];
        const nu = current.includes(kettlebell)
          ? current.filter((k) => k !== kettlebell)
          : [...current, kettlebell];
        nu.sort((a, b) => a - b);
        return nu;
      });
    },
    [setSelectedKettlebells],
  );

  const sizeScale = useMemo(
    () =>
      scaleLinear()
        .domain([
          Math.min(...availableKettlebells),
          Math.max(...availableKettlebells),
        ])
        .range([9, 12]),
    [availableKettlebells],
  );

  return { isSelected, onClick, sizeScale };
};
