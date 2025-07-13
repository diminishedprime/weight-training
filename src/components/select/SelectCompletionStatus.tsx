import {
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  FormControl,
  FormLabel,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import CancelIcon from "@mui/icons-material/Cancel";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import { CompletionStatus } from "@/common-types";
import React from "react";

interface SelectCompletionStatusProps {
  completionStatus: CompletionStatus;
  onCompletionStatusChange: (status: CompletionStatus) => void;
  notCompleted?: true;
  customLabel?: string;
}

const useSelectCompletionStatusAPI = (props: SelectCompletionStatusProps) => {
  const { completionStatus, onCompletionStatusChange } = props;

  const [localCompletionStatus, setLocalCompletionStatus] =
    React.useState<CompletionStatus>(completionStatus);

  const localOnCompletionStatusChange = React.useCallback(
    (newValue: CompletionStatus) => {
      setLocalCompletionStatus(newValue);
    },
    []
  );

  React.useEffect(() => {
    onCompletionStatusChange(localCompletionStatus);
  }, [localCompletionStatus, onCompletionStatusChange]);

  return {
    completionStatus: localCompletionStatus,
    onCompletionStatusChange: localOnCompletionStatusChange,
  };
};

const SelectCompletionStatus: React.FC<SelectCompletionStatusProps> = (
  props
) => {
  const api = useSelectCompletionStatusAPI(props);

  return (
    <FormControl>
      <FormLabel>{props.customLabel || "Completion Status"}</FormLabel>
      <ToggleButtonGroup
        color="primary"
        value={api.completionStatus}
        exclusive
        onChange={(_e, val) => val && api.onCompletionStatusChange(val)}
        size="small"
        aria-label="Completion Status">
        <ToggleButton value="completed" aria-label="Completed" size="small">
          <Tooltip title="Completed">
            <CheckCircleIcon color="success" />
          </Tooltip>
        </ToggleButton>
        {props.notCompleted && (
          <ToggleButton
            value="not_completed"
            aria-label="Not Completed"
            size="small">
            <Tooltip title="Not Completed">
              <RadioButtonUncheckedIcon color="warning" />
            </Tooltip>
          </ToggleButton>
        )}
        <ToggleButton value="failed" aria-label="Failed" size="small">
          <Tooltip title="Failed">
            <CancelIcon color="error" />
          </Tooltip>
        </ToggleButton>
        <ToggleButton value="skipped" aria-label="Skipped" size="small">
          <Tooltip title="Skipped">
            <SkipNextIcon color="secondary" />
          </Tooltip>
        </ToggleButton>
      </ToggleButtonGroup>
    </FormControl>
  );
};

export default SelectCompletionStatus;
