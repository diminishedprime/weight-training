import { type PercievedEffort } from "@/common-types";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import SentimentVerySatisfiedIcon from "@mui/icons-material/SentimentVerySatisfied";

interface DisplayPercievedEffortProps {
  percievedEffort: PercievedEffort;
}

export const DisplayPercievedEffort: React.FC<DisplayPercievedEffortProps> = (
  props,
) => {
  switch (props.percievedEffort) {
    case "easy":
      return <SentimentVerySatisfiedIcon titleAccess="Easy" color="success" />;
    case "okay":
      return <SentimentSatisfiedAltIcon titleAccess="Okay" color="primary" />;
    case "hard":
      return <SentimentVeryDissatisfiedIcon titleAccess="Hard" color="error" />;
  }
};

export default DisplayPercievedEffort;
