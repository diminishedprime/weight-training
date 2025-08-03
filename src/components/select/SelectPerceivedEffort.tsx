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
  setPerceivedEffortChange: React.Dispatch<
    React.SetStateAction<PerceivedEffort | null>
  >;
}

const SelectPerceivedEffort = (props: SelectPerceivedEffortProps) => {
  return (
    <FormControl>
      <FormLabel>Percieved Effort</FormLabel>
      <ToggleButtonGroup
        color="primary"
        value={props.perceivedEffort}
        exclusive
        onChange={(_e, val) => props.setPerceivedEffortChange(val)}
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
