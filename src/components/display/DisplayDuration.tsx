import { Typography, TypographyProps } from "@mui/material";
import { formatDistance } from "date-fns";

interface DisplayDurationProps {
  from: Date;
  to: Date;
  color?: TypographyProps["color"];
  variant?: TypographyProps["variant"];
  highResolution?: boolean;
  restTimeSeconds?: number;
  squiggle?: boolean;
}

const DisplayDuration: React.FC<DisplayDurationProps> = (props) => {
  const { highResolution, restTimeSeconds, squiggle } = props;
  let formattedString = "";
  let color = undefined;
  if (highResolution) {
    // calculate the difference and then display using MM:SS
    const diffInSeconds = Math.round(
      (props.to.getTime() - props.from.getTime()) / 1000,
    );
    if (restTimeSeconds && diffInSeconds < restTimeSeconds) {
      color = "error";
    } else if (restTimeSeconds) {
      color = "success";
    }
    const minutes = Math.floor(diffInSeconds / 60);
    const seconds = diffInSeconds % 60;
    formattedString = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  } else {
    formattedString = formatDistance(props.from, props.to);
  }
  return (
    <Typography
      component="span"
      color={props.color || color}
      variant={props.variant}
    >
      {squiggle && "~"}
      {formattedString}
    </Typography>
  );
};

export default DisplayDuration;
