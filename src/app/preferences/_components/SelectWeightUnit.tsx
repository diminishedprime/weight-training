import { PreferenceValueAPI } from "@/app/preferences/_components/usePreferenceValue";
import { WeightUnit } from "@/common-types";
import LabeledValue from "@/components/LabeledValue";
import SelectWeightUnitComponent from "@/components/select/SelectWeightUnit";
import TODO from "@/components/TODO";
import { Typography } from "@mui/material";

interface Props {
  api: PreferenceValueAPI<WeightUnit>;
}

const SelectWeightUnit: React.FC<Props> = (props) => {
  const help = (
    <Typography variant="caption" color="text.secondary">
      The default weight unit that will be used for all exercises.
    </Typography>
  );
  return (
    <LabeledValue label={props.api.label} help={help}>
      <SelectWeightUnitComponent
        weightUnit={props.api.value}
        setWeightUnit={props.api.setValue}
        disabled
      />
      <TODO>Currently this isn't remotely supported</TODO>
    </LabeledValue>
  );
};

export default SelectWeightUnit;
