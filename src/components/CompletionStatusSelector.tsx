import { ToggleButton, ToggleButtonGroup, Tooltip } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import CancelIcon from "@mui/icons-material/Cancel";
import { CompletionStatus } from "@/common-types";

/**
 * Selector for completion status (complete, partial, skipped).
 * @param value The selected completion status.
 * @param onChange Handler for status change.
 */

interface CompletionStatusSelectorProps {
  value: CompletionStatus;
  onChange: (val: CompletionStatus) => void;
  notCompleted?: true;
}

const CompletionStatusSelector: React.FC<CompletionStatusSelectorProps> = ({
  value,
  onChange,
  notCompleted,
}) => {
  return (
    <ToggleButtonGroup
      color="primary"
      value={value}
      exclusive
      onChange={(_e, val) => val && onChange(val)}
      size="small"
      aria-label="Completion Status">
      <ToggleButton value="completed" aria-label="Completed">
        <Tooltip title="Completed">
          <CheckCircleIcon color="success" />
        </Tooltip>
      </ToggleButton>
      {notCompleted && (
        <ToggleButton value="not_completed" aria-label="Not Completed">
          <Tooltip title="Not Completed">
            <RadioButtonUncheckedIcon color="warning" />
          </Tooltip>
        </ToggleButton>
      )}
      <ToggleButton value="failed" aria-label="Failed">
        <Tooltip title="Failed">
          <CancelIcon color="error" />
        </Tooltip>
      </ToggleButton>
      <ToggleButton value="skipped" aria-label="Skipped">
        <Tooltip title="Skipped">
          <CancelIcon color="disabled" />
        </Tooltip>
      </ToggleButton>
    </ToggleButtonGroup>
  );
};

export default CompletionStatusSelector;
