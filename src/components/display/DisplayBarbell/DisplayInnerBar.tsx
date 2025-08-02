import { RoundingMode, WeightUnit } from "@/common-types";
import DisplayWeight from "@/components/display/DisplayWeight";
import { actualWeightForTarget } from "@/util";
import { Box, Stack, Typography } from "@mui/material";
import {
  BAR_WIDTH_MM,
  INNER_BAR_DIAMETER_MM,
  INNER_BAR_WIDTH_MM,
  metalGradient,
} from ".";

interface DisplayInnerBarProps {
  showWeight?: boolean;
  weightUnit: WeightUnit;
  showDifference?: boolean;
  actualWeightValue: number | undefined;
  targetWeightValue: number;
  availablePlates: number[];
  roundingMode: RoundingMode;
}

const DisplayInnerBar: React.FC<DisplayInnerBarProps> = (props) => {
  const {
    showWeight,
    weightUnit,
    showDifference,
    targetWeightValue,
    availablePlates,
    roundingMode,
    actualWeightValue = actualWeightForTarget(
      targetWeightValue,
      45,
      availablePlates,
      roundingMode,
    ).actualWeight,
  } = props;
  // We're okay calling weight that's less than 0.1 different than the target as
  // "the same" even though technically it's different.
  const round1 = (n: number) => Math.round(n * 10) / 10;
  const diff = actualWeightValue - targetWeightValue;
  const underOver = diff > 0 ? "over" : "under";
  const differenceColor = diff > 0 ? "error" : "warning";
  const valuesMatch = round1(actualWeightValue) === round1(targetWeightValue);

  return (
    <Box
      sx={{
        width: `${(INNER_BAR_WIDTH_MM / BAR_WIDTH_MM) * 100}%`,
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {showWeight && (
        <Typography
          sx={{
            position: "absolute",
            top: 0,
            left: "50%",
            transform: "translate(-50%, -100%)",
            background: "rgba(255,255,255,0.7)",
          }}
          data-testid="inner-bar-weight"
        >
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
      {showDifference && !valuesMatch && (
        <Stack
          direction="row"
          alignItems="center"
          sx={{
            position: "absolute",
            left: "50%",
            bottom: 0,
            transform: "translate(-50%, 100%)",
          }}
          data-testid="inner-bar-target-weight"
        >
          <DisplayWeight
            variant="caption"
            valueColor={differenceColor}
            weightValue={Math.abs(diff)}
            weightUnit={weightUnit}
            hideUnit
          />
          <Typography variant="body1">
            {"\u00A0"}
            {underOver}
            {"\u00A0"}
          </Typography>
          <DisplayWeight
            variant="caption"
            valueColor={differenceColor}
            weightValue={targetWeightValue}
            weightUnit={weightUnit}
            hideUnit
          />
        </Stack>
      )}
    </Box>
  );
};

export default DisplayInnerBar;
