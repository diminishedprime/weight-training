import { Box } from "@mui/material";
import {
  BAR_WIDTH_MM,
  COLLAR_DIAMETER_MM,
  COLLAR_WIDTH_MM,
  metalGradient,
} from ".";

interface DisplayCollarProps {
  side: "left" | "right";
}

const DisplayCollar: React.FC<DisplayCollarProps> = () => {
  return (
    <Box
      sx={{
        width: `${(COLLAR_WIDTH_MM / BAR_WIDTH_MM) * 100}%`,
        aspectRatio: `${COLLAR_WIDTH_MM} / ${COLLAR_DIAMETER_MM}`,
        background: metalGradient,
      }}
    />
  );
};

export default DisplayCollar;
