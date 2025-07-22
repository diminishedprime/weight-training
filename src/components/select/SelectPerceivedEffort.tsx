import { PerceivedEffort } from "@/common-types";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import SentimentVerySatisfiedIcon from "@mui/icons-material/SentimentVerySatisfied";
import {
  FormControl,
  FormLabel,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
} from "@mui/material";
import React from "react";

interface SelectPerceivedEffortProps {
  perceivedEffort: PerceivedEffort | null;
  onPerceivedEffortChange: (effort: PerceivedEffort | null) => void;
}

const useSelectPerceivedEffortAPI = (props: SelectPerceivedEffortProps) => {
  const { perceivedEffort, onPerceivedEffortChange } = props;

  const [localPerceivedEffort, setLocalPerceivedEffort] =
    React.useState<PerceivedEffort | null>(perceivedEffort ?? null);

  const localOnPerceivedEffortChange = React.useCallback(
    (newValue: PerceivedEffort | null) => {
      setLocalPerceivedEffort(newValue);
    },
    [],
  );

  React.useEffect(() => {
    onPerceivedEffortChange(localPerceivedEffort);
  }, [localPerceivedEffort, onPerceivedEffortChange]);

  return {
    perceivedEffort: localPerceivedEffort,
    onPerceivedEffortChange: localOnPerceivedEffortChange,
  };
};

const SelectPerceivedEffort = (props: SelectPerceivedEffortProps) => {
  const api = useSelectPerceivedEffortAPI(props);
  return (
    <FormControl>
      <FormLabel>Percieved Effort</FormLabel>
      <ToggleButtonGroup
        color="primary"
        value={api.perceivedEffort}
        exclusive
        onChange={(_e, val) => val && api.onPerceivedEffortChange(val)}
        size="small"
        aria-label="Effort"
      >
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

export default SelectPerceivedEffort;
