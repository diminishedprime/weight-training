import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { makeStyles } from "@material-ui/core/styles";
import * as React from "react";

const useStyles = makeStyles((theme) => ({
  formControlLabel: {
    marginLeft: 0
  }
}));

interface SetRepsProps {
  setReps: React.Dispatch<React.SetStateAction<number>>;
  reps: number;
}

export const SetReps: React.FC<SetRepsProps> = ({ setReps, reps }) => {
  const classes = useStyles();
  return (
    <FormControlLabel
      className={classes.formControlLabel}
      labelPlacement="top"
      label={`Reps: ${reps}`}
      control={
        <ButtonGroup>
          <Button onClick={() => setReps((a) => Math.max(1, a - 1))}>-</Button>
          <Button
            color={reps === 1 ? "primary" : undefined}
            variant={reps === 1 ? "contained" : undefined}
            onClick={() => setReps(1)}
          >
            1
          </Button>
          <Button
            color={reps === 3 ? "primary" : undefined}
            variant={reps === 3 ? "contained" : undefined}
            onClick={() => setReps(3)}
          >
            3
          </Button>
          <Button
            color={reps === 5 ? "primary" : undefined}
            variant={reps === 5 ? "contained" : undefined}
            onClick={() => setReps(5)}
          >
            5
          </Button>
          <Button onClick={() => setReps((a) => a + 1)}>+</Button>
        </ButtonGroup>
      }
    />
  );
};

export default SetReps;
