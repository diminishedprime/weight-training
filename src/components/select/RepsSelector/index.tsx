import React from "react";
import { ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import SetAvailableReps from "@/components/select/RepsSelector/SetAvailableReps";
import { Box } from "@mui/material";

export interface RepsSelectorProps {
  reps: number;
  onChange: (reps: number) => void;
  repChoices?: number[];
  wendlerReps?: boolean;
  isAmrap?: boolean;
  hideSettings?: boolean;
}

const DEFAULT_REP_CHOICES = [1, 3, 5, 8, 10, 12, 15];

function useRepsSelectorApi(props: RepsSelectorProps) {
  const { reps, onChange, repChoices, wendlerReps } = props;
  const MIN_REPS = 1;
  const initialChoices = wendlerReps
    ? [1, 3, 5, 8]
    : repChoices || DEFAULT_REP_CHOICES;
  const [choices, setChoices] = React.useState<number[]>(initialChoices);

  const isDecrementDisabled = reps <= MIN_REPS;

  // Unified onChange handler for ToggleButtonGroup
  const handleToggleChange = React.useCallback(
    (_e: React.MouseEvent<HTMLElement> | null, val: number | string | null) => {
      if (!val) return;
      if (val === "-" && !isDecrementDisabled) {
        onChange(reps - 1);
      } else if (val === "+") {
        onChange(reps + 1);
      } else if (typeof val === "number") {
        onChange(val);
      }
    },
    [reps, onChange, isDecrementDisabled]
  );

  const handleSetAvailableRepsClose = React.useCallback(
    (newChoices: number[]) => {
      setChoices(newChoices);
      // Snap to a valid rep if current is not in new choices
      if (!newChoices.includes(reps) && newChoices.length > 0) {
        onChange(newChoices[0]);
      }
    },
    [reps, onChange]
  );

  return {
    choices,
    setChoices,
    handleToggleChange,
    handleSetAvailableRepsClose,
    MIN_REPS,
    isDecrementDisabled,
  };
}

// TODO - Update this to use the icon button group thingy that like effort and
// completion status use, and then have it where if you go above the biggest rep
// choice that's explicitly passed in, it adds in a new one that shows you the
// current reps that are selected.

const RepsSelector: React.FC<RepsSelectorProps> = (props) => {
  const api = useRepsSelectorApi(props);

  return (
    <Box sx={{ display: "flex", alignItems: "end" }}>
      {!props.hideSettings && (
        <SetAvailableReps
          repChoices={api.choices}
          onClose={api.handleSetAvailableRepsClose}
        />
      )}
      <FormControl>
        <FormLabel sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          Reps: {props.reps}
          {props.isAmrap && (
            <Typography variant="body2" color="primary">
              (AMRAP)
            </Typography>
          )}
        </FormLabel>
        <Box>
          <ToggleButtonGroup
            color="primary"
            value={props.reps}
            exclusive
            onChange={api.handleToggleChange}
            size="small"
            aria-label="Reps Selector"
            sx={{ mb: 1 }}>
            <ToggleButton
              value="-"
              disabled={api.isDecrementDisabled}
              aria-label="decrement reps"
              size="small">
              -
            </ToggleButton>
            {api.choices.map((val) => (
              <ToggleButton
                key={val}
                value={val}
                aria-label={`reps ${val}`}
                size="small">
                {val}
              </ToggleButton>
            ))}
            <ToggleButton value="+" aria-label="increment reps" size="small">
              +
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </FormControl>
    </Box>
  );
};

export default RepsSelector;
