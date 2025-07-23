import { metalGradient } from "@/components/display/DisplayBarbell";
import { Database } from "@/database.types";
import Box from "@mui/material/Box";
import React from "react";

// Dumbbell dimensions for aspect ratio calculation
const TOTAL_WIDTH = 160;
const TOTAL_HEIGHT = 48;
const HANDLE_HEIGHT = 10;

export interface DisplayDumbbellProps {
  /** The weight value to display on the dumbbell */
  weight: number;
  /** The unit of weight measurement */
  weightUnit: Database["public"]["Enums"]["weight_unit_enum"];
  /** Width of the dumbbell component (CSS units) */
  width?: string | number;
  /** Whether to hide the weight text on the bulbs */
  hideText?: boolean;
}

interface DumbbellBulbProps {
  /** The weight value to display */
  weight: number;
  /** Width percentage of the bulb */
  widthPercent: number;
  /** Font size percentage */
  fontSizePercent: number;
  /** Background color of the bulb */
  color: string;
  /** Whether to hide the weight text */
  hideText?: boolean;
}

// Bulb component for both sides of the dumbbell
const DumbbellBulb: React.FC<DumbbellBulbProps> = ({
  weight,
  widthPercent,
  fontSizePercent,
  color,
  hideText,
}) => {
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
};

const DisplayDumbbell: React.FC<DisplayDumbbellProps> = ({
  weight,
  weightUnit: _,
  width = "30%",
  hideText = false,
}) => {
  // Calculate bulb and handle dimensions based on weight
  const bulbColor = "black";
  const bulbWidthPercent = 8 + weight / 8;
  const handleWidthPercent = 30;
  const fontSizePercent = 100;

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: width,
        aspectRatio: `${TOTAL_WIDTH} / ${TOTAL_HEIGHT}`,
        userSelect: "none",
        position: "relative",
        minWidth: 60,
        minHeight: 10,
        margin: "0 auto",
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
          height: `${(HANDLE_HEIGHT / TOTAL_HEIGHT) * 100}%`,
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
};

export default DisplayDumbbell;
