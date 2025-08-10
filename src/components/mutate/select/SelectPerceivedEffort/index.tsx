import { PerceivedEffort, RDispatch } from "@/common-types";
import DisplayPerceivedEffort from "@/components/display/DisplayPerceivedEffort";
import { updatePerceivedEffort as serverUpdatePerceivedEffort } from "@/components/mutate/select/SelectPerceivedEffort/actions";
import TODO from "@/components/TODO";
import { Constants } from "@/database.types";
import ClearIcon from "@mui/icons-material/Clear";
import {
  IconButton,
  Snackbar,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { useCallback, useState, useTransition } from "react";

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
      <TODO>
        Support an additional sentiment in general, we want one that's more
        neutral and maybe like a gray color.
      </TODO>
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
        onClose={api.handleCloseError}
        message={api.error}
      />
    </Stack>
  );
};

export default SelectPerceivedEffort;

const useSelectPerceivedEffortAPI = (props: SelectPerceivedEffortProps) => {
  const { userId, exerciseId, setPerceivedEffort, perceivedEffort } = props;
  const [isEditing, setIsEditing] = useState(props.initialEditingState);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleStartEditing = useCallback(() => {
    setIsEditing(true);
  }, []);

  const handleCloseError = useCallback(() => {
    setError(null);
  }, []);

  const updatePerceivedEffort = useCallback(
    async (newValue: PerceivedEffort | null) => {
      setPerceivedEffort(newValue);
      startTransition(async () => {
        try {
          await serverUpdatePerceivedEffort(userId, exerciseId, newValue);
        } catch {
          startTransition(() => {
            setError("Failed to update perceived effort. Please try again.");
          });
        }
        startTransition(() => {
          setPerceivedEffort(perceivedEffort);
        });
      });
    },
    [userId, exerciseId, perceivedEffort, startTransition, setPerceivedEffort],
  );

  const handlePerceivedEffortChange = useCallback(
    (_e: React.MouseEvent<HTMLElement>, value: string | null) => {
      setIsEditing(false);
      if (value === "clear") {
        updatePerceivedEffort(null);
      } else if (value !== null) {
        updatePerceivedEffort(value as PerceivedEffort);
      }
    },
    [updatePerceivedEffort],
  );

  return {
    isEditing,
    isPending,
    error,
    setIsEditing,
    handleStartEditing,
    handlePerceivedEffortChange,
    handleCloseError,
  };
};
