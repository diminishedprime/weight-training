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
import { weightUnitUIString } from "@/uiStrings";
import IconButton from "@mui/material/IconButton";
import SettingsIcon from "@mui/icons-material/Settings";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import { FormLabel, Typography } from "@mui/material";
import { minimalPlates, ALL_PLATES, DEFAULT_PLATE_SIZES } from "@/util";
import { PLATE_COLORS } from "@/components/Barbell";

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
      <Barbell
        weight={totalWeight}
        barWeight={barWeight}
        plateSizes={plateSizes}
      />

      <Box sx={{ display: "flex", mt: 3 }}>
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
            <FormControl size="small" sx={{ pr: 1 }}>
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
          </Box>
        </Box>
        <ButtonGroup variant="outlined">
          {plateSizes.map((inc) => {
            // Only count plates on one side (per side)
            const count = plateList.filter((p) => p === inc).length;
            const badgeSx = {
              "& .MuiBadge-badge": {
                backgroundColor: PLATE_COLORS[inc]?.bg || "gray",
                color: PLATE_COLORS[inc]?.fg || "white",
              },
            };
            return (
              <Badge
                key={inc}
                sx={badgeSx}
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
        <IconButton size="small" onClick={() => setSettingsOpen(true)}>
          <SettingsIcon />
        </IconButton>
      </Box>
    </Box>
  );
}
