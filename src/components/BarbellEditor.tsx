import React from "react";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Box from "@mui/material/Box";
import Badge from "@mui/material/Badge";
import Barbell from "@/components/Barbell";
import TextField from "@mui/material/TextField";

// TODO: consider making this configurable by the user in case they have a
// different plate setup available. (i.e. 35s)
const PLATE_SIZES = [45, 25, 10, 5, 2.5];

function minimalPlates(
  targetWeight: number,
  availablePlates = PLATE_SIZES
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
}

export default function BarbellEditor({
  totalWeight,
  barWeight = 45,
  onChange,
}: BarbellEditorProps) {
  // Plates per side
  const platesPerSide = (totalWeight - barWeight) / 2;
  const plateList = minimalPlates(platesPerSide);

  const handleAdd = (inc: number) => {
    if (onChange) {
      onChange(totalWeight + inc * 2);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        my: 2,
      }}
    >
      <Box>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <TextField
            type="number"
            value={totalWeight}
            onChange={(e) => {
              const val = Number(e.target.value);
              if (onChange && !isNaN(val) && val >= barWeight) onChange(val);
            }}
            variant="outlined"
            size="small"
          />
        </Box>
      </Box>
      <Barbell plateList={plateList} />
      <ButtonGroup variant="outlined" sx={{ mt: 2, position: "relative" }}>
        {PLATE_SIZES.map((inc) => {
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
