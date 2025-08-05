import { updatePerceivedEffort as serverUpdatePerceivedEffort } from "@/app/superblocks/[superblock_id]/perform/_components/actions";
import { PerceivedEffort, RDispatch } from "@/common-types";
import DisplayPerceivedEffort from "@/components/display/DisplayPerceivedEffort";
import { PERCEIVED_EFFORTS } from "@/constants";
import { perceivedEffortUIString } from "@/uiStrings";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { useCallback } from "react";

interface UpdatePerceivedEffortProps {
  perceivedEffort: PerceivedEffort | null;
  setPerceivedEffort: RDispatch<PerceivedEffort | null>;
  userId: string;
  exerciseId: string;
}

const UpdatePerceivedEffort: React.FC<UpdatePerceivedEffortProps> = (props) => {
  const api = useUpdatePerceivedEffortAPI(props);
  return (
    <ToggleButtonGroup
      color="primary"
      value={props.perceivedEffort}
      exclusive
      onChange={(_e, effort) => {
        if (effort === "clear") {
          api.updatePerceivedEffort(props.perceivedEffort, null);
        } else {
          api.updatePerceivedEffort(props.perceivedEffort, effort);
        }
      }}
      size="large"
      aria-label="Effort"
    >
      {PERCEIVED_EFFORTS.map((effort) => (
        <ToggleButton
          size="small"
          key={effort}
          value={effort}
          aria-label={perceivedEffortUIString(effort)}
        >
          <DisplayPerceivedEffort perceivedEffort={effort} />
        </ToggleButton>
      ))}
      <ToggleButton
        size="small"
        value="clear"
        aria-label="Clear"
        data-testid="clear-perceived-effort"
      >
        Clear
      </ToggleButton>
    </ToggleButtonGroup>
  );
};

export default UpdatePerceivedEffort;

const useUpdatePerceivedEffortAPI = (props: UpdatePerceivedEffortProps) => {
  const { userId, exerciseId, setPerceivedEffort } = props;

  const updatePerceivedEffort = useCallback(
    async (
      oldEffort: PerceivedEffort | null,
      newEffort: PerceivedEffort | null,
    ) => {
      setPerceivedEffort(newEffort);
      try {
        await serverUpdatePerceivedEffort(userId, exerciseId, newEffort);
      } catch (e) {
        console.error("Failed to update perceived effort", e);
        setPerceivedEffort(oldEffort);
      }
    },
    [userId, exerciseId, setPerceivedEffort],
  );
  return { updatePerceivedEffort };
};
