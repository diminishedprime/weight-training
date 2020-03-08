import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { makeStyles } from "@material-ui/core/styles";
import * as React from "react";
import * as db from "../../db";
import * as hooks from "../../hooks";
import * as t from "../../types";
import * as util from "../../util";
import BarInput from "../BarInput";
import * as g from "../general";

const useStyles = makeStyles((theme) => ({
  controlRow: {
    marginBottom: theme.spacing(1),
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end"
  }
}));

interface AddLiftProps {
  liftType: t.BarbellLiftType;
  user: t.FirebaseUser;
}

const AddLift: React.FC<AddLiftProps> = ({ liftType, user }) => {
  const classes = useStyles();
  const firestore = hooks.useFirestore();
  const {
    settings: { unit: defaultUnit }
  } = hooks.useSettings();
  const [weight, setWeight] = React.useState<t.Weight>(
    t.Weight.bar(defaultUnit)
  );
  const [reps, setReps] = React.useState(1);
  const [warmup, setWarmup] = React.useState(false);
  const addEnabled = weight !== undefined;
  const addLiftOnClick = React.useCallback(() => {
    if (weight === undefined) {
      return;
    }
    const lift: t.Lift = t.Lift.forBarbellLift(
      weight,
      liftType,
      reps,
      warmup,
      util.now()
    );
    db.addLift(firestore, user, lift);
  }, [weight, liftType, reps, user, warmup, firestore]);

  return (
    <>
      <BarInput weight={weight} onWeightChange={setWeight} />
      <div className={classes.controlRow}>
        <g.SetReps reps={reps} setReps={setReps} />
        <FormControlLabel
          label="Warmup"
          control={
            <Checkbox
              value={warmup}
              onChange={(e) => setWarmup(e.target.checked)}
            />
          }
        />
        <Button
          variant="contained"
          color="primary"
          onClick={addLiftOnClick}
          disabled={!addEnabled}
        >
          Add
        </Button>
      </div>
    </>
  );
};

export default AddLift;
