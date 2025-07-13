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
import { RelativeEffort } from "@/common-types";

export function EffortEditor({
  value,
  onChange,
}: {
  value: RelativeEffort | null;
  onChange: (val: RelativeEffort) => void;
}) {
  return (
    <FormControl>
      <FormLabel>Percieved Effort</FormLabel>
      <ToggleButtonGroup
        color="primary"
        value={value}
        exclusive
        onChange={(_e, val) => val && onChange(val)}
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
}
