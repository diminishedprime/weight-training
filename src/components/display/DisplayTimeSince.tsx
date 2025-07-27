import { Typography, TypographyProps } from "@mui/material";
import { formatDistanceToNow } from "date-fns";

interface DisplayTimeSinceProps extends TypographyProps {
  date: Date;
  addSuffix?: boolean;
}

const DisplayTimeSince: React.FC<DisplayTimeSinceProps> = (props) => {
  const { date, addSuffix, ...otherProps } = props;
  return (
    <Typography component="span" {...otherProps}>
      {formatDistanceToNow(date, { addSuffix: addSuffix })}
    </Typography>
  );
};

export default DisplayTimeSince;
