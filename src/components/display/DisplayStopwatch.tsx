"use client";
import { Typography, TypographyProps } from "@mui/material";
import { useEffect, useMemo, useState } from "react";

interface DisplayCountUpProps {
  start: Date;
  milliseconds?: boolean;
  successThresholdSeconds?: number;
  millisecondsUntilThreshold?: boolean;
}

const DisplayStopwatch: React.FC<DisplayCountUpProps> = (props) => {
  const api = useDisplayStopwatchAPI(props);
  return (
    <Typography component="span" color={api.color}>
      {(api.minutes % 60).toFixed(0).padStart(2, "0")}:
      {(api.seconds % 60).toFixed(0).padStart(2, "0")}
      {api.showMilliseconds &&
        `:${api.milliseconds.toString().padStart(2, "0")}`}
    </Typography>
  );
};

export default DisplayStopwatch;

const useDisplayStopwatchAPI = (props: DisplayCountUpProps) => {
  const {
    start,
    milliseconds: useMilliseconds,
    successThresholdSeconds,
    millisecondsUntilThreshold,
  } = props;
  const [elapsed, setElapsed] = useState(0);

  const milliseconds = Math.floor((elapsed % 1000) / 10); // two digits
  const seconds = Math.floor(elapsed / 1000);
  const minutes = Math.floor(seconds / 60);

  const underThreshold = useMemo(() => {
    if (successThresholdSeconds) {
      return seconds < successThresholdSeconds;
    }
    return false;
  }, [successThresholdSeconds, seconds]);

  useEffect(() => {
    if (useMilliseconds || (millisecondsUntilThreshold && underThreshold)) {
      let frameId: number;
      const update = () => {
        setElapsed(Date.now() - start.getTime());
        frameId = requestAnimationFrame(update);
      };
      update();
      return () => cancelAnimationFrame(frameId);
    } else {
      setElapsed(Date.now() - start.getTime());
      const interval = setInterval(() => {
        setElapsed(Date.now() - start.getTime());
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [start, useMilliseconds, underThreshold, millisecondsUntilThreshold]);

  const color: TypographyProps["color"] = useMemo(() => {
    if (successThresholdSeconds) {
      if (seconds < successThresholdSeconds) {
        return "warning";
      }
      return "success";
    }
    return "default";
  }, [seconds, successThresholdSeconds]);

  const showMilliseconds = useMemo(() => {
    return useMilliseconds || (millisecondsUntilThreshold && underThreshold);
  }, [useMilliseconds, underThreshold, millisecondsUntilThreshold]);

  return { milliseconds, seconds, minutes, color, showMilliseconds };
};
