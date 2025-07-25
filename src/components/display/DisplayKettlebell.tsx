"use client";
import { WeightUnit } from "@/common-types";
import DisplayWeight from "@/components/display/DisplayWeight";
import { useTheme } from "@mui/material/styles";

interface DisplayKettlebellProps {
  weightValue: number;
  weightUnit: WeightUnit;
  size: number | undefined;
  selected?: boolean;
  onClick?: () => void;
}

const DisplayKettlebell: React.FC<DisplayKettlebellProps> = (props) => {
  const theme = useTheme();
  const containerWidth = theme.spacing((props.size || 12) * (73 / 93));
  const containerHeight = theme.spacing(props.size || 12);

  const defaultKettlebellColor = "#333";

  // Define the solid outline filter
  // We apply multiple drop-shadows with 0 blur and 1px offset in each direction
  const solidOutlineFilter = props.selected
    ? `
        drop-shadow(1px 0px 0px ${theme.palette.primary.main})
        drop-shadow(-1px 0px 0px ${theme.palette.primary.main})
        drop-shadow(0px 1px 0px ${theme.palette.primary.main})
        drop-shadow(0px -1px 0px ${theme.palette.primary.main})
        drop-shadow(1px 1px 0px ${theme.palette.primary.main}) /* Diagonals for smoother corners */
        drop-shadow(-1px -1px 0px ${theme.palette.primary.main})
        drop-shadow(1px -1px 0px ${theme.palette.primary.main})
        drop-shadow(-1px 1px 0px ${theme.palette.primary.main})
      `
    : "none";

  return (
    <div
      onClick={props.onClick}
      style={{
        position: "relative",
        width: containerWidth,
        height: containerHeight,
        display: "inline-block",
      }}
    >
      <svg
        viewBox="7 -2 34 44"
        style={{
          filter: solidOutlineFilter, // Apply the solid outline filter here
          overflow: "visible", // Ensure the shadow is not clipped
        }}
      >
        {/* Define the clipping path */}
        <defs>
          <clipPath id="kettlebellBodyClip">
            <rect x="7" y="-2" width="34" height="43.6" />
          </clipPath>
        </defs>

        <g>
          {/* Handle parts - these do not need clipping */}
          <path
            d="M14 10 a10 10 0 0 1 20 0"
            fill="none"
            stroke={defaultKettlebellColor}
            strokeWidth="4"
          />
          <rect
            x="12"
            y="10"
            width="4"
            height="10"
            fill={defaultKettlebellColor}
          />
          <rect
            x="32"
            y="10"
            width="4"
            height="10"
            fill={defaultKettlebellColor}
          />

          {/* Kettlebell body - apply the clipping path here */}
          <circle
            cx="24"
            cy="28"
            r="16"
            fill={defaultKettlebellColor}
            stroke={defaultKettlebellColor}
            strokeWidth="2"
            clipPath="url(#kettlebellBodyClip)" // Apply the clipping path
          />
        </g>
      </svg>
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "70%",
          transform: "translate(-50%, -50%)",
          pointerEvents: "none",
          textAlign: "center",
          width: "100%",
          fontSize: "0.3em",
          fontWeight: "bold",
        }}
      >
        <DisplayWeight {...props} />
      </div>
    </div>
  );
};

export default DisplayKettlebell;
