import {
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  FormControl,
  FormLabel,
} from "@mui/material";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";
import SentimentVerySatisfiedIcon from "@mui/icons-material/SentimentVerySatisfied";
import { PercievedEffort } from "@/common-types";
import React from "react";

interface SelectPercievedEffortProps {
  percievedEffort: PercievedEffort | null;
  onPercievedEffortChange: (effort: PercievedEffort | null) => void;
}

const useSelectPercievedEffortAPI = (props: SelectPercievedEffortProps) => {
  const { percievedEffort, onPercievedEffortChange } = props;

  const [localPercievedEffort, setLocalPercievedEffort] =
    React.useState<PercievedEffort | null>(percievedEffort ?? null);

  const localOnPercievedEffortChange = React.useCallback(
    (newValue: PercievedEffort | null) => {
      setLocalPercievedEffort(newValue);
    },
    []
  );

  React.useEffect(() => {
    onPercievedEffortChange(localPercievedEffort);
  }, [localPercievedEffort, onPercievedEffortChange]);

  return {
    percievedEffort: localPercievedEffort,
    onPercievedEffortChange: localOnPercievedEffortChange,
  };
};

const SelectPercievedEffort = (props: SelectPercievedEffortProps) => {
  const api = useSelectPercievedEffortAPI(props);
  return (
    <FormControl>
      <FormLabel>Percieved Effort</FormLabel>
      <ToggleButtonGroup
        color="primary"
        value={api.percievedEffort}
        exclusive
        onChange={(_e, val) => val && api.onPercievedEffortChange(val)}
        size="small"
        aria-label="Effort">
        <ToggleButton value="easy" aria-label="Easy">
          <Tooltip title="Easy">
            <SentimentVerySatisfiedIcon color="success" />
          </Tooltip>
        </ToggleButton>
        <ToggleButton value="okay" aria-label="Okay">
          <Tooltip title="Okay">
            <SentimentSatisfiedAltIcon color="primary" />
          </Tooltip>
        </ToggleButton>
        <ToggleButton value="hard" aria-label="Hard">
          <Tooltip title="Hard">
            <SentimentVeryDissatisfiedIcon color="error" />
          </Tooltip>
        </ToggleButton>
      </ToggleButtonGroup>
    </FormControl>
  );
};

export default SelectPercievedEffort;
