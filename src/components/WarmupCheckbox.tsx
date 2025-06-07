import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import { SxProps } from "@mui/material/styles";
import React from "react";

interface WarmupCheckboxProps {
  checked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  sx?: SxProps;
}

export default function WarmupCheckbox({
  checked,
  onChange,
  sx,
}: WarmupCheckboxProps) {
  return (
    <FormControlLabel
      control={<Checkbox name="warmup" checked={checked} onChange={onChange} />}
      label="Warmup"
      sx={sx}
    />
  );
}
