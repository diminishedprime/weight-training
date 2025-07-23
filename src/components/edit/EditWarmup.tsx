import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import React from "react";

interface EditWarmupProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const EditWarmup: React.FC<EditWarmupProps> = (props) => {
  return (
    <FormControlLabel
      control={
        <Checkbox
          name="warmup"
          checked={props.checked}
          onChange={(e) => props.onChange(e.target.checked)}
        />
      }
      label="Warmup"
    />
  );
};

export default EditWarmup;
