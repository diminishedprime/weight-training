import * as React from "react";
import Bar from "../components/Bar";
import * as hooks from "../hooks";
import * as t from "../types";
import * as util from "../util";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Badge from "@material-ui/core/Badge";
import SelectUnit from "./general/SelectUnit";

interface PlateButtonsProps {
  unit: t.WeightUnit;
  onClick: (weight: t.Weight) => () => void;
  plateConfig?: t.PlateConfig;
}

const usePlateStyles = makeStyles((theme) => ({
  plates: {
    "display": "flex",
    "justify-content": "center"
  }
}));

const PlateButtons: React.FC<PlateButtonsProps> = ({
  unit,
  onClick,
  plateConfig
}) => {
  const plateClasses = usePlateStyles();
  const plates = util.platesForUnit(unit);
  return (
    <ButtonGroup className={plateClasses.plates}>
      {plates.map((plate) => {
        const numPlates =
          plateConfig === undefined || plateConfig === "not-possible"
            ? 0
            : plateConfig.filter((a) => a.weight.equals(plate.weight)).length;
        return (
          <Badge key={plate.weight.display()} badgeContent={numPlates}>
            <Button
              className="button flex-grow"
              onClick={onClick(plate.weight)}
            >
              {plate.weight.display()}
            </Button>
          </Badge>
        );
      })}
    </ButtonGroup>
  );
};

interface BarInputProps {
  weight: t.Weight;
  onWeightChange: (weight: t.Weight) => void;
}

const useBarStyles = makeStyles((theme) => ({
  bottomRow: {
    "display": "flex",
    "justify-content": "space-between",
    "align-items": "center"
  }
}));

const BarInput: React.FC<BarInputProps> = ({
  weight: propWeight,
  onWeightChange
}) => {
  const classes = useBarStyles();
  const { weight, setWeight } = hooks.useDefaultBar(propWeight);
  const [unit, setUnit] = React.useState(weight.getUnit());
  const [plateConfig, setPlateConfig] = React.useState<t.PlateConfig>();
  const [consolidate, setConsolidate] = React.useState(true);

  const resetBar = React.useCallback(() => {
    setWeight((old) => t.Weight.bar(old.getUnit()));
  }, [setWeight]);

  const onPlateClick = React.useCallback(
    (weight: t.Weight) => () => {
      setWeight((old) => old.add(weight.multiply(2)));
    },
    [setWeight]
  );

  React.useEffect(() => {
    onWeightChange(weight);
  }, [weight, onWeightChange]);

  React.useEffect(() => {
    setWeight((weight) => {
      if (t.Weight.bar(weight.getUnit()).equals(weight)) {
        return t.Weight.bar(unit);
      }
      return weight.toUnit(unit);
    });
  }, [unit, setWeight]);

  // TODO - add round down to nearest plate option for when the requested weight
  // cannot be made exactly.

  return (
    <>
      <Bar
        consolidate={consolidate || undefined}
        weight={weight}
        showWeight
        unit={unit}
        setWeight={setWeight}
        plateConfig={plateConfig}
        updatePlateConfig={setPlateConfig}
      />
      <PlateButtons
        plateConfig={plateConfig}
        unit={unit}
        onClick={onPlateClick}
      />
      <div className={classes.bottomRow}>
        <Button color="secondary" variant="outlined" onClick={resetBar}>
          Clear Bar
        </Button>
        <FormControlLabel
          control={
            <Checkbox
              checked={consolidate}
              onChange={(e) => setConsolidate(e.target.checked)}
            />
          }
          label="Consolidate"
        />
        <SelectUnit label="Plate Unit" initial={unit} update={setUnit} />
      </div>
    </>
  );
};

export default BarInput;
