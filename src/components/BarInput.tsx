import * as React from "react";
import Bar from "../components/Bar";
import * as hooks from "../hooks";
import * as t from "../types";
import * as util from "../util";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Badge from "@material-ui/core/Badge";
import SelectUnit from "./SelectUnit";

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
          <Badge badgeContent={numPlates}>
            <Button
              key={plate.weight.display()}
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

const BarInput: React.FC<BarInputProps> = ({
  weight: propWeight,
  onWeightChange
}) => {
  const { weight, setWeight } = hooks.useDefaultBar(propWeight);
  const [unit, setUnit] = React.useState(weight.getUnit());
  const [plateConfig, setPlateConfig] = React.useState<t.PlateConfig>(
    "not-possible"
  );

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

  // TODO - add toggle for whether or not plates should be consolidated
  // automatically.

  // TODO - add badges to the buttons for adding plates.

  return (
    <>
      <Bar
        weight={weight}
        showWeight
        unit={unit}
        setWeight={setWeight}
        updatePlateConfig={setPlateConfig}
      />
      <PlateButtons
        plateConfig={plateConfig}
        unit={unit}
        onClick={onPlateClick}
      />
      <div className="flex flex-between">
        <button className="button is-danger is-outlined" onClick={resetBar}>
          Clear Bar
        </button>
        <div className="flex flex-center">
          <label className="label sm-margin-right">Plate Type</label>
          <SelectUnit unit={unit} onUnitChange={setUnit} />
        </div>
      </div>
    </>
  );
};

export default BarInput;
