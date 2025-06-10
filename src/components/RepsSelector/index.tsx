import React from "react";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import SetAvailableReps from "./SetAvailableReps";
import { Box } from "@mui/material";

export interface RepsSelectorProps {
  reps: number;
  onChange: (reps: number) => void;
  repChoices?: number[];
}

const DEFAULT_REP_CHOICES = [1, 3, 5, 8, 10, 12, 15];

function useRepsSelectorApi(
  repChoices: number[],
  reps: number,
  onChange: (reps: number) => void
) {
  const MIN_REPS = 1;
  const [choices, setChoices] = React.useState<number[]>(repChoices);

  function handleDecrement() {
    if (reps > MIN_REPS) onChange(reps - 1);
  }
  function handleIncrement() {
    onChange(reps + 1);
  }
  function handleSetAvailableRepsClose(newChoices: number[]) {
    setChoices(newChoices);
    // Snap to a valid rep if current is not in new choices
    if (!newChoices.includes(reps) && newChoices.length > 0) {
      onChange(newChoices[0]);
    }
  }

  return {
    choices,
    setChoices,
    handleDecrement,
    handleIncrement,
    handleSetAvailableRepsClose,
    MIN_REPS,
  };
}

const RepsSelector: React.FC<RepsSelectorProps> = ({
  reps,
  onChange,
  repChoices = DEFAULT_REP_CHOICES,
}) => {
  const api = useRepsSelectorApi(repChoices, reps, onChange);

  return (
    <Box sx={{ display: "flex", alignItems: "end" }}>
      <SetAvailableReps
        repChoices={api.choices}
        onClose={api.handleSetAvailableRepsClose}
      />
      <FormControl>
        <FormLabel sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          Reps: {reps}
        </FormLabel>
        <Box>
          <ButtonGroup variant="outlined" size="small">
            <Button
              onClick={api.handleDecrement}
              disabled={reps <= api.MIN_REPS}
            >
              -
            </Button>
            {api.choices.map((val) => (
              <Button
                key={val}
                variant={reps === val ? "contained" : "outlined"}
                onClick={onChange.bind(null, val)}
              >
                {val}
              </Button>
            ))}
            <Button onClick={api.handleIncrement}>+</Button>
          </ButtonGroup>
        </Box>
      </FormControl>
    </Box>
  );
};

export default RepsSelector;
