"use client";
import { WeightUnit } from "@/common-types";
import { weightUnitUIString } from "@/uiStrings";
import { Typography, TypographyProps, useTheme } from "@mui/material";
import React from "react";

interface DisplayWeightProps {
  weightValue: number;
  weightUnit: WeightUnit;
  reps?: number;
  repsAMRAP?: boolean;
  variant?: TypographyProps["variant"];
  sx?: TypographyProps["sx"];
  hideUnit?: boolean;
  valueColor?: string;
  startAdornment?: React.ReactNode | string;
  endAdornment?: React.ReactNode | string;
}
const DisplayWeight: React.FC<DisplayWeightProps> = (props) => {
  const theme = useTheme();
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
      <span style={{ color: props.valueColor || theme.palette.primary.main }}>
        {formattedWeight}{" "}
        {!props.hideUnit && weightUnitUIString(props.weightUnit)}
      </span>
      {props.reps && (
        <>
          <span>&nbsp;x&nbsp;</span>
          <span style={{ color: theme.palette.secondary.main }}>
            {props.reps}
            {props.repsAMRAP ? " (AMRAP)" : ""}
          </span>
        </>
      )}
      {props.endAdornment}
    </Typography>
  );
};

export default DisplayWeight;
