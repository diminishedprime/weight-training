import { Box, Stack, Typography } from "@mui/material";
import {
  BAR_WIDTH_MM,
  INNER_BAR_DIAMETER_MM,
  INNER_BAR_WIDTH_MM,
  metalGradient,
} from ".";
import { WeightUnit } from "@/common-types";
import DisplayWeight from "@/components/display/DisplayWeight";

interface DisplayInnerBarProps {
  showWeight?: boolean;
  weightUnit: WeightUnit;
  showDifference?: boolean;
  actualWeightValue: number;
  targetWeightValue: number;
}

const DisplayInnerBar: React.FC<DisplayInnerBarProps> = (props) => {
  const {
    showWeight,
    weightUnit,
    showDifference,
    actualWeightValue,
    targetWeightValue,
  } = props;
  // Calculate difference and color for display
  const diff = actualWeightValue - targetWeightValue;
  const underOver = diff > 0 ? "over" : "under";
  const differenceColor = diff > 0 ? "error" : "warning";

  return (
    <Box
      sx={{
        width: `${(INNER_BAR_WIDTH_MM / BAR_WIDTH_MM) * 100}%`,
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
      {showWeight && (
        <Typography
          sx={{
            position: "absolute",
            top: 0,
            left: "50%",
            transform: "translate(-50%, -100%)",
            background: "rgba(255,255,255,0.7)",
          }}
          data-testid="inner-bar-weight">
          <DisplayWeight
            weightValue={actualWeightValue}
            weightUnit={weightUnit}
          />
        </Typography>
      )}
      <Box
        sx={{
          width: "100%",
          aspectRatio: `${INNER_BAR_WIDTH_MM} / ${INNER_BAR_DIAMETER_MM}`,
          background: metalGradient,
        }}
      />
      {showDifference && targetWeightValue !== actualWeightValue && (
        <Stack
          alignItems="center"
          sx={{
            position: "absolute",
            left: "50%",
            bottom: 0,
            transform: "translate(-50%, 100%)",
          }}
          data-testid="inner-bar-target-weight">
          <Typography color={differenceColor} variant="caption">
            <DisplayWeight
              variant="caption"
              valueColor={differenceColor}
              weightValue={Math.abs(diff)}
              weightUnit={weightUnit}
              hideUnit
            />{" "}
            {underOver}{" "}
            <DisplayWeight
              variant="caption"
              valueColor={differenceColor}
              weightValue={targetWeightValue}
              weightUnit={weightUnit}
              hideUnit
            />
          </Typography>
        </Stack>
      )}
    </Box>
  );
};

export default DisplayInnerBar;
