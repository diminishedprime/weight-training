import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import React from "react";

interface WarmupCheckboxProps {
  checked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function WarmupCheckbox({
  checked,
  onChange,
}: WarmupCheckboxProps) {
  return (
    <FormControlLabel
      control={<Checkbox name="warmup" checked={checked} onChange={onChange} />}
      label="Warmup"
    />
  );
}
