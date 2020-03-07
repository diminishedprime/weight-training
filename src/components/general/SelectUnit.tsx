import React from "react";
import Select from "./Select";
import * as t from "../../types";

interface SelectUnitProps {
  update: (unit: t.WeightUnit) => void;
  initial?: t.WeightUnit;
}

const SelectUnit: React.FC<SelectUnitProps> = ({ update, initial }) => {
  return (
    <Select<t.WeightUnit>
      toValue={(unit) => unit}
      toText={(unit) => {
        switch (unit) {
          case t.WeightUnit.KILOGRAM:
            return "Kilogram";
          case t.WeightUnit.POUND:
            return "Pound";
        }
      }}
      label="Units"
      update={update}
      initial={initial}
      options={Object.values(t.WeightUnit)}
    />
  );
};

export default SelectUnit;
