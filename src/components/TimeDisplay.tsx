import React, { useEffect, useState } from "react";
import { useTheme } from "@mui/material/styles";

/**
 * TimeDisplay component
 * Shows a live count-up timer for times within the last 10 minutes, color-coded for rest timing.
 * Otherwise, shows static time in HH:MM:SS format.
 *
 * Props:
 *   performedAt: ISO string (required)
 */
export default function TimeDisplay({ performedAt }: { performedAt: string }) {
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
    let color =
      diffSec < 120 ? theme.palette.warning.main : theme.palette.success.main;
    let min = Math.floor(diffSec / 60);
    let sec = diffSec % 60;
    return (
      <span
        style={{ fontWeight: 600, color, fontVariantNumeric: "tabular-nums" }}
      >
        +{min}:{sec.toString().padStart(2, "0")}
      </span>
    );
  }
  // Otherwise, show static time
  const d = new Date(performedAt);
  const hh = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  const ss = String(d.getSeconds()).padStart(2, "0");
  return <span>{`${hh}:${min}:${ss}`}</span>;
}
