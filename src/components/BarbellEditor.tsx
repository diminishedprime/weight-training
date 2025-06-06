import React from "react";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Box from "@mui/material/Box";
import Badge from "@mui/material/Badge";
import Barbell from "@/components/Barbell";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { Constants } from "@/database.types";
import { weightUnitUIString } from "@/util";
import IconButton from "@mui/material/IconButton";
import SettingsIcon from "@mui/icons-material/Settings";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import { Typography } from "@mui/material";

// TODO: consider letting the user input exactly what weights they have available
// so if they need to like double up on 35s because they're otherwise out of
// weights to hit a target.
const ALL_PLATES = [2.5, 5, 10, 25, 35, 45, 55];
const DEFAULT_PLATE_SIZES = [45, 25, 10, 5, 2.5];

function minimalPlates(
  targetWeight: number,
  availablePlates = DEFAULT_PLATE_SIZES
): number[] {
  let remaining = targetWeight;
  const result: number[] = [];
  for (const plate of availablePlates) {
    while (remaining >= plate) {
      result.push(plate);
      remaining -= plate;
    }
  }
  return result;
}

export interface BarbellEditorProps {
  totalWeight: number; // total weight on bar (including bar)
  barWeight?: number; // default 45
  onChange?: (newTotal: number) => void;
  weightUnit?: string;
  onUnitChange?: (unit: string) => void;
}

export default function BarbellEditor({
  totalWeight,
  barWeight = 45,
  onChange,
  weightUnit = "pounds",
  onUnitChange,
}: BarbellEditorProps) {
  const [plateSizes, setPlateSizes] = React.useState(DEFAULT_PLATE_SIZES);
  const weightPerSide = (totalWeight - barWeight) / 2;
  const plateList = minimalPlates(weightPerSide, plateSizes);

  const handleAdd = (inc: number) => {
    if (onChange) {
      onChange(totalWeight + inc * 2);
    }
  };

  const [settingsOpen, setSettingsOpen] = React.useState(false);
  const [editPlates, setEditPlates] = React.useState(plateSizes);

  function handleAddPlate(size: number) {
    if (!editPlates.includes(size))
      setEditPlates([...editPlates, size].sort((a, b) => b - a));
  }
  function handleRemovePlate(size: number) {
    setEditPlates(editPlates.filter((p) => p !== size));
  }
  function handleSaveSettings() {
    setPlateSizes(editPlates);
    setSettingsOpen(false);
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        my: 2,
      }}
    >
      <Box
        sx={{ width: "100%", display: "flex", justifyContent: "flex-end" }}
      ></Box>
      <Dialog open={settingsOpen} onClose={() => setSettingsOpen(false)}>
        <DialogTitle>Barbell Settings</DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            <Box>
              <Typography>Available Plates:</Typography>
              <Stack
                direction="row"
                spacing={1}
                sx={{ mt: 1, flexWrap: "wrap" }}
              >
                {ALL_PLATES.map((size) =>
                  editPlates.includes(size) ? (
                    <Chip
                      key={size}
                      label={size}
                      onDelete={() => handleRemovePlate(size)}
                      color="primary"
                    />
                  ) : (
                    <Chip
                      key={size}
                      label={size}
                      variant="outlined"
                      onClick={() => handleAddPlate(size)}
                    />
                  )
                )}
              </Stack>
            </Box>
          </Stack>
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
      <Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <TextField
            label="Value"
            value={totalWeight}
            onChange={(e) => {
              const val = Number(e.target.value);
              if (onChange && !isNaN(val) && val >= barWeight) onChange(val);
            }}
            variant="outlined"
            size="small"
            sx={{ width: "7ch" }}
          />
          <FormControl size="small">
            <InputLabel id="barbell-unit-label">Unit</InputLabel>
            <Select
              labelId="barbell-unit-label"
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

          <IconButton size="small" onClick={() => setSettingsOpen(true)}>
            <SettingsIcon />
          </IconButton>
        </Box>
      </Box>
      <Barbell plateList={plateList} />
      <ButtonGroup variant="outlined" sx={{ mt: 2, position: "relative" }}>
        {plateSizes.map((inc) => {
          // Only count plates on one side (per side)
          const count = plateList.filter((p) => p === inc).length;
          return (
            <Badge
              key={inc}
              color="primary"
              badgeContent={count > 0 ? count : undefined}
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
            >
              <Button
                variant="outlined"
                size="small"
                onClick={() => handleAdd(inc)}
              >
                {inc}
              </Button>
            </Badge>
          );
        })}
        <Button
          variant="outlined"
          color="error"
          size="small"
          onClick={() => onChange && onChange(barWeight)}
        >
          Clear
        </Button>
      </ButtonGroup>
    </Box>
  );
}
