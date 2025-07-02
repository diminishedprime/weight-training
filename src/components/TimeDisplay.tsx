"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "@mui/material/styles";

interface TimeDisplayProps {
  /** ISO string representing when the exercise was performed */
  performedAt: string;
  /** If true, hides seconds from the time display */
  noSeconds?: true;
}

/**
 * TimeDisplay component
 * Shows a live count-up timer for times within the last 10 minutes, color-coded for rest timing.
 * Otherwise, shows static time in HH:MM:SS format.
 */
const TimeDisplay: React.FC<TimeDisplayProps> = (props) => {
  const { performedAt, noSeconds } = props;
  const theme = useTheme();
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, [performedAt]);

  const performed = new Date(performedAt).getTime();
  const diffSec = Math.floor((now - performed) / 1000);
  if (diffSec >= 0 && diffSec < 600) {
    // Within last 10 minutes, show count up
    const color =
      diffSec < 120 ? theme.palette.warning.main : theme.palette.success.main;
    const min = Math.floor(diffSec / 60);
    const sec = diffSec % 60;
    return (
      // Suppress hydration warning to avoid mismatch between server and client
      // rendering since the time is dynamic
      <span style={{ color }} suppressHydrationWarning>
        {min}:{sec.toString().padStart(2, "0")}
      </span>
    );
  }
  // Otherwise, show static time
  const d = new Date(performedAt);
  const hh = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");

  if (noSeconds) {
    return <span>{`${hh}:${min}`}</span>;
  }

  const ss = String(d.getSeconds()).padStart(2, "0");
  return <span>{`${hh}:${min}:${ss}`}</span>;
};

export default TimeDisplay;
