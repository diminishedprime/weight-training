import React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { Button } from "@mui/material";
import Dumbbell from "@/components/Dumbell";
import Autocomplete from "@mui/material/Autocomplete";
import { WeightUnit } from "@/common-types";

export interface DumbbellEditorProps {
  // TODO available weights should be passed in and come from user preferences.
  weight: number;
  onChange?: (newWeight: number) => void;
  weightUnit: WeightUnit;
}

const DEFAULT_DUMBBELL_WEIGHTS = [
  1, 2, 3, 5, 8, 10, 12, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80,
  85, 90, 95, 100,
];

const useDumbbellEditorAPI = (props: DumbbellEditorProps) => {
  const { weight, onChange } = props;

  const availableWeights = DEFAULT_DUMBBELL_WEIGHTS;

  // Find the closest index in availableWeights
  const idx =
    availableWeights.findIndex((w) => w >= weight) === -1
      ? availableWeights.length - 1
      : availableWeights.findIndex((w) => w >= weight);
  const currentIdx =
    availableWeights[idx] === weight
      ? idx
      : availableWeights.findIndex((w) => w === weight);

  const handleBumpDown = React.useCallback(() => {
    if (!onChange) return;
    const prevIdx = currentIdx > 0 ? currentIdx - 1 : 0;
    onChange(availableWeights[prevIdx]);
  }, [onChange, currentIdx, availableWeights]);

  const handleBumpUp = React.useCallback(() => {
    if (!onChange) return;
    const nextIdx =
      currentIdx < availableWeights.length - 1 ? currentIdx + 1 : currentIdx;
    onChange(availableWeights[nextIdx]);
  }, [onChange, currentIdx, availableWeights]);

  const handleWeightChange = React.useCallback(
    (newValue: unknown) => {
      const val = Number(newValue);
      if (onChange && !isNaN(val) && val >= 0) onChange(val);
    },
    [onChange]
  );

  const handleInputChange = React.useCallback(
    (newInputValue: string) => {
      const val = Number(newInputValue);
      if (onChange && !isNaN(val) && val >= 0) onChange(val);
    },
    [onChange]
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

const DumbbellEditor: React.FC<DumbbellEditorProps> = (props) => {
  const api = useDumbbellEditorAPI(props);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
      }}>
      <Dumbbell weight={props.weight} weightUnit={props.weightUnit} />
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
          value={props.weight}
          getOptionLabel={(option) => option.toString()}
          onChange={(_, newValue) => api.handleWeightChange(newValue)}
          inputValue={String(props.weight)}
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

export default DumbbellEditor;
