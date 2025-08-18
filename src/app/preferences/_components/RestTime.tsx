import { PreferenceValueAPI } from "@/app/preferences/_components/usePreferenceValue";
import { RDispatch } from "@/common-types";
import EditRestTime from "@/components/edit/EditRestTime";
import LabeledValue from "@/components/LabeledValue";
import Link from "@/components/Link";
import { Paths } from "@/constants";
import { Stack, Typography } from "@mui/material";

interface Props {
  api: PreferenceValueAPI<number>;
}

const RestTime: React.FC<Props> = (props) => {
  const help = (
    <Typography variant="caption" color="text.secondary">
      The rest time that will be used to indicate when you&apos;re ready for the
      next set.
    </Typography>
  );
  return (
    <LabeledValue label={props.api.label} help={help}>
      <Stack>
        <EditRestTime
          restTime={props.api.value ?? 120}
          // This is only safe as long as the child doesn't ever need to use the
          // set_state_action with the previous value.
          setRestTime={props.api.setValue as RDispatch<number>}
        />
        <Typography variant="body2">
          See <Link href={Paths.Preferences_RestTimes}>Rest Times</Link> for
          additional configuration.
        </Typography>
      </Stack>
    </LabeledValue>
  );
};

export default RestTime;
