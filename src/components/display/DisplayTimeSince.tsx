import { Typography, TypographyProps } from "@mui/material";
import { formatDistanceToNow } from "date-fns";

interface DisplayTimeSinceProps extends TypographyProps {
  date: Date;
  addSuffix?: boolean;
  includeSeconds?: boolean;
}

const DisplayTimeSince: React.FC<DisplayTimeSinceProps> = (props) => {
  const { date, addSuffix, includeSeconds, ...otherProps } = props;
  return (
    <Typography component="span" {...otherProps}>
      {formatDistanceToNow(date, {
        addSuffix: addSuffix,
        includeSeconds: includeSeconds,
      })}
    </Typography>
  );
};

export default DisplayTimeSince;
