import { RDispatch, WeightUnit } from "@/common-types";
import DisplayDumbbell from "@/components/display/DisplayDumbbell";
import { useResolvableWeight } from "@/hooks";
import { TestIds } from "@/test-ids";
import { Button } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import React from "react";

export interface EditDumbbellProps {
  targetWeightValue: number;
  actualWeightValue: number | undefined;
  setActualWeightValue: RDispatch<number | undefined>;
  weightUnit: WeightUnit;
  availableDumbbells: number[];
}

const useEditDumbellAPI = (props: EditDumbbellProps) => {
  const {
    availableDumbbells,
    targetWeightValue,
    actualWeightValue,
    setActualWeightValue,
  } = props;

  const [availableWeights, setAvailableWeights] = React.useState(() => {
    const copy = [...availableDumbbells];
    copy.sort((a, b) => a - b);
    return copy;
  });

  const targetToActual = React.useCallback(
    (target: number) => {
      // Find the closest available dumbbell weight
      const closest = availableWeights.reduce((prev, curr) =>
        Math.abs(curr - target) < Math.abs(prev - target) ? curr : prev,
      );
      return closest;
    },
    [availableWeights],
  );

  const [resolvedWeight, setResolvedWeight] = useResolvableWeight(
    actualWeightValue,
    setActualWeightValue,
    targetWeightValue,
    targetToActual,
  );

  const currentIdx = React.useMemo(() => {
    return availableWeights.findIndex((w) => w === resolvedWeight);
  }, [availableWeights, resolvedWeight]);

  const handleBumpDown = React.useCallback(() => {
    if (currentIdx === -1) return;
    const firstIdx = 0;
    const prevIdx = Math.max(currentIdx - 1, firstIdx);
    setResolvedWeight(availableWeights[prevIdx]);
  }, [setResolvedWeight, currentIdx, availableWeights]);

  const handleBumpUp = React.useCallback(() => {
    if (currentIdx === -1) return;
    const lastIdx = availableWeights.length - 1;
    const nextIdx = Math.min(currentIdx + 1, lastIdx);
    setResolvedWeight(availableWeights[nextIdx]);
  }, [setResolvedWeight, currentIdx, availableWeights]);

  const handleWeightChange = React.useCallback(
    (newValue: unknown) => {
      const val = Number(newValue);
      if (!isNaN(val) && val >= 0) {
        // If the value is not in availableWeights, add it and sort
        if (!availableWeights.includes(val)) {
          setAvailableWeights((prev) => [...prev, val].sort((a, b) => a - b));
        }
        setResolvedWeight(val);
      }
    },
    [setResolvedWeight, availableWeights],
  );

  const handleInputChange = React.useCallback(
    (newInputValue: string) => {
      const val = Number(newInputValue);
      if (!isNaN(val) && val >= 0) {
        // If the value is not in availableWeights, add it and sort
        if (!availableWeights.includes(val)) {
          setAvailableWeights((prev) => [...prev, val].sort((a, b) => a - b));
        }
        setResolvedWeight(val);
      }
    },
    [setResolvedWeight, availableWeights],
  );

  return {
    resolvedWeight,
    availableWeights,
    currentIdx,
    handleBumpDown,
    handleBumpUp,
    handleWeightChange,
    handleInputChange,
  };
};

const EditDumbbell: React.FC<EditDumbbellProps> = (props) => {
  const api = useEditDumbellAPI(props);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
      }}
    >
      <DisplayDumbbell
        weight={api.resolvedWeight}
        weightUnit={props.weightUnit}
      />
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 2 }}>
        <Button
          data-testid={TestIds.EditDumbbellBumpDownButton}
          variant="outlined"
          color="secondary"
          onClick={api.handleBumpDown}
          disabled={api.currentIdx <= 0}
        >
          Down
        </Button>
        <Autocomplete
          freeSolo
          options={api.availableWeights}
          value={api.resolvedWeight}
          getOptionLabel={(option) => option.toString()}
          onChange={(_, newValue) => api.handleWeightChange(newValue)}
          inputValue={String(api.resolvedWeight)}
          onInputChange={(_, newInputValue) =>
            api.handleInputChange(newInputValue)
          }
          disableClearable
          renderInput={(params) => (
            <TextField
              {...params}
              label="Value"
              variant="outlined"
              size="small"
              sx={{ width: "8ch" }}
            />
          )}
        />
        <Button
          variant="outlined"
          onClick={api.handleBumpUp}
          disabled={api.currentIdx >= api.availableWeights.length - 1}
        >
          Up
        </Button>
      </Box>
    </Box>
  );
};

export default EditDumbbell;
