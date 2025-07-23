import { type PerceivedEffort } from "@/common-types";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import SentimentVerySatisfiedIcon from "@mui/icons-material/SentimentVerySatisfied";

interface DisplayPerceivedEffortProps {
  perceivedEffort: PerceivedEffort;
}

export const DisplayPerceivedEffort: React.FC<DisplayPerceivedEffortProps> = (
  props,
) => {
  switch (props.perceivedEffort) {
    case "easy":
      return <SentimentVerySatisfiedIcon titleAccess="Easy" color="success" />;
    case "okay":
      return <SentimentSatisfiedAltIcon titleAccess="Okay" color="primary" />;
    case "hard":
      return <SentimentVeryDissatisfiedIcon titleAccess="Hard" color="error" />;
  }
};

export default DisplayPerceivedEffort;
