import * as React from "react";
import Bar from "../components/Bar";
import * as hooks from "../hooks";
import * as t from "../types";
import * as util from "../util";
import SelectUnit from "./SelectUnit";

interface PlateButtonsProps {
  unit: t.WeightUnit;
  onClick: (weight: t.Weight) => () => void;
}

const PlateButtons: React.FC<PlateButtonsProps> = ({ unit, onClick }) => {
  const plates = util.platesForUnit(unit);
  return (
    <div className="flex flex-around m-margin-bottom">
      {plates.map((plate) => (
        <button
          key={plate.weight.display()}
          className="button flex-grow"
          onClick={onClick(plate.weight)}
        >
          {plate.weight.display()}
        </button>
      ))}
    </div>
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
  const [unit, setUnit] = React.useState(weight.unit);

  const resetBar = React.useCallback(() => {
    setWeight((old) => t.Weight.bar(old.unit));
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
      if (t.Weight.bar(weight.unit).equals(weight)) {
        return t.Weight.bar(unit);
      }
      return weight.toUnit(unit);
    });
  }, [unit, setWeight]);

  // TODO - add round down to nearest plate option for when the requested weight
  // cannot be made exactly.

  // TODO - add toggle for whether or not plates should be consolidated
  // automatically.

  return (
    <>
      <Bar weight={weight} showWeight unit={unit} />
      <PlateButtons unit={unit} onClick={onPlateClick} />
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
