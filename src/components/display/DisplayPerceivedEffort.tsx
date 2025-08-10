import { type PerceivedEffort } from "@/common-types";
import CircleIcon from "@mui/icons-material/CircleOutlined";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";
import SentimentNeutralIcon from "@mui/icons-material/SentimentNeutral";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import SentimentVerySatisfiedIcon from "@mui/icons-material/SentimentVerySatisfied";

interface DisplayPerceivedEffortProps {
  perceivedEffort: PerceivedEffort | null;
}

export const DisplayPerceivedEffort: React.FC<DisplayPerceivedEffortProps> = (
  props,
) => {
  switch (props.perceivedEffort) {
    case "easy":
      return <SentimentVerySatisfiedIcon titleAccess="Easy" color="success" />;
    case "okay":
      return <SentimentSatisfiedAltIcon titleAccess="Okay" color="primary" />;
    case "meh":
      return <SentimentNeutralIcon titleAccess="Meh" color="action" />;
    case "hard":
      return <SentimentDissatisfiedIcon titleAccess="Hard" color="warning" />;
    case "very_hard":
      return (
        <SentimentVeryDissatisfiedIcon titleAccess="Very Hard" color="error" />
      );
    case null:
      return <CircleIcon titleAccess="No Effort" color="action" />;
    default:
      const _exhaustiveCheck: never = props.perceivedEffort;
      return _exhaustiveCheck;
  }
};

export default DisplayPerceivedEffort;
