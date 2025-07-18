"use client";
import { WeightUnit } from "@/common-types";
import { weightUnitUIString } from "@/uiStrings";
import { Typography, TypographyProps, useTheme } from "@mui/material";
import React from "react";

interface PrettyWeightProps {
  weightValue: number;
  weightUnit: WeightUnit;
  reps?: number;
  variant?: TypographyProps["variant"];
  sx?: TypographyProps["sx"];
}
const PrettyWeight: React.FC<PrettyWeightProps> = (props) => {
  const theme = useTheme();
  return (
    <Typography component="span" variant={props.variant} sx={props.sx}>
      <span style={{ color: theme.palette.primary.main }}>
        {props.weightValue} {weightUnitUIString(props.weightUnit)}
      </span>
      {props.reps && (
        <>
          <span> x </span>
          <span style={{ color: theme.palette.secondary.main }}>
            {props.reps}
          </span>
        </>
      )}
    </Typography>
  );
};

export default PrettyWeight;
