import { CompletionStatus } from "@/common-types";
import DisplayCompletionStatus from "@/components/display/DisplayCompletionStatus";
import { TestIds } from "@/test-ids";
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
  setCompletionStatus: React.Dispatch<React.SetStateAction<CompletionStatus>>;
  notStarted?: true;
  customLabel?: string;
  boundFinishAction?: (formData: FormData) => Promise<void>;
  boundSkipAction?: (formData: FormData) => Promise<void>;
  boundFailAction?: (formData: FormData) => Promise<void>;
}

const SelectCompletionStatus: React.FC<SelectCompletionStatusProps> = (
  props,
) => {
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
        value={props.completionStatus}
        exclusive
        onChange={(_e, val) => val && props.setCompletionStatus(val)}
        size="small"
        aria-label="Completion Status"
      >
        {renderWithOptionalForm(
          props.boundFinishAction,
          <ToggleButton
            data-testid={TestIds.CompletionStatus("completed")}
            value="completed"
            aria-label="Completed"
            size="small"
            type={props.boundFinishAction ? "submit" : "button"}
          >
            <Tooltip title="Completed">
              <DisplayCompletionStatus completionStatus="completed" />
            </Tooltip>
          </ToggleButton>,
        )}
        {props.notStarted && (
          <ToggleButton
            data-testid={TestIds.CompletionStatus("not_started")}
            value="not_completed"
            aria-label="Not Starte"
            size="small"
          >
            <Tooltip title="Not Started">
              <DisplayCompletionStatus completionStatus="not_started" />
            </Tooltip>
          </ToggleButton>
        )}
        {renderWithOptionalForm(
          props.boundFailAction,
          <ToggleButton
            data-testid={TestIds.CompletionStatus("failed")}
            value="failed"
            aria-label="Failed"
            size="small"
            type={props.boundFailAction ? "submit" : "button"}
          >
            <Tooltip title="Failed">
              <DisplayCompletionStatus completionStatus="failed" />
            </Tooltip>
          </ToggleButton>,
        )}
        {renderWithOptionalForm(
          props.boundSkipAction,
          <ToggleButton
            data-testid={TestIds.CompletionStatus("skipped")}
            value="skipped"
            aria-label="Skipped"
            size="small"
            type={props.boundSkipAction ? "submit" : "button"}
          >
            <Tooltip title="Skipped">
              <DisplayCompletionStatus completionStatus="skipped" />
            </Tooltip>
          </ToggleButton>,
        )}
      </ToggleButtonGroup>
    </FormControl>
  );
};

export default SelectCompletionStatus;
