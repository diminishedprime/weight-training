import { PreferenceValueAPI } from "@/app/preferences/_components/usePreferenceValue";
import LabeledValue from "@/components/LabeledValue";
import SelectAvailableDumbbells from "@/components/select/SelectAvailableDumbbells";
import TODO from "@/components/TODO";
import { DEFAULT_VALUES } from "@/constants";
import { Typography } from "@mui/material";
import { useState } from "react";

interface Props {
  api: PreferenceValueAPI<number[]>;
}

const SelectDumbbells: React.FC<Props> = (props) => {
  const api = useSelectDumbbellsAPI(props);

  const help = (
    <Typography variant="caption" color="text.secondary">
      The dumbbells that are available in your gym. Some gyms have 100s, some
      only go up to 50, and some have odd increments.
      <br />
      (In the future you will be able to set preferences per gym.)
    </Typography>
  );

  return (
    <LabeledValue label={props.api.label} help={help}>
      <SelectAvailableDumbbells
        availableDumbbells={api.availableDumbbells}
        selectedDumbbells={props.api.value}
        setSelectedDumbbells={props.api.setValue}
      />
      <TODO>Add required indicator support for dumbbells</TODO>
      <TODO>
        Update preferences to support multiple gyms. Update the DB to tie
        everything to a default gym.
      </TODO>
      <TODO>
        This UI could use a bit of love. I think doing something cute like the
        kettlebells would be nice.
      </TODO>
    </LabeledValue>
  );
};

export default SelectDumbbells;

const useSelectDumbbellsAPI = (_props: Props) => {
  const [availableDumbbells] = useState(DEFAULT_VALUES.AVAILABLE_DUMBBELLS_LBS);

  return { availableDumbbells };
};
