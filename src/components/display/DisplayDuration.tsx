import { Typography, TypographyProps } from "@mui/material";
import { formatDistance } from "date-fns";

interface DisplayDurationProps {
  from: Date;
  to: Date;
  color?: TypographyProps["color"];
  variant?: TypographyProps["variant"];
}

const DisplayDuration: React.FC<DisplayDurationProps> = (props) => {
  return (
    <Typography component="span" color={props.color} variant={props.variant}>
      {formatDistance(props.from, props.to)}
    </Typography>
  );
};

export default DisplayDuration;
