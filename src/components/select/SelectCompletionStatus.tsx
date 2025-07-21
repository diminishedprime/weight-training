import { CompletionStatus } from "@/common-types";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import {
  FormControl,
  FormLabel,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
} from "@mui/material";
import React from "react";

interface SelectCompletionStatusProps {
  completionStatus: CompletionStatus;
  onCompletionStatusChange: (status: CompletionStatus) => void;
  notCompleted?: true;
  customLabel?: string;
  boundFinishAction?: (formData: FormData) => Promise<void>;
  boundSkipAction?: (formData: FormData) => Promise<void>;
  boundFailAction?: (formData: FormData) => Promise<void>;
}

const useSelectCompletionStatusAPI = (props: SelectCompletionStatusProps) => {
  const { completionStatus, onCompletionStatusChange } = props;

  const [localCompletionStatus, setLocalCompletionStatus] =
    React.useState<CompletionStatus>(completionStatus);

  const localOnCompletionStatusChange = React.useCallback(
    (newValue: CompletionStatus) => {
      setLocalCompletionStatus(newValue);
    },
    [],
  );

  React.useEffect(() => {
    onCompletionStatusChange(localCompletionStatus);
  }, [localCompletionStatus, onCompletionStatusChange])

  return {
    completionStatus: localCompletionStatus,
    onCompletionStatusChange: localOnCompletionStatusChange,
  };
};

// TODO: easy - update this to use the DisplayCompletionStatus component.
const SelectCompletionStatus: React.FC<SelectCompletionStatusProps> = (
  props,
) => {
  const api = useSelectCompletionStatusAPI(props);

  // Helper to conditionally wrap a ToggleButton in a form if a boundAction is provided
  const renderWithOptionalForm = (
    action: ((formData: FormData) => Promise<void>) | undefined,
    button: React.ReactNode,
  ) => {
    if (action) {
      return <form action={action}>{button}</form>;
    }
    return button;
  };

  return (
    <FormControl>
      <FormLabel>{props.customLabel || "Completion Status"}</FormLabel>
      <ToggleButtonGroup
        color="primary"
        value={api.completionStatus}
        exclusive
        onChange={(_e, val) => val && api.onCompletionStatusChange(val)}
        size="small"
        aria-label="Completion Status"
      >
        {renderWithOptionalForm(
          props.boundFinishAction,
          <ToggleButton
            value="completed"
            aria-label="Completed"
            size="small"
            type={props.boundFinishAction ? "submit" : "button"}
          >
            <Tooltip title="Completed">
              <CheckCircleIcon color="success" />
            </Tooltip>
          </ToggleButton>,
        )}
        {props.notCompleted && (
          <ToggleButton
            value="not_completed"
            aria-label="Not Completed"
            size="small"
          >
            <Tooltip title="Not Completed">
              <RadioButtonUncheckedIcon color="warning" />
            </Tooltip>
          </ToggleButton>
        )}
        {renderWithOptionalForm(
          props.boundFailAction,
          <ToggleButton
            value="failed"
            aria-label="Failed"
            size="small"
            type={props.boundFailAction ? "submit" : "button"}
          >
            <Tooltip title="Failed">
              <CancelIcon color="error" />
            </Tooltip>
          </ToggleButton>,
        )}
        {renderWithOptionalForm(
          props.boundSkipAction,
          <ToggleButton
            value="skipped"
            aria-label="Skipped"
            size="small"
            type={props.boundSkipAction ? "submit" : "button"}
          >
            <Tooltip title="Skipped">
              <SkipNextIcon color="secondary" />
            </Tooltip>
          </ToggleButton>,
        )}
      </ToggleButtonGroup>
    </FormControl>
  );
};

export default SelectCompletionStatus;
