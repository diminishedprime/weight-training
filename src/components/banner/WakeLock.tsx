"use client";

import CoffeeIcon from "@mui/icons-material/LocalCafe";
import CoffeeOutlinedIcon from "@mui/icons-material/LocalCafeOutlined";
import IconButton from "@mui/material/IconButton";
import NoSleep from "nosleep.js";
import * as React from "react";
import { useCallback, useRef, useState } from "react";

const WakeLock: React.FC = () => {
  const api = useWakeLockApi();
  return (
    <IconButton onClick={api.handleWakeLockToggle} color="inherit">
      {api.awake ? <CoffeeIcon /> : <CoffeeOutlinedIcon />}
    </IconButton>
  );
};

export default WakeLock;

const useWakeLockApi = () => {
  const noSleepRef = useRef<NoSleep | null>(null);
  const [awake, setAwake] = useState(false);

  const handleWakeLockToggle = useCallback(() => {
    if (!noSleepRef.current) {
      noSleepRef.current = new NoSleep();
    }
    if (!awake) {
      noSleepRef.current.enable();
      setAwake(true);
    } else {
      noSleepRef.current.disable();
      setAwake(false);
    }
  }, [awake]);

  return {
    awake,
    handleWakeLockToggle,
  };
};
