import { PreferenceValueAPI } from "@/app/preferences/_components/usePreferenceValue";
import LabeledValue from "@/components/LabeledValue";
import TODO from "@/components/TODO";
import { TextField, Typography } from "@mui/material";

interface Props {
  api: PreferenceValueAPI<string>;
}

const RestTime: React.FC<Props> = (props) => {
  const help = (
    <Typography variant="caption" color="text.secondary">
      The rest time that will be used to indicate when you&apos;re ready for the
      next set.
      <br />
      (In the future, this will be able to be set per-exercise.)
    </Typography>
  );
  return (
    <LabeledValue label={props.api.label} help={help}>
      <TextField
        value={props.api.value}
        onChange={(e) => props.api.setValue((_) => e.target.value)}
        size="small"
      />
      <TODO>
        It'd be nice if there were some like chips or something here to pick
        common values.
      </TODO>
      <TODO>
        We should also support custom rest times per equipment type, and also
        per exercise type (most specific wins)
      </TODO>
    </LabeledValue>
  );
};

export default RestTime;
