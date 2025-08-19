import { Props } from "@/components/display/DisplayDuration";
import Typography from "@/components/skeleton/Typography";

export default function DisplayDuration(props: Pick<Props, "variant">) {
  return <Typography variant={props.variant}>~5 minutes</Typography>;
}
