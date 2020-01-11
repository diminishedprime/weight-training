import * as React from "react";
import * as c from "../constants";
import * as t from "../types";
import * as util from "../util";

const PlatesFor = ({
  side,
  plates,
}: {
  side: "left" | "right";
  plates: Array<[t.PlateTypes, number]>;
}) => {
  return (
    <>
      {plates.map(([type, count]) => {
        return (
          <React.Fragment key={`${side}-${type}`}>
            {util.range(count).map((_, plateIdx) => {
              return (
                <div
                  key={`left-${type}-${plateIdx}`}
                  className={`plate _${c.plateWeight[type]}`}
                >
                  <div className="sideways-text">{c.plateWeight[type]}</div>
                </div>
              );
            })}
          </React.Fragment>
        );
      })}
    </>
  );
};

export default ({ plateConfig }: { plateConfig: t.PlateConfig }) => {
  let plates: Array<[t.PlateTypes, number]> = [];
  if (plateConfig !== "not-possible") {
    plates = Object.entries(util.splitConfig(plateConfig)).filter(
      ([_, count]) => count > 0,
    ) as Array<[t.PlateTypes, number]>;
  }
  return (
    <div className="bar-wrapper">
      <div className="sleeve left metal">
        <PlatesFor side="left" plates={plates} />
      </div>
      <div className="bushing metal"></div>
      <div className="shaft metal"></div>
      <div className="bushing metal"></div>
      <div className="sleeve right metal">
        <PlatesFor side="right" plates={plates} />
      </div>
    </div>
  );
};
