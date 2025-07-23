import { PerceivedEffort } from "@/common-types";
import DisplayPerceivedEffort from "@/components/display/DisplayPerceivedEffort";
import { Constants } from "@/database.types";
import { TestIds } from "@/test-ids";
import { perceivedEffortUIString } from "@/uiStrings";
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
        {Constants.public.Enums.perceived_effort_enum.map((effort) => (
          <ToggleButton
            data-testid={TestIds.PerceivedEffort(effort)}
            key={effort}
            value={effort}
            aria-label={perceivedEffortUIString(effort)}
          >
            <Tooltip title={perceivedEffortUIString(effort)}>
              <DisplayPerceivedEffort perceivedEffort={effort} />
            </Tooltip>
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </FormControl>
  );
};

export default SelectPerceivedEffort;
