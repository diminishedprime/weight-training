import { WeightUnit } from "@/common-types";
import {
  MAX_DIAMETER_MM,
  PLATE_METADATA,
} from "@/components/display/DisplayBarbell";
import { Stack, Typography } from "@mui/material";

interface DisplayPlateStackProps {
  plates: number[];
  weightUnit: WeightUnit;
  showWeight?: boolean;
}

const DisplayPlateStack: React.FC<DisplayPlateStackProps> = (props) => {
  return (
    <Stack
      alignItems="center"
      style={{ width: "18ch" }}
      flexDirection="column-reverse"
    >
      {props.plates.map((plateValue, idx) => {
        const metadata = PLATE_METADATA[plateValue];
        return (
          <Stack
            key={`${idx}`}
            sx={{
              ...metadata.sx,
              borderRadius: "3px",
              width: `calc(100% * ${metadata.diameterMM / MAX_DIAMETER_MM})`, // proportional width
            }}
            alignItems={"center"}
          >
            {props.showWeight && <Typography>{plateValue}</Typography>}
          </Stack>
        );
      })}
    </Stack>
  );
};

export default DisplayPlateStack;
