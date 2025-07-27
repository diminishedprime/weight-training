import { Stack, Typography } from "@mui/material";
import { format } from "date-fns";

interface DisplayTimeProps {
  timestamp: string;
  row?: boolean;
  noDate?: boolean;
  noTime?: boolean;
}

const DisplayTime: React.FC<DisplayTimeProps> = (props) => {
  const date = new Date(props.timestamp);
  const dateString = format(date, "MM/dd/yyyy");
  const timeString = format(date, "h:mm a");
  return (
    <Stack
      direction={props.row ? "row" : undefined}
      spacing={props.row ? 1 : undefined}
    >
      {!props.noDate && (
        <Typography component="span" color="primary" sx={{ p: 0, m: 0 }}>
          {dateString}
        </Typography>
      )}
      {!props.noTime && (
        <Typography component="span" color="secondary" sx={{ p: 0, m: 0 }}>
          {timeString}
        </Typography>
      )}
    </Stack>
  );
};

export default DisplayTime;
