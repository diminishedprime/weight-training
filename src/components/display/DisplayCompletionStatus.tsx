import { CompletionStatus } from "@/common-types";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import SyncIcon from "@mui/icons-material/Sync";

interface DisplayCompletionStatusProps {
  completionStatus: CompletionStatus;
}

const DisplayCompletionStatus: React.FC<DisplayCompletionStatusProps> = (
  props,
) => {
  switch (props.completionStatus) {
    case "completed":
      return <CheckCircleIcon color="success" />;
    case "failed":
      return <CancelIcon color="error" />;
    case "skipped":
      return <SkipNextIcon color="secondary" />;
    case "not_started":
      return <RadioButtonUncheckedIcon color="warning" />;
    case "in_progress":
      return <SyncIcon color="primary" />;
    default:
      const exhaustiveCheck: never = props.completionStatus;
      return exhaustiveCheck;
  }
};

export default DisplayCompletionStatus;
