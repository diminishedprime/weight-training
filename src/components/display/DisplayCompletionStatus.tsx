import { CompletionStatus } from "@/common-types";
import { TestIds } from "@/test-ids";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import SyncIcon from "@mui/icons-material/Sync";
import { IconProps } from "@mui/material";

interface DisplayCompletionStatusProps {
  completionStatus: CompletionStatus;
  fontSize?: IconProps["fontSize"];
}

const DisplayCompletionStatus: React.FC<DisplayCompletionStatusProps> = (
  props,
) => {
  switch (props.completionStatus) {
    case "completed":
      return (
        <CheckCircleIcon
          color="success"
          fontSize={props.fontSize}
          data-testid={TestIds.CompletionStatusCompleted}
        />
      );
    case "failed":
      return (
        <CancelIcon
          color="error"
          fontSize={props.fontSize}
          data-testid={TestIds.CompletionStatusFailed}
        />
      );
    case "skipped":
      return (
        <SkipNextIcon
          color="secondary"
          fontSize={props.fontSize}
          data-testid={TestIds.CompletionStatusSkipped}
        />
      );
    case "not_started":
      return (
        <RadioButtonUncheckedIcon
          color="warning"
          fontSize={props.fontSize}
          data-testid={TestIds.CompletionStatusNotStarted}
        />
      );
    case "in_progress":
      return (
        <SyncIcon
          color="primary"
          fontSize={props.fontSize}
          data-testid={TestIds.CompletionStatusInProgress}
        />
      );
    default:
      const exhaustiveCheck: never = props.completionStatus;
      return exhaustiveCheck;
  }
};

export default DisplayCompletionStatus;
