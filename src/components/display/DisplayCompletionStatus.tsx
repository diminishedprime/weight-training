import { CompletionStatus } from "@/common-types";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import SkipNextIcon from "@mui/icons-material/SkipNext";

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
    case "not_completed":
      return <RadioButtonUncheckedIcon color="warning" />;
    default:
      return <span>Unknown Status</span>;
  }
};

export default DisplayCompletionStatus;
