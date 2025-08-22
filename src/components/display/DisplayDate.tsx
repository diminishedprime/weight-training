import { Stack, Typography, TypographyProps } from "@mui/material";
import { format } from "date-fns";

export interface Props {
  timestamp: string;
  row?: boolean;
  noDate?: boolean;
  noTime?: boolean;
  twoDigitYear?: boolean;
  variant?: TypographyProps["variant"];
  dateColor?: TypographyProps["color"];
}

const DisplayDate: React.FC<Props> = (props) => {
  const date = new Date(props.timestamp);
  const dateString = format(
    date,
    props.twoDigitYear ? "MM/dd/yy" : "MM/dd/yyyy",
  );
  const timeString = format(date, "h:mm a");
  return (
    <Stack direction={props.row ? "row" : undefined} flexWrap="wrap">
      {!props.noDate && (
        <Typography
          component="span"
          color={props.dateColor || "primary"}
          sx={{ p: 0, m: 0 }}
          variant={props.variant}
        >
          {dateString}
        </Typography>
      )}
      {!props.noTime && (
        <Typography
          component="span"
          color="secondary"
          sx={{ p: 0, m: 0 }}
          variant={props.variant}
        >
          {timeString}
        </Typography>
      )}
    </Stack>
  );
};

export default DisplayDate;
