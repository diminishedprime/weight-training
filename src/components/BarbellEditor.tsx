"use client";
import React from "react";
import Barbell from "@/components/Barbell";
import TextField from "@mui/material/TextField";
import { Stack } from "@mui/material";
import SelectActivePlates from "@/components/select/SelectActivePlates";
import { minimalPlates } from "@/util";
import { WeightUnit } from "@/common-types";

export interface BarbellEditorProps {
  totalWeight: number;
  barWeight: number;
  onChange: (newTotal: number) => void;
  weightUnit: WeightUnit;
  availablePlates: number[];
}

// TODO - there should be an easy way to pass in the default values for settings
// so they can come from user preferences.

const useBarbellEditorAPI = (props: BarbellEditorProps) => {
  const { totalWeight, barWeight, onChange } = props;

  const weightPerSide = (totalWeight - barWeight) / 2;
  const plateList = minimalPlates(weightPerSide, props.availablePlates);

  const plateCounts = React.useMemo(() => {
    const counts: { [key: number]: number } = {};
    for (const plate of plateList) {
      counts[plate] = (counts[plate] || 0) + 1;
    }
    return counts;
  }, [plateList]);

  const handleAdd = React.useCallback(
    (increment: number) => {
      onChange(totalWeight + increment * 2);
    },
    [onChange, totalWeight]
  );

  const handleClear = React.useCallback(() => {
    onChange(barWeight);
  }, [onChange, barWeight]);

  return {
    plateCounts,
    handleAdd,
    handleClear,
  };
};

const BarbellEditor: React.FC<BarbellEditorProps> = (props) => {
  const api = useBarbellEditorAPI(props);

  return (
    <Stack display="flex" direction="column" alignItems="center" spacing={2}>
      <Barbell
        weight={props.totalWeight}
        barWeight={props.barWeight}
        availablePlates={props.availablePlates}
      />
      <Stack
        useFlexGap
        direction="row"
        display="flex"
        flexWrap="wrap"
        justifyContent="center"
        alignItems="center"
        gap={1}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <TextField
            label="Value"
            value={props.totalWeight}
            onChange={(e) => {
              const val = Number(e.target.value);
              if (!isNaN(val) && val >= props.barWeight) props.onChange(val); // Removed onChange check, it's guaranteed
            }}
            size="small"
            sx={{ width: "7ch" }}
          />
        </Stack>
        <SelectActivePlates
          availablePlates={props.availablePlates}
          activePlates={api.plateCounts}
          onAddPlate={api.handleAdd}
          onClear={api.handleClear}
        />
      </Stack>
    </Stack>
  );
};

export default BarbellEditor;
