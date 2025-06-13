import { Database } from "@/database.types";
import { ToggleButton, ToggleButtonGroup, Tooltip } from "@mui/material";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";
import SentimentVerySatisfiedIcon from "@mui/icons-material/SentimentVerySatisfied";

export function EffortEditor({
  value,
  onChange,
}: {
  value: Database["public"]["Enums"]["relative_effort_enum"] | null;
  onChange: (val: Database["public"]["Enums"]["relative_effort_enum"]) => void;
}) {
  return (
    <ToggleButtonGroup
      value={value}
      exclusive
      onChange={(_e, val) => val && onChange(val)}
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
  );
}
