import React from "react";
import * as t from "../../types";
import Select from "./Select";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  select: {
    "min-width": "5em"
  }
}));

interface SelectUnitProps {
  update: (unit: t.WeightUnit) => void;
  label?: string;
  initial?: t.WeightUnit;
}

const SelectUnit: React.FC<SelectUnitProps> = ({ update, initial, label }) => {
  const classes = useStyles();
  return (
    <Select<t.WeightUnit>
      className={classes.select}
      toValue={(unit) => unit}
      toText={(unit) => {
        switch (unit) {
          case t.WeightUnit.KILOGRAM:
            return "Kg";
          case t.WeightUnit.POUND:
            return "Lb";
        }
      }}
      label={label || "Units"}
      update={update}
      initial={initial}
      options={Object.values(t.WeightUnit)}
    />
  );
};

export default SelectUnit;
