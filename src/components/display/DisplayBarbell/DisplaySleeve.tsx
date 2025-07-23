import DisplayPlate from "@/components/display/DisplayBarbell/DisplayPlate";
import { Box } from "@mui/material";
import {
  BAR_WIDTH_MM,
  metalGradient,
  SLEEVE_DIAMETER_MM,
  SLEEVE_WIDTH_MM,
} from ".";

interface DisplaySleeveProps {
  side: "left" | "right";
  plates: number[];
  showPlateNumbers?: boolean;
}

const DisplaySleeve: React.FC<DisplaySleeveProps> = (props) => {
  return (
    <Box
      sx={{
        width: `${(SLEEVE_WIDTH_MM / BAR_WIDTH_MM) * 100}%`,
        // TODO I THINK THIS SHOULD USE MAX DIAMETER
        aspectRatio: `${SLEEVE_WIDTH_MM} / ${SLEEVE_DIAMETER_MM}`,
        position: "relative",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: metalGradient,
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: props.side === "right" ? "row" : "row-reverse",
          alignItems: "stretch",
          zIndex: 1,
        }}
      >
        {props.plates.map((weight, idx) => (
          <DisplayPlate
            key={idx}
            weightValue={weight}
            showPlateNumbers={props.showPlateNumbers}
            side={props.side}
          />
        ))}
      </Box>
    </Box>
  );
};

export default DisplaySleeve;
