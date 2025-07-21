import React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { Button } from "@mui/material";
import DisplayDumbbell from "@/components/display/DisplayDumbbell";
import Autocomplete from "@mui/material/Autocomplete";
import { WeightUnit } from "@/common-types";

export interface EditDumbbellProps {
  weightValue: number;
  onChange: (newWeight: number) => void;
  weightUnit: WeightUnit;
  availableDumbbells: number[];
}

const useEditDumbellAPI = (props: EditDumbbellProps) => {
  const { weightValue: weight, onChange } = props;

  const [availableWeights, setAvailableWeights] = React.useState(() => [
    ...props.availableDumbbells,
  ]);

  const currentIdx = React.useMemo(() => {
    return availableWeights.findIndex((w) => w === weight);
  }, [availableWeights, weight]);

  const handleBumpDown = React.useCallback(() => {
    if (currentIdx === -1) return;
    const firstIdx = 0;
    const prevIdx = Math.max(currentIdx - 1, firstIdx);
    onChange(availableWeights[prevIdx]);
  }, [onChange, currentIdx, availableWeights]);

  const handleBumpUp = React.useCallback(() => {
    if (currentIdx === -1) return;
    const lastIdx = availableWeights.length - 1;
    const nextIdx = Math.min(currentIdx + 1, lastIdx);
    onChange(availableWeights[nextIdx]);
  }, [onChange, currentIdx, availableWeights]);

  const handleWeightChange = React.useCallback(
    (newValue: unknown) => {
      const val = Number(newValue);
      if (!isNaN(val) && val >= 0) {
        // If the value is not in availableWeights, add it and sort
        if (!availableWeights.includes(val)) {
          setAvailableWeights((prev) => [...prev, val].sort((a, b) => a - b));
        }
        onChange(val);
      }
    },
    [onChange, availableWeights]
  );

  const handleInputChange = React.useCallback(
    (newInputValue: string) => {
      const val = Number(newInputValue);
      if (!isNaN(val) && val >= 0) {
        // If the value is not in availableWeights, add it and sort
        if (!availableWeights.includes(val)) {
          setAvailableWeights((prev) => [...prev, val].sort((a, b) => a - b));
        }
        onChange(val);
      }
    },
    [onChange, availableWeights]
  );

  return {
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
      }}>
      <DisplayDumbbell
        weight={props.weightValue}
        weightUnit={props.weightUnit}
      />
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 2 }}>
        <Button
          variant="outlined"
          color="secondary"
          onClick={api.handleBumpDown}
          disabled={api.currentIdx <= 0}>
          Down
        </Button>
        <Autocomplete
          freeSolo
          options={api.availableWeights}
          value={props.weightValue}
          getOptionLabel={(option) => option.toString()}
          onChange={(_, newValue) => api.handleWeightChange(newValue)}
          inputValue={String(props.weightValue)}
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
          disabled={api.currentIdx >= api.availableWeights.length - 1}>
          Up
        </Button>
      </Box>
    </Box>
  );
};

export default EditDumbbell;
