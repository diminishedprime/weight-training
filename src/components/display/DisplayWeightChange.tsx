import DownArrowIcon from "@mui/icons-material/ArrowDownward";
import UpArrowIcon from "@mui/icons-material/ArrowUpward";
import SquiggleLineIcon from "@mui/icons-material/Menu";
import { Typography } from "@mui/material";
import React from "react";

interface DisplayIncreaseProps {
  changeValue: number;
  warningWeightThreshold?: number;
  errorWeightThreshold?: number;
}
const DisplayWeightChange: React.FC<DisplayIncreaseProps> = (props) => {
  const { changeValue } = props;
  let icon;
  let color;
  if (changeValue > 0) {
    icon = <UpArrowIcon />;
    color = "success";
    if (
      props.warningWeightThreshold &&
      changeValue > props.warningWeightThreshold
    ) {
      color = "warning";
    }
    if (
      props.errorWeightThreshold &&
      changeValue > props.errorWeightThreshold
    ) {
      color = "error";
    }
  } else if (changeValue < 0) {
    icon = <DownArrowIcon />;
    color = "error";
  } else {
    icon = <SquiggleLineIcon />;
    color = undefined;
  }

  return (
    <Typography
      component="span"
      color={color}
      sx={{ display: "flex", alignItems: "center" }}
    >
      {icon} {Math.abs(changeValue)}
    </Typography>
  );
};

export default DisplayWeightChange;
