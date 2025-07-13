import React from "react";
import Box from "@mui/material/Box";
import { minimalPlates } from "@/util";
import { PLATE_COLORS } from "@/constants";

const barWidthMM = 2200;
const sleeveWidthMM = 445;
const bushingWidthMM = 30;
const shaftWidthMM = 1310;
const plateWidthMM = 56;
const sleeveHeightMM = 50;
const bushingHeightMM = 70;
const shaftHeightMM = 28;
const plateHeightMM = 450;
const aspectRatio = 0.2;

export const metalGradient =
  "linear-gradient(180deg, hsl(0,0%,78%) 0%, hsl(0,0%,90%) 47%, hsl(0,0%,78%) 53%, hsl(0,0%,70%) 100%)";

export interface BarbellProps {
  weight: number;
  barWeight?: number;
  availablePlates: number[];
  hidePlateNumbers?: boolean;
}

const Barbell: React.FC<BarbellProps> = ({
  weight,
  barWeight = 45,
  availablePlates,
  hidePlateNumbers = false,
}) => {
  // Calculate the plate list for one side
  const plateList = minimalPlates((weight - barWeight) / 2, availablePlates);

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
            }}>
            {!hidePlateNumbers && (
              <Box
                sx={{
                  transform:
                    side === "left" ? "rotate(270deg)" : "rotate(90deg)",
                  fontSize: `${_plateWidth}px`,
                  lineHeight: 1,
                }}>
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
      }}>
      <Box
        sx={{
          width: `${_sleeveWidth}px`,
          height: `${_sleeveHeight}px`,
          display: "flex",
          alignItems: "center",
          background: metalGradient,
          justifyContent: "flex-end",
        }}>
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
        }}>
        <Plates plates={plateList} side="right" />
      </Box>
    </Box>
  );
};

export default Barbell;
