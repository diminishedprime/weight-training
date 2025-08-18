import { PreferenceValueAPI } from "@/app/preferences/_components/usePreferenceValue";
import LabeledValue from "@/components/LabeledValue";
import SelectAvailableKettlebells from "@/components/select/SelectAvailableKettlebells";
import TODO from "@/components/TODO";
import { DEFAULT_VALUES } from "@/constants";
import { Typography } from "@mui/material";
import { useState } from "react";

interface Props {
  api: PreferenceValueAPI<number[]>;
}

const SelectKettlebells: React.FC<Props> = (props) => {
  const api = useSelectKettlebellsAPI(props);

  const help = (
    <Typography variant="caption" color="text.secondary">
      TODO
    </Typography>
  );

  return (
    <LabeledValue label={props.api.label} help={help}>
      <SelectAvailableKettlebells
        availableKettlebells={api.availableKettlebells}
        selectedKettlebells={props.api.value}
        setSelectedKettlebells={props.api.setValue}
        weightUnit={"pounds"}
      />
      <TODO>This isn't spaced right for some reason.</TODO>
    </LabeledValue>
  );
};

export default SelectKettlebells;

const useSelectKettlebellsAPI = (_props: Props) => {
  const [availableKettlebells] = useState(
    DEFAULT_VALUES.AVAILABLE_KETTLEBELLS_LBS,
  );

  return { availableKettlebells };
};
