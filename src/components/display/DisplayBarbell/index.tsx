import { RoundingMode, WeightUnit } from "@/common-types";
import DisplayCollar from "@/components/display/DisplayBarbell/DisplayCollar";
import DisplayInnerBar from "@/components/display/DisplayBarbell/DisplayInnerBar";
import DisplaySleeve from "@/components/display/DisplayBarbell/DisplaySleeve";
import { actualWeightForTarget, minimalPlatesForTargetWeight } from "@/util";
import { Box } from "@mui/material";

// Overall width of the barbell.
export const BAR_WIDTH_MM = 2200;

export const SLEEVE_WIDTH_MM = 410;
export const SLEEVE_DIAMETER_MM = 50;

export const COLLAR_WIDTH_MM = 35;
// This is just a guess, need a real-world measurement.
export const COLLAR_DIAMETER_MM = 75;

export const INNER_BAR_WIDTH_MM = 1310;
export const INNER_BAR_DIAMETER_MM = 28;

// Not verified.
export const PLATE_METADATA: Record<
  number,
  {
    widthMM: number;
    diameterMM: number;
    sx: {
      backgroundColor: string;
      color: string;
      borderRadius: string;
      border: string;
    };
  }
> = {
  55: {
    widthMM: 83,
    diameterMM: 450,
    sx: {
      backgroundColor: "red",
      color: "white",
      borderRadius: "1px",
      border: ".3px solid black",
    },
  },
  45: {
    widthMM: 52,
    diameterMM: 450,
    sx: {
      backgroundColor: "red",
      color: "white",
      borderRadius: "1px",
      border: ".3px solid black",
    },
  },
  35: {
    widthMM: 43,
    diameterMM: 450,
    sx: {
      backgroundColor: "blue",
      color: "black",
      borderRadius: "1px",
      border: ".3px solid black",
    },
  },
  25: {
    widthMM: 36,
    diameterMM: 450,
    sx: {
      backgroundColor: "yellow",
      color: "black",
      borderRadius: "1px",
      border: ".3px solid black",
    },
  },
  10: {
    widthMM: 21.5,
    diameterMM: 450,
    sx: {
      backgroundColor: "green",
      color: "white",
      borderRadius: "1px",
      border: ".3px solid black",
    },
  },
  5: {
    widthMM: 21.5,
    diameterMM: 225,
    sx: {
      backgroundColor: "black",
      color: "white",
      borderRadius: "1px",
      border: ".3px solid black",
    },
  },
  2.5: {
    widthMM: 0.55 * 25.4,
    diameterMM: 6.55 * 25.4,
    sx: {
      backgroundColor: "green",
      color: "white",
      borderRadius: "1px",
      border: ".3px solid black",
    },
  },
  // Guess
  1.25: {
    widthMM: 0.47 * 25.4,
    diameterMM: 6.55 * 25.4,
    sx: {
      backgroundColor: "white",
      color: "white",
      borderRadius: "1px",
      border: ".3px solid black",
    },
  },
};

export const MAX_DIAMETER_MM = Math.max(
  SLEEVE_DIAMETER_MM,
  COLLAR_DIAMETER_MM,
  INNER_BAR_DIAMETER_MM,
  ...Object.values(PLATE_METADATA).map((p) => p.diameterMM),
);

export interface DisplayBarbellProps {
  weightUnit: WeightUnit;
  targetWeightValue: number;
  barWeightValue: number;
  roundingMode: RoundingMode;
  availablePlates: number[];
  showPlateNumbers?: boolean;
  showWeight?: boolean;
  showDifference?: boolean;
}

export const metalGradient =
  "linear-gradient(180deg, hsl(0,0%,78%) 0%, hsl(0,0%,90%) 47%, hsl(0,0%,78%) 53%, hsl(0,0%,70%) 100%)";

const DisplayBarbell: React.FC<DisplayBarbellProps> = (props) => {
  const { plates } = minimalPlatesForTargetWeight(
    props.targetWeightValue,
    props.barWeightValue,
    props.availablePlates,
    props.roundingMode,
  );
  const { actualWeight } = actualWeightForTarget(
    props.targetWeightValue,
    props.barWeightValue,
    plates,
    props.roundingMode,
  );
  return (
    <Box
      sx={{
        width: "100%",
        aspectRatio: `${BAR_WIDTH_MM} / ${MAX_DIAMETER_MM}`,
        display: "flex",
        alignItems: "center",
      }}
    >
      <DisplaySleeve
        side="left"
        plates={plates}
        showPlateNumbers={props.showPlateNumbers}
      />
      <DisplayCollar side="left" />
      <DisplayInnerBar
        weightUnit={props.weightUnit}
        showWeight={props.showWeight}
        actualWeightValue={actualWeight}
        targetWeightValue={props.targetWeightValue}
        showDifference={props.showDifference}
      />
      <DisplayCollar side="right" />
      <DisplaySleeve
        side="right"
        plates={plates}
        showPlateNumbers={props.showPlateNumbers}
      />
    </Box>
  );
};

export default DisplayBarbell;
