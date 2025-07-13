"use client";
import React from "react";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Badge from "@mui/material/Badge";
import Barbell from "@/components/Barbell";
import TextField from "@mui/material/TextField";
import { Database } from "@/database.types";
import IconButton from "@mui/material/IconButton";
import SettingsIcon from "@mui/icons-material/Settings";
import SettingsDialog from "@/components/BarbellEditor/SettingsDialog";
import { Stack } from "@mui/material";
import { useBarbellEditor } from "@/components/BarbellEditor/useBarbellEditor";
import { DEFAULT_PLATE_SIZES } from "@/constants"; // Import DEFAULT_PLATE_SIZES
import SelectWeightUnit from "@/components/select/SelectWeightUnit";

export interface BarbellEditorProps {
  totalWeight: number; // total weight on bar (including bar)
  barWeight: number; // Make barWeight required
  onChange: (newTotal: number) => void;
  weightUnit: Database["public"]["Enums"]["weight_unit_enum"]; // Now required
  onUnitChange: (unit: Database["public"]["Enums"]["weight_unit_enum"]) => void; // Now required
}

// TODO - the api hook should probably just be inline. Also, I should use the
// common-types

// TODO - The plate selector buttongroup thing should be a separate component

// TODO - there should be an easy way to pass in the default values for settings
// so they can come from user preferences.

const BarbellEditor: React.FC<BarbellEditorProps> = (props) => {
  const { totalWeight, barWeight, onChange, weightUnit, onUnitChange } = props;

  const componentAPI = useBarbellEditor({
    totalWeight,
    barWeight,
    onChange,
    initialPlateSizes: DEFAULT_PLATE_SIZES,
  });

  return (
    <Stack display="flex" direction="column" alignItems="center" spacing={2}>
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
        display="flex"
        flexWrap="wrap"
        justifyContent="center"
        alignItems="center"
        gap={1}>
        <IconButton
          size="small"
          onClick={() => componentAPI.setSettingsOpen(true)}>
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
          <SelectWeightUnit
            weightUnit={weightUnit}
            onWeightUnitChange={onUnitChange}
          />
        </Stack>
        <ButtonGroup sx={{ mt: 1 }}>
          {componentAPI.plateSizes.map((inc) => {
            const metadata = componentAPI.badgeMetadata[inc];
            return (
              <Badge
                key={inc}
                sx={metadata.sx}
                badgeContent={metadata.count > 0 ? metadata.count : undefined}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}>
                <Button
                  size="small"
                  onClick={() => componentAPI.handleAdd(inc)}>
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
    </Stack>
  );
};

export default BarbellEditor;
