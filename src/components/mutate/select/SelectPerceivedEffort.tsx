import { PerceivedEffort, RDispatch } from "@/common-types";
import DisplayPerceivedEffort from "@/components/display/DisplayPerceivedEffort";
import { Constants } from "@/database.types";
import { useRPCMutation } from "@/hooks";
import ClearIcon from "@mui/icons-material/Clear";
import {
  IconButton,
  Snackbar,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { useCallback, useState } from "react";

interface SelectPerceivedEffortProps {
  userId: string;
  exerciseId: string;
  perceivedEffort: PerceivedEffort | null;
  setPerceivedEffort: RDispatch<PerceivedEffort | null>;
  initialEditingState: boolean;
}

const SelectPerceivedEffort: React.FC<SelectPerceivedEffortProps> = (props) => {
  const api = useSelectPerceivedEffortAPI(props);

  return (
    <Stack
      direction="row"
      sx={{
        overflow: "hidden",
        justifyContent: "flex-end",
        position: "relative",
      }}
    >
      <ToggleButtonGroup
        value={props.perceivedEffort}
        exclusive
        onChange={api.handlePerceivedEffortChange}
        disabled={api.isPending}
        sx={{
          // We render this as hidden because we want to maintain the space so
          // it looks better when the toggle buttons "pop in"
          visibility: api.isEditing ? "visible" : "hidden",
          opacity: api.isPending ? 0.6 : 1,
        }}
      >
        <ToggleButton size="small" value="clear">
          <ClearIcon />
        </ToggleButton>
        {Constants.public.Enums.perceived_effort_enum.map((effort) => (
          <ToggleButton size="small" key={effort} value={effort}>
            <DisplayPerceivedEffort perceivedEffort={effort} />
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
      {!api.isEditing && (
        <IconButton
          onClick={api.handleStartEditing}
          disabled={api.isPending}
          sx={{
            position: "absolute",
            right: 0,
            opacity: api.isPending ? 0.5 : 1,
          }}
        >
          <DisplayPerceivedEffort perceivedEffort={props.perceivedEffort} />
        </IconButton>
      )}
      <Snackbar
        open={!!api.error}
        autoHideDuration={2000}
        message={api.error}
      />
    </Stack>
  );
};

export default SelectPerceivedEffort;

const useSelectPerceivedEffortAPI = (props: SelectPerceivedEffortProps) => {
  const { userId, exerciseId, setPerceivedEffort, perceivedEffort } = props;
  const [isEditing, setIsEditing] = useState(props.initialEditingState);
  const api = useRPCMutation(
    "update_perceived_effort",
    useCallback(
      (error: Error) => `Failed to update perceived effort: ${error.message}`,
      [],
    ),
  );

  const handleStartEditing = useCallback(() => {
    setIsEditing(true);
  }, []);

  const updatePerceivedEffortAsync = useCallback(
    async (newValue: PerceivedEffort | null) => {
      setPerceivedEffort(newValue);
      try {
        await api.trigger({
          p_user_id: userId,
          p_exercise_id: exerciseId,
          p_perceived_effort: newValue ?? undefined,
        });
      } catch {
        setPerceivedEffort(perceivedEffort);
      }
    },
    [api, userId, exerciseId, setPerceivedEffort, perceivedEffort],
  );

  const handlePerceivedEffortChange = useCallback(
    (_e: React.MouseEvent<HTMLElement>, value: string | null) => {
      setIsEditing(false);
      switch (value) {
        case null:
          return;
        case "clear":
          updatePerceivedEffortAsync(null);
          return;
        default:
          updatePerceivedEffortAsync(value as PerceivedEffort);
          return;
      }
    },
    [updatePerceivedEffortAsync],
  );

  return {
    isEditing,
    isPending: api.isMutating,
    error: api.errorMessage,
    setIsEditing,
    handleStartEditing,
    handlePerceivedEffortChange,
  };
};
