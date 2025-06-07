import React from "react";
import Box from "@mui/material/Box";
import { minimalPlates, DEFAULT_PLATE_SIZES } from "@/util";

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

export const metalGradient =
  "linear-gradient(180deg, hsl(0,0%,78%) 0%, hsl(0,0%,90%) 47%, hsl(0,0%,78%) 53%, hsl(0,0%,70%) 100%)";

export const PLATE_COLORS: Record<number, { bg: string; fg: string }> = {
  45: { bg: "red", fg: "white" },
  35: { bg: "blue", fg: "white" },
  25: { bg: "yellow", fg: "black" },
  10: { bg: "green", fg: "white" },
  5: { bg: "black", fg: "white" },
  2.5: { bg: "pink", fg: "black" },
};

export interface BarbellProps {
  weight: number;
  barWeight?: number;
  plateSizes?: number[];
  /**
   * If true, use fixed pixel sizes for plates/bar instead of viewport-relative units.
   * Useful for small displays like tables.
   */
  fixedSize?: boolean;
  /**
   * If true, do not show the plate numbers (for compact display).
   */
  hidePlateNumbers?: boolean;
}

const Barbell: React.FC<BarbellProps> = ({
  weight,
  barWeight = 45,
  plateSizes = DEFAULT_PLATE_SIZES,
  fixedSize = false, // deprecated, kept for backward compatibility
  hidePlateNumbers = false,
}) => {
  // Calculate the plate list for one side
  const plateList = minimalPlates((weight - barWeight) / 2, plateSizes);

  // Instead of using vw or px, use 100% width and calculate all sizes relative to that
  // The parent container should control the width of the Barbell
  // We'll use a ref to measure the width and set all dimensions based on that
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = React.useState<number>(0);

  React.useLayoutEffect(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.offsetWidth);
    }
  }, []);

  // Listen for resize
  React.useEffect(() => {
    if (!containerRef.current) return;
    const handleResize = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fallback width if not measured yet
  const width = containerWidth || 300;

  // All dimensions are now calculated from width
  const _barWidth = width;
  const _barHeight = width * aspectRatio;
  const _plateWidth = (plateWidthMM / barWidthMM) * _barWidth;
  const _plateHeight = (plateHeightMM / barWidthMM) * _barWidth;
  const _5Height = (_plateHeight * 2) / 3;
  const _2_5Height = _plateHeight / 2;
  const _sleeveWidth = (sleeveWidthMM / barWidthMM) * _barWidth;
  const _sleeveHeight = (sleeveHeightMM / barWidthMM) * _barWidth;
  const _bushingWidth = (bushingWidthMM / barWidthMM) * _barWidth;
  const _bushingHeight = (bushingHeightMM / barWidthMM) * _barWidth;
  const _shaftWidth = (shaftWidthMM / barWidthMM) * _barWidth;
  const _shaftHeight = (shaftHeightMM / barWidthMM) * _barWidth;

  // Plate color/height helpers
  const PLATE_HEIGHTS: Record<number, number> = {
    45: _plateHeight,
    25: _plateHeight,
    10: _plateHeight,
    5: _5Height,
    2.5: _2_5Height,
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
        const height = PLATE_HEIGHTS[value] || _plateHeight;
        return (
          <Box
            key={`${value}-${idx}`}
            sx={{
              width: `${_plateWidth}px`,
              height: `${height}px`,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              color: color.fg,
              border: "0.5px solid black",
              borderRadius: "3px",
              backgroundColor: color.bg,
              alignItems: "center",
            }}
          >
            {!hidePlateNumbers && (
              <Box
                sx={{
                  transform:
                    side === "left" ? "rotate(270deg)" : "rotate(90deg)",
                  fontSize: `${_plateWidth}px`,
                  lineHeight: 1,
                }}
              >
                {value}
              </Box>
            )}
          </Box>
        );
      })}
    </>
  );

  return (
    <Box
      ref={containerRef}
      sx={{
        width: "100%",
        height: `${_barHeight}px`,
        display: "flex",
        alignItems: "center",
        margin: 0,
        minWidth: 60,
        minHeight: 16,
      }}
    >
      <Box
        sx={{
          width: `${_sleeveWidth}px`,
          height: `${_sleeveHeight}px`,
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
          width: `${_bushingWidth}px`,
          height: `${_bushingHeight}px`,
          background: metalGradient,
        }}
      />
      <Box
        sx={{
          width: `${_shaftWidth}px`,
          height: `${_shaftHeight}px`,
          background: metalGradient,
          textAlign: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      />
      <Box
        sx={{
          width: `${_bushingWidth}px`,
          height: `${_bushingHeight}px`,
          background: metalGradient,
        }}
      />
      <Box
        sx={{
          width: `${_sleeveWidth}px`,
          height: `${_sleeveHeight}px`,
          display: "flex",
          alignItems: "center",
          background: metalGradient,
        }}
      >
        <Plates plates={plateList} side="right" />
      </Box>
    </Box>
  );
};

export default Barbell;
