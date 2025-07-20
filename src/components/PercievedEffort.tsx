import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";
import SentimentVerySatisfiedIcon from "@mui/icons-material/SentimentVerySatisfied";
import { type PercievedEffort } from "@/common-types";

interface PercievedEffortDisplayProps {
  percievedEffort: PercievedEffort;
}

export default function PercievedEffortDisplay(
  props: PercievedEffortDisplayProps
) {
  switch (props.percievedEffort) {
    case "easy":
      return <SentimentVerySatisfiedIcon titleAccess="Easy" color="success" />;
    case "okay":
      return <SentimentSatisfiedAltIcon titleAccess="Okay" color="primary" />;
    case "hard":
      return <SentimentVeryDissatisfiedIcon titleAccess="Hard" color="error" />;
  }
}
