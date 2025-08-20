"use client";
import { Typography, TypographyProps } from "@mui/material";
import { useEffect, useMemo, useState } from "react";

interface DisplayCountUpProps {
  start: Date;
  milliseconds?: boolean;
  successThresholdSeconds?: number;
  millisecondsUntilThreshold?: boolean;
  // This method is should be safe to be called multiple times. The caller must
  // take care of making sure this is safe.
  onThresholdReached?: (secondsSince: number) => void;
  variant?: TypographyProps["variant"];
}

const DisplayStopwatch: React.FC<DisplayCountUpProps> = (props) => {
  const api = useDisplayStopwatchAPI(props);
  return (
    <Typography
      component="span"
      color={api.color}
      variant={props.variant}
      sx={{ fontVariantNumeric: "tabular-nums" }}
    >
      {api.displayMinutes}
      {api.displaySeconds}
      {api.displayMilliseconds}
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
    onThresholdReached,
  } = props;

  const [elapsed, setElapsed] = useState(0);

  const countingDown = useMemo(
    () =>
      successThresholdSeconds === undefined
        ? false
        : elapsed < successThresholdSeconds * 1000,
    [elapsed, successThresholdSeconds],
  );

  useEffect(() => {
    let frameId: number;
    if (useMilliseconds || (millisecondsUntilThreshold && countingDown)) {
      const update = () => {
        setElapsed(Date.now() - start.getTime());
        if (useMilliseconds || (millisecondsUntilThreshold && countingDown)) {
          frameId = requestAnimationFrame(update);
        }
      };
      update();
      return () => cancelAnimationFrame(frameId);
    }
    setElapsed(Date.now() - start.getTime());
    const interval = setInterval(() => {
      setElapsed(Date.now() - start.getTime());
    }, 1000);
    return () => clearInterval(interval);
  }, [start, useMilliseconds, countingDown, millisecondsUntilThreshold]);

  const [millisecondsTill, secondsTill, minutesTill] = useMemo(() => {
    if (successThresholdSeconds === undefined || countingDown === false) {
      return [undefined, undefined, undefined] as const;
    }
    const secondsLeft =
      successThresholdSeconds - Math.floor(elapsed / 1000) - 1;
    const millisecondsTill = Math.floor((1000 - (elapsed % 1000)) / 10); // two digits
    const secondsTill = ((secondsLeft % 60) + 60) % 60;
    const minutesTill = Math.floor(secondsLeft / 60);
    return [millisecondsTill, secondsTill, minutesTill] as const;
  }, [elapsed, countingDown, successThresholdSeconds]);

  const [totalSeconds, millisecondsSince, secondsSince, minutesSince] =
    useMemo(() => {
      if (countingDown === true) {
        return [undefined, undefined, undefined] as const;
      }
      const milliseconds = Math.floor((elapsed % 1000) / 10);
      const totalSeconds = Math.floor(elapsed / 1000);
      const seconds = totalSeconds % 60;
      const minutes = Math.floor(elapsed / 1000 / 60);
      return [totalSeconds, milliseconds, seconds, minutes] as const;
    }, [elapsed, countingDown]);

  useEffect(() => {
    if (
      successThresholdSeconds === undefined ||
      totalSeconds === undefined ||
      countingDown
    ) {
      return;
    }
    onThresholdReached?.(totalSeconds - successThresholdSeconds);
  }, [countingDown, onThresholdReached, totalSeconds, successThresholdSeconds]);

  const color: TypographyProps["color"] = useMemo(() => {
    if (successThresholdSeconds !== undefined) {
      if (countingDown) {
        return "warning";
      }
      return "success";
    }
    return "default";
  }, [countingDown, successThresholdSeconds]);

  const showMilliseconds = useMemo(() => {
    return useMilliseconds || (millisecondsUntilThreshold && countingDown);
  }, [useMilliseconds, countingDown, millisecondsUntilThreshold]);

  const displayMinutes = useMemo(() => {
    if (minutesTill !== undefined) {
      if (minutesTill === 0) {
        return undefined;
      }
      return `${minutesTill}:`;
    }
    if (minutesSince !== undefined) {
      if (minutesSince < 10) {
        return `${minutesSince.toString()}:`;
      }
      return `${minutesSince.toString().padStart(2, "0")}:`;
    }
  }, [minutesTill, minutesSince]);

  const displaySeconds = useMemo(() => {
    if (secondsTill !== undefined) {
      if (minutesTill !== undefined && minutesTill !== 0) {
        return secondsTill.toString().padStart(2, "0");
      }
      return secondsTill.toString();
    }
    if (secondsSince !== undefined) {
      if (
        minutesSince !== undefined &&
        minutesSince === 0 &&
        secondsSince === 0
      ) {
        return undefined;
      }
      if (minutesSince !== undefined && minutesSince !== 0) {
        return secondsSince.toString().padStart(2, "0");
      }
      return secondsSince.toString();
    }
  }, [minutesTill, minutesSince, secondsTill, secondsSince]);

  const displayMilliseconds = useMemo(() => {
    if (!showMilliseconds) {
      return undefined;
    }
    if (millisecondsSince !== undefined) {
      return `.${millisecondsSince.toString().padStart(2, "0")}`;
    }
    if (millisecondsTill !== undefined) {
      return `.${millisecondsTill.toString().padStart(2, "0")}`;
    }
    return `.00`;
  }, [showMilliseconds, millisecondsSince, millisecondsTill]);

  return {
    color,
    displayMinutes,
    displaySeconds,
    displayMilliseconds,
  };
};
