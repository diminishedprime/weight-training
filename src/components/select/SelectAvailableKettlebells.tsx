import { WeightUnit } from "@/common-types";
import DisplayKettlebell from "@/components/display/DisplayKettlebell";
import { useRequiredModifiableLabel } from "@/hooks";
import { FormControl, FormLabel, Stack } from "@mui/material";
import { scaleLinear } from "d3-scale";
import { useCallback } from "react";

interface SelectAvailableKettlebellsProps {
  availableKettlebells: number[];
  selectedKettlebells: number[];
  setSelectedKettlebells: React.Dispatch<React.SetStateAction<number[]>>;
  weightUnit: WeightUnit;
  required?: boolean;
  modified?: boolean;
}

const SelectAvailableKettlebells: React.FC<SelectAvailableKettlebellsProps> = (
  props,
) => {
  const api = useSelectAvailableKettlebellsAPI(props);
  const sizeScale = scaleLinear()
    .domain([
      Math.min(...props.availableKettlebells),
      Math.max(...props.availableKettlebells),
    ])
    .range([6, 9]);
  return (
    <FormControl>
      <FormLabel>{api.label}</FormLabel>
      <Stack
        direction="row"
        spacing={1}
        flexWrap="wrap"
        useFlexGap
        alignItems="flex-end"
      >
        {props.availableKettlebells.map((kettlebell) => (
          <DisplayKettlebell
            onClick={() => api.onClick(kettlebell)}
            selected={api.isSelected(kettlebell)}
            key={kettlebell}
            weightValue={kettlebell}
            weightUnit={props.weightUnit}
            size={sizeScale(kettlebell)}
          />
        ))}
      </Stack>
    </FormControl>
  );
};

export default SelectAvailableKettlebells;

const useSelectAvailableKettlebellsAPI = (
  props: SelectAvailableKettlebellsProps,
) => {
  const { selectedKettlebells, setSelectedKettlebells, required, modified } =
    props;

  const isSelected = useCallback(
    (kettlebell: number) => selectedKettlebells.includes(kettlebell),
    [selectedKettlebells],
  );

  const onClick = useCallback(
    (kettlebell: number) => {
      setSelectedKettlebells((prev) => {
        const nu = prev.includes(kettlebell)
          ? prev.filter((k) => k !== kettlebell)
          : [...prev, kettlebell];
        nu.sort((a, b) => a - b);
        return nu;
      });
    },
    [setSelectedKettlebells],
  );

  // Label logic (can be customized or made a prop)

  const label = useRequiredModifiableLabel(
    "Available Kettlebells",
    !!required,
    !!modified,
  );
  return { isSelected, onClick, label };
};
