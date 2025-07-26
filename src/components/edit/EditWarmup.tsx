import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import React from "react";

interface EditIsWarmupProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const EditIsWarmup: React.FC<EditIsWarmupProps> = (props) => {
  return (
    <FormControlLabel
      control={
        <Checkbox
          name="is_warmup"
          checked={props.checked}
          onChange={(e) => props.onChange(e.target.checked)}
        />
      }
      label="IsWarmup"
    />
  );
};

export default EditIsWarmup;
