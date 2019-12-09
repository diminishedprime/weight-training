import * as React from "react";
import * as util from "./util";
import * as t from "./types";

const PlatesFor = ({
  side,
  plates
}: {
  side: "left" | "right";
  plates: [t.PlateTypes, number][];
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
                  className={`plate _${t.PlateWeight[type]}`}
                >
                  <div className="sideways-text">{t.PlateWeight[type]}</div>
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
  let plates: [t.PlateTypes, number][] = [];
  if (plateConfig !== "not-possible") {
    plates = Object.entries(util.splitConfig(plateConfig)).filter(
      ([_, count]) => count > 0
    ) as [t.PlateTypes, number][];
  }
  return (
    <div className="bar-wrapper">
      <div className="sleeve left">
        <PlatesFor side="left" plates={plates} />
      </div>
      <div className="bushing"></div>
      <div className="shaft"></div>
      <div className="bushing"></div>
      <div className="sleeve right">
        <PlatesFor side="right" plates={plates} />
      </div>
    </div>
  );
};
