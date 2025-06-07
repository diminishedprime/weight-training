import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import { Typography } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";

export interface RepsSelectorProps {
  reps: number;
  onChange: (reps: number) => void;
  repChoices?: number[];
}

export const STANDARD_BARBELL_REPS = [1, 3, 5];
export const STANDARD_DUMBBELL_REPS = [5, 8, 10, 12, 15];
export const STANDARD_MACHINE_REPS = [5, 8, 10, 12, 15];

const RepsSelector: React.FC<RepsSelectorProps> = ({
  reps,
  onChange,
  repChoices = STANDARD_BARBELL_REPS,
}) => {
  const MIN_REPS = 1;
  const handleDecrement = () => {
    if (reps > MIN_REPS) onChange(reps - 1);
  };
  const handleIncrement = () => {
    onChange(reps + 1);
  };
  return (
    <FormControl>
      <FormLabel>Reps: {reps}</FormLabel>
      <ButtonGroup variant="outlined" size="small">
        <Button onClick={handleDecrement} disabled={reps <= MIN_REPS}>
          -
        </Button>
        {repChoices.map((val) => (
          <Button
            key={val}
            variant={reps === val ? "contained" : "outlined"}
            onClick={() => onChange(val)}
          >
            {val}
          </Button>
        ))}
        <Button onClick={handleIncrement}>+</Button>
      </ButtonGroup>
    </FormControl>
  );
};

export default RepsSelector;
