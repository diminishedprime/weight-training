"use client";
import React from "react";
import Barbell from "@/components/Barbell";
import TextField from "@mui/material/TextField";
import { Stack } from "@mui/material";
import SelectActivePlates from "@/components/select/SelectActivePlates";
import { minimalPlates } from "@/util";
import { RoundingMode, WeightUnit } from "@/common-types";

export interface BarbellEditorProps {
  targetWeight: number;
  roundingMode: RoundingMode;
  barWeight: number;
  onTargetWeightChange: (newTargetWeight: number) => void;
  weightUnit: WeightUnit;
  availablePlates: number[];
  editing?: boolean;
  onClickWeight?: () => void;
}

// TODO - there should be an easy way to pass in the default values for settings
// so they can come from user preferences.

const useBarbellEditorAPI = (props: BarbellEditorProps) => {
  // Sync weightInput string when actual weight changes externally
  const { targetWeight, barWeight, onTargetWeightChange } = props;

  // Calculate the actual weight: barWeight + sum of all plates (both sides)
  const weightPerSide = (targetWeight - barWeight) / 2;
  const { plates: plateList, rounded } = minimalPlates(
    weightPerSide,
    props.availablePlates,
    props.roundingMode
  );
  const actualWeight = barWeight + plateList.reduce((sum, p) => sum + p * 2, 0);

  // Local string state for the input value
  const [weightInput, setWeightInput] = React.useState<string>(
    String(actualWeight)
  );

  React.useEffect(() => {
    setWeightInput(String(actualWeight));
  }, [actualWeight]);

  // Update targetWeight only on blur
  const handleWeightBlur = React.useCallback(() => {
    const val = Number(weightInput);
    if (!isNaN(val) && val >= barWeight && val !== actualWeight) {
      onTargetWeightChange(val);
    }
  }, [weightInput, barWeight, actualWeight, onTargetWeightChange]);

  const plateCounts = React.useMemo(() => {
    const counts: { [key: number]: number } = {};
    for (const plate of plateList) {
      counts[plate] = (counts[plate] || 0) + 1;
    }
    return counts;
  }, [plateList]);

  const handleAdd = React.useCallback(
    (increment: number) => {
      onTargetWeightChange(targetWeight + increment * 2);
    },
    [onTargetWeightChange, targetWeight]
  );

  const handleClear = React.useCallback(() => {
    onTargetWeightChange(barWeight);
  }, [onTargetWeightChange, barWeight]);

  return {
    plateCounts,
    handleAdd,
    handleClear,
    weightInput,
    setWeightInput,
    handleWeightBlur,
    rounded,
  };
};

const BarbellEditor: React.FC<BarbellEditorProps> = (props) => {
  const api = useBarbellEditorAPI(props);

  // TODO this has an issue where it moves when you make it editable, but it's
  // probably something that will be fixed if I can move away from all the
  // weirdness of the useRef stuff.

  return (
    <Stack display="flex" direction="column" alignItems="center" spacing={1}>
      <Barbell
        weightUnit={props.weightUnit}
        targetWeight={props.targetWeight}
        barWeight={props.barWeight}
        availablePlates={props.availablePlates}
        onClickWeight={props.onClickWeight}
        roundingMode={props.roundingMode}
      />
      {props.editing && (
        <Stack
          display="flex"
          direction="row"
          flexWrap="wrap"
          useFlexGap
          gap={1}
          alignItems="flex-end">
          <TextField
            label="Weight"
            value={api.weightInput}
            onChange={(e) => api.setWeightInput(e.target.value)}
            onBlur={api.handleWeightBlur}
            size="small"
            sx={{ width: "9ch" }}
          />
          <SelectActivePlates
            availablePlates={props.availablePlates}
            activePlates={api.plateCounts}
            onAddPlate={api.handleAdd}
            onClear={api.handleClear}
          />
        </Stack>
      )}
    </Stack>
  );
};

export default BarbellEditor;
