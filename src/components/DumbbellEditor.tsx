import React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import { Constants, Database } from "@/database.types";
import { weightUnitUIString } from "@/uiStrings";
import { Button } from "@mui/material";
import Dumbbell from "./Dumbell";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import SettingsIcon from "@mui/icons-material/Settings";
import Chip from "@mui/material/Chip";
import Autocomplete from "@mui/material/Autocomplete";

export interface DumbbellEditorProps {
  weight: number;
  onChange?: (newWeight: number) => void;
  weightUnit: Database["public"]["Enums"]["weight_unit_enum"];
  onUnitChange?: (
    unit: Database["public"]["Enums"]["weight_unit_enum"]
  ) => void;
}

const DEFAULT_DUMBBELL_WEIGHTS = [
  1, 2, 3, 5, 8, 10, 12, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80,
  85, 90, 95, 100,
];

export default function DumbbellEditor({
  weight,
  onChange,
  weightUnit,
  onUnitChange,
}: DumbbellEditorProps) {
  const [availableWeights, setAvailableWeights] = React.useState(
    DEFAULT_DUMBBELL_WEIGHTS
  );
  const [settingsOpen, setSettingsOpen] = React.useState(false);
  const [editWeights, setEditWeights] = React.useState(availableWeights);

  // Find the closest index in availableWeights
  const idx =
    availableWeights.findIndex((w) => w >= weight) === -1
      ? availableWeights.length - 1
      : availableWeights.findIndex((w) => w >= weight);
  const currentIdx =
    availableWeights[idx] === weight
      ? idx
      : availableWeights.findIndex((w) => w === weight);

  const bumpDown = () => {
    if (!onChange) return;
    const prevIdx = currentIdx > 0 ? currentIdx - 1 : 0;
    onChange(availableWeights[prevIdx]);
  };
  const bumpUp = () => {
    if (!onChange) return;
    const nextIdx =
      currentIdx < availableWeights.length - 1 ? currentIdx + 1 : currentIdx;
    onChange(availableWeights[nextIdx]);
  };

  function handleAddWeight(val: number) {
    if (!editWeights.includes(val))
      setEditWeights([...editWeights, val].sort((a, b) => a - b));
  }
  function handleRemoveWeight(val: number) {
    setEditWeights(editWeights.filter((w) => w !== val));
  }
  function handleSaveSettings() {
    setAvailableWeights(editWeights);
    setSettingsOpen(false);
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
      }}
    >
      <Dialog open={settingsOpen} onClose={() => setSettingsOpen(false)}>
        <DialogTitle>Dumbbell Settings</DialogTitle>
        <DialogContent>
          <Box>
            <Typography>Available Dumbbells:</Typography>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 1,
                mt: 1,
              }}
            >
              {DEFAULT_DUMBBELL_WEIGHTS.map((val) =>
                editWeights.includes(val) ? (
                  <Chip
                    key={val}
                    label={val}
                    color="primary"
                    onDelete={() => handleRemoveWeight(val)}
                    sx={{ minWidth: 36 }}
                  />
                ) : (
                  <Chip
                    key={val}
                    label={val}
                    variant="outlined"
                    onClick={() => handleAddWeight(val)}
                    sx={{ minWidth: 36 }}
                  />
                )
              )}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            color="error"
            onClick={() => setSettingsOpen(false)}
          >
            Cancel
          </Button>
          <Button onClick={handleSaveSettings} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
      <Dumbbell weight={weight} weightUnit={weightUnit} />
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 2 }}>
        <IconButton size="small" onClick={() => setSettingsOpen(true)}>
          <SettingsIcon />
        </IconButton>
        <Button
          variant="outlined"
          color="secondary"
          onClick={bumpDown}
          disabled={currentIdx <= 0}
        >
          Down
        </Button>
        <Autocomplete
          freeSolo
          options={availableWeights}
          value={weight}
          onChange={(_, newValue) => {
            const val = Number(newValue);
            if (onChange && !isNaN(val) && val >= 0) onChange(val);
          }}
          inputValue={String(weight)}
          onInputChange={(_, newInputValue) => {
            const val = Number(newInputValue);
            if (onChange && !isNaN(val) && val >= 0) onChange(val);
          }}
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
        <FormControl size="small">
          <InputLabel id="dumbbell-unit-label">Unit</InputLabel>
          <Select
            labelId="dumbbell-unit-label"
            value={weightUnit}
            label="Unit"
            onChange={(e) => onUnitChange && onUnitChange(e.target.value)}
          >
            {Constants.public.Enums.weight_unit_enum.map((unit) => (
              <MenuItem key={unit} value={unit}>
                {weightUnitUIString(unit)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
          variant="outlined"
          onClick={bumpUp}
          disabled={currentIdx >= availableWeights.length - 1}
        >
          Up
        </Button>
      </Box>
    </Box>
  );
}
