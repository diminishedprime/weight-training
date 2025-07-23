import { TestIds } from "@/test-ids";
import { Checkbox, FormControlLabel } from "@mui/material";
import React from "react";

interface SelectWarmupProps {
  isWarmup: boolean;
  onWarmupChange: (isWarmup: boolean) => void;
}

const useSelectWarmupAPI = (props: SelectWarmupProps) => {
  const { isWarmup, onWarmupChange } = props;
  const [localIsWarmup, setLocalIsWarmup] = React.useState<boolean>(isWarmup);

  const handleToggle = React.useCallback(() => {
    setLocalIsWarmup((prev) => !prev);
  }, []);

  React.useEffect(() => {
    onWarmupChange(localIsWarmup);
  }, [localIsWarmup, onWarmupChange]);

  return {
    isWarmup: localIsWarmup,
    onToggle: handleToggle,
  };
};

const SelectWarmup: React.FC<SelectWarmupProps> = (props) => {
  const api = useSelectWarmupAPI(props);
  return (
    <FormControlLabel
      control={
        <Checkbox
          data-testid={TestIds.WarmupToggle}
          checked={api.isWarmup}
          onChange={api.onToggle}
          color="primary"
          size="small"
          inputProps={{ "aria-label": "Warmup" }}
        />
      }
      label="Warmup"
    />
  );
};

export default SelectWarmup;
