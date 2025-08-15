import { type PerceivedEffort } from "@/common-types";
import CircleIcon from "@mui/icons-material/CircleOutlined";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";
import SentimentNeutralIcon from "@mui/icons-material/SentimentNeutral";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import SentimentVerySatisfiedIcon from "@mui/icons-material/SentimentVerySatisfied";
import { IconProps } from "@mui/material";

interface DisplayPerceivedEffortProps {
  perceivedEffort: PerceivedEffort | null;
  fontSize?: IconProps["fontSize"];
}

export const DisplayPerceivedEffort: React.FC<DisplayPerceivedEffortProps> = (
  props,
) => {
  switch (props.perceivedEffort) {
    case "easy":
      return (
        <SentimentVerySatisfiedIcon
          titleAccess="Easy"
          color="success"
          fontSize={props.fontSize}
        />
      );
    case "okay":
      return (
        <SentimentSatisfiedAltIcon
          titleAccess="Okay"
          color="primary"
          fontSize={props.fontSize}
        />
      );
    case "meh":
      return (
        <SentimentNeutralIcon
          titleAccess="Meh"
          color="action"
          fontSize={props.fontSize}
        />
      );
    case "hard":
      return (
        <SentimentDissatisfiedIcon
          titleAccess="Hard"
          color="warning"
          fontSize={props.fontSize}
        />
      );
    case "very_hard":
      return (
        <SentimentVeryDissatisfiedIcon
          titleAccess="Very Hard"
          color="error"
          fontSize={props.fontSize}
        />
      );
    case null:
      return (
        <CircleIcon
          titleAccess="No Effort"
          color="action"
          fontSize={props.fontSize}
        />
      );
    default:
      const _exhaustiveCheck: never = props.perceivedEffort;
      return _exhaustiveCheck;
  }
};

export default DisplayPerceivedEffort;
