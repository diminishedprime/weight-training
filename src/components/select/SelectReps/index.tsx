import React, { useMemo } from "react";
import { ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";

export interface SelectRepsProps {
  reps: number;
  onRepsChange: (reps: number) => void;
  repChoices?: number[];
  wendlerReps?: boolean;
  isAmrap?: boolean;
  hideSettings?: boolean;
}

const DEFAULT_REP_CHOICES = [1, 3, 5, 8, 10, 12, 15];

function useSelectRepsAPI(props: SelectRepsProps) {
  const { reps, onRepsChange, repChoices, wendlerReps } = props;
  const MIN_REPS = 1;
  const [localRepChoices, setLocalRepChoices] = React.useState<number[]>(
    wendlerReps ? [1, 3, 5, 8] : repChoices || DEFAULT_REP_CHOICES
  );

  const isDecrementDisabled = useMemo(() => reps <= MIN_REPS, [reps]);

  const handleToggleChange = React.useCallback(
    (_e: React.MouseEvent<HTMLElement> | null, val: number | string | null) => {
      if (!val) return;
      if (val === "-" && !isDecrementDisabled) {
        onRepsChange(reps - 1);
      } else if (val === "+") {
        onRepsChange(reps + 1);
      } else if (typeof val === "number") {
        onRepsChange(val);
      }
    },
    [reps, onRepsChange, isDecrementDisabled]
  );

  const handleSetAvailableRepsClose = React.useCallback(
    (newChoices: number[]) => {
      setLocalRepChoices(newChoices);
      // Snap to a valid rep if current is not in new choices
      if (!newChoices.includes(reps) && newChoices.length > 0) {
        onRepsChange(newChoices[0]);
      }
    },
    [reps, onRepsChange]
  );

  return {
    choices: localRepChoices,
    setChoices: setLocalRepChoices,
    handleToggleChange,
    handleSetAvailableRepsClose,
    MIN_REPS,
    isDecrementDisabled,
  };
}

// TODO - Consider updating this where the current rep choice always has a
// button, even if it's not in the choices. It doesn't need to stay, but it'll
// make it easier to see what the current rep number is.
//
// Thinking about this more, it may be annoying because it may cause the UI to
// bump around?

const SelectReps: React.FC<SelectRepsProps> = (props) => {
  const api = useSelectRepsAPI(props);

  return (
    <FormControl>
      <FormLabel sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        Reps: {props.reps}
        {props.isAmrap && (
          <Typography variant="body2" color="primary">
            (AMRAP)
          </Typography>
        )}
      </FormLabel>
      <ToggleButtonGroup
        color="primary"
        value={props.reps}
        exclusive
        onChange={api.handleToggleChange}
        size="small"
        aria-label="Select Reps"
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
    </FormControl>
  );
};

export default SelectReps;
