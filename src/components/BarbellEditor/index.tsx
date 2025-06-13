"use client";
import React from "react";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Badge from "@mui/material/Badge";
import Barbell from "@/components/Barbell";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { Constants, Database } from "@/database.types";
import { weightUnitUIString } from "@/uiStrings";
import IconButton from "@mui/material/IconButton";
import SettingsIcon from "@mui/icons-material/Settings";
import SettingsDialog from "./SettingsDialog";
import { Stack, Box } from "@mui/material";
import { useBarbellEditor } from "./useBarbellEditor";
import { DEFAULT_PLATE_SIZES } from "@/constants"; // Import DEFAULT_PLATE_SIZES

export interface BarbellEditorProps {
  totalWeight: number; // total weight on bar (including bar)
  barWeight: number; // Make barWeight required
  onChange: (newTotal: number) => void;
  weightUnit?: Database["public"]["Enums"]["weight_unit_enum"];
  onUnitChange?: (
    unit: Database["public"]["Enums"]["weight_unit_enum"],
  ) => void;
}

const BarbellEditor: React.FC<BarbellEditorProps> = (props) => {
  const {
    totalWeight,
    barWeight, // Remove default, now required
    onChange,
    weightUnit = "pounds",
    onUnitChange,
  } = props;

  const componentAPI = useBarbellEditor({
    totalWeight,
    barWeight,
    onChange,
    initialPlateSizes: DEFAULT_PLATE_SIZES,
  }); // Pass initialPlateSizes

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        my: 2,
      }}
    >
      <SettingsDialog
        open={componentAPI.settingsOpen}
        onClose={() => componentAPI.setSettingsOpen(false)}
        plateSizes={componentAPI.plateSizes}
        onSave={componentAPI.handleSaveSettings}
      />
      <Barbell
        weight={totalWeight}
        barWeight={barWeight}
        plateSizes={componentAPI.plateSizes}
      />
      <Stack
        useFlexGap
        direction="row"
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "center",
          "& > *": { mt: 2 },
          gap: 1,
        }}
      >
        <IconButton
          size="small"
          onClick={() => componentAPI.setSettingsOpen(true)}
        >
          <SettingsIcon />
        </IconButton>
        <Stack direction="row" alignItems="center" spacing={1}>
          <TextField
            label="Value"
            value={totalWeight}
            onChange={(e) => {
              const val = Number(e.target.value);
              if (!isNaN(val) && val >= barWeight) onChange(val); // Removed onChange check, it's guaranteed
            }}
            size="small"
            sx={{ width: "7ch" }}
          />
          <FormControl size="small" sx={{ pr: 1 }}>
            <InputLabel id="barbell-unit-label">Unit</InputLabel>
            <Select
              labelId="barbell-unit-label"
              value={weightUnit}
              label="Unit"
              onChange={(e) =>
                onUnitChange &&
                onUnitChange(
                  e.target
                    .value as Database["public"]["Enums"]["weight_unit_enum"],
                )
              }
            >
              {Constants.public.Enums.weight_unit_enum.map((unit) => (
                <MenuItem key={unit} value={unit}>
                  {weightUnitUIString(unit)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
        <ButtonGroup>
          {componentAPI.plateSizes.map((inc) => {
            const metadata = componentAPI.badgeMetadata[inc];
            return (
              <Badge
                key={inc}
                sx={metadata.sx}
                badgeContent={metadata.count > 0 ? metadata.count : undefined}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
              >
                <Button
                  size="small"
                  onClick={() => componentAPI.handleAdd(inc)}
                >
                  {inc}
                </Button>
              </Badge>
            );
          })}
          <Button color="error" size="small" onClick={componentAPI.handleClear}>
            Clear
          </Button>
        </ButtonGroup>
      </Stack>
    </Box>
  );
};

export default BarbellEditor;
