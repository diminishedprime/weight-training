import * as React from "react";
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

export default ({
  weight,
  showWeight,
  unit
}: {
  weight: t.Weight;
  unit?: t.WeightUnit;
  showWeight?: true;
}) => {
  const plates = React.useMemo(() => {
    return util.platesFor(weight || t.Weight.bar(unit));
  }, [weight, unit]);
  return (
    <div className="bar-wrapper">
      <div className="sleeve left metal">
        {plates !== "not-possible" && <PlatesFor side="left" plates={plates} />}
      </div>
      <div className="bushing metal"></div>
      <div className="shaft metal">
        {plates !== "not-possible" && showWeight && (
          <div>{weight.display()}</div>
        )}
        {plates === "not-possible" && (
          <div>Not Possible: {weight.display()}</div>
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
