import * as React from "react";
import AutosizeInput from "react-input-autosize";
import * as t from "../types";
import * as util from "../util";

const PlatesFor = ({
  side,
  plates
}: {
  side: "left" | "right";
  plates: t.Plate[];
}) => {
  return (
    <>
      {plates.map((plate, idx) => {
        return (
          <React.Fragment key={`${side}-${idx}`}>
            <div className={`plate ${plate.cssClass}`}>
              <div className="sideways-text">{plate.weight.display()}</div>
            </div>
          </React.Fragment>
        );
      })}
    </>
  );
};

interface ShowWeightProps {
  weight: t.Weight;
  setWeight?: React.Dispatch<React.SetStateAction<t.Weight>>;
}

const ShowWeight: React.FC<ShowWeightProps> = ({ weight, setWeight }) => {
  const [asText, setAsText] = React.useState<string | undefined>(
    weight.getValue().toString()
  );

  React.useEffect(() => {
    setAsText(
      weight
        .getValue()
        .toFixed(1)
        .replace(".0", "")
    );
  }, [weight]);

  const updateWeight = React.useCallback(() => {
    if (asText !== undefined && asText !== "" && setWeight !== undefined) {
      setWeight((old) => t.Weight.forUnit(old.getUnit())(parseInt(asText, 10)));
    }
  }, [asText, setWeight]);

  return (
    <AutosizeInput
      className="weight-input"
      type="number"
      style={{ fontSize: "1.0em" }}
      onFocus={(e) => e.target.select()}
      onBlur={() => updateWeight()}
      onChange={(e) => setAsText(e.target.value)}
      value={asText}
    />
  );
};

interface BarProps {
  weight: t.Weight;
  unit?: t.WeightUnit;
  showWeight?: true;
  setWeight?: React.Dispatch<React.SetStateAction<t.Weight>>;
  updatePlateConfig?: (config: t.PlateConfig) => void;
}

export const Bar: React.FC<BarProps> = ({
  weight,
  showWeight,
  unit,
  setWeight,
  updatePlateConfig
}) => {
  const plates = React.useMemo(() => {
    return util.platesFor(weight || t.Weight.bar(unit));
  }, [weight, unit]);

  React.useEffect(() => {
    if (updatePlateConfig !== undefined) {
      updatePlateConfig(plates);
    }
  }, [plates, updatePlateConfig]);
  return (
    <div className="bar-wrapper">
      <div className="sleeve left metal">
        {plates !== "not-possible" && <PlatesFor side="left" plates={plates} />}
      </div>
      <div className="bushing metal"></div>
      <div className="shaft metal">
        {plates !== "not-possible" && showWeight && (
          <div className="flex flex-center">
            <ShowWeight weight={weight} setWeight={setWeight} />
            <span>{weight.getUnit()}</span>
          </div>
        )}
        {plates === "not-possible" && (
          <div>
            <span>
              Cannot make{" "}
              <span className="has-text-primary">{weight.display()}</span> with
              the available plates.
            </span>
          </div>
        )}
      </div>
      <div className="bushing metal"></div>
      <div className="sleeve right metal">
        {plates !== "not-possible" && (
          <PlatesFor side="right" plates={plates} />
        )}
      </div>
    </div>
  );
};

export default Bar;
