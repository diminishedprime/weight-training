"use client";
import { WeightUnit } from "@/common-types";
import { weightUnitUIString } from "@/uiStrings";
import { Typography, TypographyProps } from "@mui/material";
import React from "react";

export interface Props {
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
  column?: boolean;
  noDecimals?: boolean;
}
const DisplayWeight: React.FC<Props> = (props) => {
  const { weightValue } = props;

  const oneDecimal = Math.floor(weightValue) === weightValue;
  const twoDecimals = Math.floor(weightValue * 10) === weightValue * 10;
  const fixedDecimals = props.noDecimals
    ? 0
    : oneDecimal
      ? 0
      : twoDecimals
        ? 2
        : 1;
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
        flexDirection: props.column ? "column" : "row",
        flexWrap: "wrap",
        ...props.sx,
      }}
    >
      {props.startAdornment}
      <Typography
        component="span"
        color={props.valueColor || "primary"}
        variant="inherit"
      >
        {formattedWeight}{" "}
        {!props.hideUnit && weightUnitUIString(props.weightUnit)}
      </Typography>
      {props.reps && (
        <>
          <span>&nbsp;x&nbsp;</span>
          <Typography component="span" color="secondary" variant="inherit">
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
