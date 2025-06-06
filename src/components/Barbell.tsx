import React from "react";
import Box from "@mui/material/Box";

const barWidthMM = 2200;
const sleeveWidthMM = 445;
const bushingWidthMM = 30;
const shaftWidthMM = 1310;
const plateWidthMM = 56;
const sleeveHeightMM = 50;
const bushingHeightMM = 70;
const shaftHeightMM = 28;
const plateHeightMM = 450;
const barWidthVW = 95;
const aspectRatio = 0.2;
const barHeightVW = barWidthVW * aspectRatio;
const sleeveWidthP = (sleeveWidthMM / barWidthMM) * 100;
const sleeveHeightP = (sleeveHeightMM / barWidthMM / aspectRatio) * 100;
const bushingWidthP = (bushingWidthMM / barWidthMM) * 100;
const bushingHeightP = (bushingHeightMM / barWidthMM / aspectRatio) * 100;
const shaftWidthP = (shaftWidthMM / barWidthMM) * 100;
const shaftHeightP = (shaftHeightMM / barWidthMM / aspectRatio) * 100;
const plateWidthVW = ((plateWidthMM / barWidthMM) * barHeightVW) / aspectRatio;
const plateHeightVW =
  ((plateHeightMM / barWidthMM) * barHeightVW) / aspectRatio;
const _5HeightMM = plateHeightMM / 1.5;
const _5HeightVW = ((_5HeightMM / barWidthMM) * barHeightVW) / aspectRatio;
const _2_5HeightMM = plateHeightMM / 2.0;
const _2_5HeightVW = ((_2_5HeightMM / barWidthMM) * barHeightVW) / aspectRatio;

const metalGradient =
  "linear-gradient(180deg, hsl(0,0%,78%) 0%, hsl(0,0%,90%) 47%, hsl(0,0%,78%) 53%, hsl(0,0%,70%) 100%)";

const PLATE_COLORS: Record<number, { bg: string; fg: string }> = {
  45: { bg: "red", fg: "white" },
  25: { bg: "yellow", fg: "black" },
  10: { bg: "green", fg: "white" },
  5: { bg: "black", fg: "white" },
  2.5: { bg: "pink", fg: "black" },
};

const PLATE_HEIGHTS: Record<number, number> = {
  45: plateHeightVW,
  25: plateHeightVW,
  10: plateHeightVW,
  5: _5HeightVW,
  2.5: _2_5HeightVW,
};

const Plates = ({
  plates,
  side,
}: {
  plates: number[];
  side: "left" | "right";
}) => (
  <>
    {(side === "left"
      ? [...plates].sort((a, b) => a - b)
      : [...plates].sort((a, b) => b - a)
    ).map((value, idx) => {
      const color = PLATE_COLORS[value] || { bg: "gray", fg: "white" };
      const heightVW = PLATE_HEIGHTS[value] || plateHeightVW;
      return (
        <Box
          key={`${value}-${idx}`}
          sx={{
            width: `${plateWidthVW}vw`,
            height: `${heightVW}vw`,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            color: color.fg,
            border: "0.5px solid black",
            borderRadius: "3px",
            backgroundColor: color.bg,
          }}
        >
          <Box
            sx={{
              transform: side === "left" ? "rotate(270deg)" : "rotate(90deg)",
              fontSize: `${plateWidthVW}vw`,
            }}
          >
            {value}
          </Box>
        </Box>
      );
    })}
  </>
);

export interface BarbellProps {
  plateList: number[];
}

const Barbell: React.FC<BarbellProps> = ({ plateList }) => (
  <Box
    sx={{
      width: `${barWidthVW}vw`,
      height: `${barHeightVW}vw`,
      display: "flex",
      alignItems: "center",
      margin: "auto",
    }}
  >
    <Box
      sx={{
        width: `${sleeveWidthP}%`,
        height: `${sleeveHeightP}%`,
        display: "flex",
        alignItems: "center",
        background: metalGradient,
        justifyContent: "flex-end",
      }}
    >
      <Plates plates={plateList} side="left" />
    </Box>
    <Box
      sx={{
        width: `${bushingWidthP}%`,
        height: `${bushingHeightP}%`,
        background: metalGradient,
      }}
    />
    <Box
      sx={{
        width: `${shaftWidthP}%`,
        height: `${shaftHeightP}%`,
        background: metalGradient,
        textAlign: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    />
    <Box
      sx={{
        width: `${bushingWidthP}%`,
        height: `${bushingHeightP}%`,
        background: metalGradient,
      }}
    />
    <Box
      sx={{
        width: `${sleeveWidthP}%`,
        height: `${sleeveHeightP}%`,
        display: "flex",
        alignItems: "center",
        background: metalGradient,
      }}
    >
      <Plates plates={plateList} side="right" />
    </Box>
  </Box>
);

export default Barbell;
