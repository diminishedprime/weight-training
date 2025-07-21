import { Box } from "@mui/material";
import { MAX_DIAMETER_MM, PLATE_METADATA, SLEEVE_DIAMETER_MM } from ".";

interface PlateProps {
  weightValue: number;
  showPlateNumbers?: boolean;
  side: "left" | "right";
}

const DisplayPlate: React.FC<PlateProps> = (props) => {
  const { weightValue } = props;
  const measurements = PLATE_METADATA[weightValue];

  return (
    <Box
      sx={{
        height: `calc(100% * ${measurements.diameterMM / SLEEVE_DIAMETER_MM})`, // proportional height
        width: `calc(100% * ${measurements.widthMM / MAX_DIAMETER_MM})`, // proportional width
        aspectRatio: `${measurements.widthMM} / ${MAX_DIAMETER_MM}`, // aspect ratio
        display: "flex",
        alignItems: "center",
        alignSelf: "center",
        justifyContent: "center",
        ...measurements.sx,
      }}>
      {/** TODO: eventually, I want to support numbers here, but I can't figure
       * out how to calculate them? I may just need to do a useClient box or
       * something? */}
    </Box>
  );
};

export default DisplayPlate;
