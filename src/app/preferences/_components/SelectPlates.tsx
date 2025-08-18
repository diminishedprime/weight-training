import { PreferenceValueAPI } from "@/app/preferences/_components/usePreferenceValue";
import LabeledValue from "@/components/LabeledValue";
import SelectPlatesComponent from "@/components/select/SelectPlates";
import TODO from "@/components/TODO";
import { DEFAULT_VALUES } from "@/constants";
import { Stack, Typography } from "@mui/material";
import { useState } from "react";

interface Props {
  api: PreferenceValueAPI<number[]>;
}

const SelectPlates: React.FC<Props> = (props) => {
  const api = useSelectPlatesAPI(props);

  const help = (
    <Stack spacing={0.5}>
      <Typography variant="caption" color="text.secondary">
        The plates that are available in your gym. i.e. Some gyms have 55s, or
        100s, and some folks bother with small change plates.
      </Typography>
      <Typography variant="caption" color="text.secondary">
        In the future you will be able to set preferences per gym.
      </Typography>
      <Typography variant="caption" color="text.secondary">
        Also in the future, you can set the number of available plates which can
        help with weight calculations if you need to like double up on 35s to
        meet a given weight.
      </Typography>
    </Stack>
  );

  return (
    <LabeledValue label={props.api.label} help={help}>
      <SelectPlatesComponent
        availablePlates={api.availablePlates}
        selectedPlates={props.api.value}
        setSelectedPlates={props.api.setValue}
      />
      <TODO>I'd like to support adding custom plate sizes here.</TODO>
    </LabeledValue>
  );
};

export default SelectPlates;

const useSelectPlatesAPI = (_props: Props) => {
  const [availablePlates] = useState(DEFAULT_VALUES.AVAILABLE_PLATES_LBS);

  return { availablePlates };
};
