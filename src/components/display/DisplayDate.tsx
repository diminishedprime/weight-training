import { Stack, Typography } from "@mui/material";
import { format } from "date-fns";

interface DisplayTimeProps {
  timestamp: string;
}

const DisplayTime: React.FC<DisplayTimeProps> = (props) => {
  const date = new Date(props.timestamp);
  const dateString = format(date, "MM/dd/yyyy");
  const timeString = format(date, "h:mm a");
  return (
    <Stack>
      <Typography component="span" color="primary" sx={{ p: 0, m: 0 }}>
        {dateString}
      </Typography>
      <Typography component="span" color="secondary" sx={{ p: 0, m: 0 }}>
        {timeString}
      </Typography>
    </Stack>
  );
};

export default DisplayTime;
