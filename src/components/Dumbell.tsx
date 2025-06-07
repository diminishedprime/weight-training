import React from "react";
import Box from "@mui/material/Box";
import { Database } from "@/database.types";
import { metalGradient } from "./Barbell";

const TotalWidth = 160;
const TotalHeight = 48; // Reduce from 82 to 48 for less vertical space
const HandleHeight = 10; // Reduce handle height for a slimmer look

export interface DumbbellProps {
  weight: number;
  weightUnit: Database["public"]["Enums"]["weight_unit_enum"];
  width?: string | number; // px, %, etc.
  hideText?: boolean;
}

// Bulb component for both sides
function DumbbellBulb({
  weight,
  widthPercent,
  fontSizePercent,
  color,
  hideText,
}: {
  weight: number;
  widthPercent: number;
  fontSizePercent: number;
  color: string;
  hideText?: boolean;
}) {
  return (
    <Box
      sx={{
        width: `${widthPercent}%`,
        height: "100%",
        background: color,
        borderRadius: "10%",
        color: "white",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontWeight: "bold",
        fontSize: `${fontSizePercent}%`,
        p: hideText ? "unset" : 1,
      }}
    >
      {!hideText && <>{weight}</>}
    </Box>
  );
}

export default function Dumbbell({
  weight,
  weightUnit: _,
  width = "30%",
  hideText = false,
}: DumbbellProps) {
  const bulbColor = "black";
  const bulbWidthPercent = 8 + weight / 8;
  const handleWidthPercent = 30;
  const fontSizePercent = 100; // Slightly smaller font for compactness

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center", // <-- add this to center horizontally
        width: width,
        aspectRatio: `${TotalWidth} / ${TotalHeight}`,
        userSelect: "none",
        position: "relative",
        minWidth: 60,
        minHeight: 10, // Lower min height
        margin: "0 auto", // ensure horizontal centering in parent
      }}
    >
      <DumbbellBulb
        weight={weight}
        widthPercent={bulbWidthPercent}
        fontSizePercent={fontSizePercent}
        color={bulbColor}
        hideText={hideText}
      />
      {/* Handle */}
      <Box
        sx={{
          width: `${handleWidthPercent}%`,
          height: `${(HandleHeight / TotalHeight) * 100}%`,
          background: metalGradient,
          alignSelf: "center",
        }}
      />
      <DumbbellBulb
        weight={weight}
        widthPercent={bulbWidthPercent}
        fontSizePercent={fontSizePercent}
        color={bulbColor}
        hideText={hideText}
      />
    </Box>
  );
}
