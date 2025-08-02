"use client";
import { WeightUnit } from "@/common-types";
import { weightUnitUIString } from "@/uiStrings";
import { Typography, TypographyProps } from "@mui/material";
import React from "react";

interface DisplayWeightProps {
  weightValue: number;
  weightUnit: WeightUnit;
  reps?: number;
  repsAMRAP?: boolean;
  variant?: TypographyProps["variant"];
  sx?: TypographyProps["sx"];
  hideUnit?: boolean;
  valueColor?: TypographyProps["color"];
  startAdornment?: React.ReactNode | string;
  endAdornment?: React.ReactNode | string;
}
const DisplayWeight: React.FC<DisplayWeightProps> = (props) => {
  const { weightValue } = props;

  const oneDecimal = Math.floor(weightValue) === weightValue;
  const twoDecimals = Math.floor(weightValue * 10) === weightValue * 10;
  const fixedDecimals = oneDecimal ? 0 : twoDecimals ? 2 : 1;
  const formattedWeight = props.weightValue.toLocaleString(undefined, {
    minimumFractionDigits: fixedDecimals,
    maximumFractionDigits: fixedDecimals,
  });

  return (
    <Typography
      component="span"
      variant={props.variant}
      sx={{
        display: "flex",
        alignItems: "center",
        flexDirection: "row",
        flexWrap: "wrap",
        ...props.sx,
      }}
    >
      {props.startAdornment}
      <Typography component="span" color={props.valueColor || "primary"}>
        {formattedWeight}{" "}
        {!props.hideUnit && weightUnitUIString(props.weightUnit)}
      </Typography>
      {props.reps && (
        <>
          <span>&nbsp;x&nbsp;</span>
          <Typography component="span" color="secondary">
            {props.reps}
            {props.repsAMRAP ? " (AMRAP)" : ""}
          </Typography>
        </>
      )}
      {props.endAdornment}
    </Typography>
  );
};

export default DisplayWeight;
