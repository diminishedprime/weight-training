import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { makeStyles } from "@material-ui/core/styles";
import * as React from "react";
import BarInput from "../components/BarInput";
import Select from "../components/general/Select";
import SetReps from "../components/general/SetReps";
import SnatchTable from "../components/SnatchTable";
import * as hooks from "../hooks";
import * as t from "../types";
import * as util from "../util";

const useStyles = makeStyles((theme) => ({
  controlRow: {
    marginBottom: theme.spacing(1),
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline"
  },
  select: {
    "min-width": "7.5em"
  }
}));

const RecordSnatch: React.FC = () => {
  const classes = useStyles();

  hooks.useMeasurePage("Record Snatch");
  const user = hooks.useForceSignIn();
  const db = t.useSelector((a) => a.db);
  t.useSelector((a) => a.forceUpdateLift);
  const [reps, setReps] = React.useState(1);
  const [warmup, setWarmup] = React.useState(false);
  const [style, setStyle] = React.useState<t.SnatchStyle>(t.SnatchStyle.Full);
  const [startPosition, setStartPosition] = React.useState<t.SnatchPosition>(
    t.SnatchPosition.Floor
  );
  const { weight, setWeight } = hooks.useDefaultBar();

  const addSnatch = React.useCallback(() => {
    if (style !== undefined && startPosition !== undefined && user !== null) {
      db.addSnatch(
        user,
        util.now(),
        weight,
        reps,
        warmup,
        style,
        startPosition
      );
    }
  }, [user, weight, reps, warmup, style, startPosition, db]);

  const modifyQuery = React.useCallback(
    (q: t.Query) => q.orderBy("date", "desc"),
    []
  );

  if (user === null) {
    return null;
  }

  return (
    <>
      <h2 className="is-3 subtitle centered">Snatch</h2>
      <BarInput weight={weight} onWeightChange={setWeight} />
      <div className={classes.controlRow}>
        <Select<t.SnatchPosition>
          className={classes.select}
          toValue={(t) => t}
          toText={(t) => t}
          label="Position"
          initial={startPosition}
          update={setStartPosition}
          options={Object.values(t.SnatchPosition)}
        />
        <Select<t.SnatchStyle>
          className={classes.select}
          toValue={(t) => t}
          toText={(t) => t}
          label="Style"
          initial={style}
          update={setStyle}
          options={Object.values(t.SnatchStyle)}
        />
        <FormControlLabel
          label="Warmup"
          control={
            <Checkbox
              value={warmup}
              onChange={(e) => setWarmup(e.target.checked)}
            />
          }
        />
      </div>
      <div className={classes.controlRow}>
        <SetReps reps={reps} setReps={setReps} />
        <Button color="primary" variant="contained" onClick={addSnatch}>
          Add
        </Button>
      </div>
      <hr />
      <SnatchTable user={user} modifyQuery={modifyQuery} />
    </>
  );
};

export default RecordSnatch;
