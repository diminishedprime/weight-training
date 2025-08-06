import { MyThemeOptions, RDispatch } from "@/common-types";
import LabeledValue from "@/components/LabeledValue";
import { ThemeContext } from "@/components/ThemeProvider";
import TODO from "@/components/TODO";
import { useModifiableLabel } from "@/hooks";
import RestoreIcon from "@mui/icons-material/Restore";
import { Box, Button, createTheme, Stack, Switch } from "@mui/material";
import isEqual from "lodash/isEqual";
import { MuiColorInput } from "mui-color-input";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

interface ThemeProps {
  serverThemeOptions: MyThemeOptions;
  setThemeOptions: RDispatch<MyThemeOptions>;
  setModified: RDispatch<boolean>;
}

const Theme: React.FC<ThemeProps> = (props) => {
  const api = useThemeAPI(props);
  return (
    <LabeledValue label="Theme" labelVariant="h6">
      <Stack spacing={1}>
        <Stack direction="row" spacing={1} useFlexGap>
          <LabeledValue label={api.darkModeLabel}>
            <Switch
              checked={api.mode === "dark"}
              onChange={(_, checked) =>
                api.setMode((_) => (checked ? "dark" : "light"))
              }
            />
          </LabeledValue>
          <TODO>Add in a drop-down here with some pre-made themes.</TODO>
        </Stack>
        <Stack spacing={1}>
          <LabeledValue label="Colors" labelVariant="body1">
            <Stack direction="row" spacing={1} alignItems="center">
              <LabeledValue label={api.primaryLabel}>
                <MuiColorInput
                  size="small"
                  value={api.primary}
                  onChange={api.setPrimary}
                  isAlphaHidden={true}
                />
              </LabeledValue>
              <LabeledValue label={api.secondaryLabel}>
                <MuiColorInput
                  size="small"
                  value={api.secondary}
                  onChange={api.setSecondary}
                  isAlphaHidden={true}
                />
              </LabeledValue>
            </Stack>
          </LabeledValue>
        </Stack>
        <Stack direction="row">
          <Box flex={1} />
          <Button
            variant="outlined"
            color="error"
            sx={{ alignSelf: "center", justifySelf: "flex-end" }}
            onClick={api.resetTheme}
            startIcon={<RestoreIcon />}
          >
            Defaults
          </Button>
        </Stack>
      </Stack>
    </LabeledValue>
  );
};

export default Theme;

const useThemeAPI = (props: ThemeProps) => {
  const { serverThemeOptions, setModified, setThemeOptions } = props;

  // This is a bit hacky, but I do know for sure that the ThemeContext isn't
  // _actually_ ever null, just an issue with react and context.
  const { setTheme } = useContext(ThemeContext)!;

  const [primary, setPrimary] = useState(
    serverThemeOptions?.palette?.primary?.main || "#1976d2",
  );
  const [secondary, setSecondary] = useState(
    serverThemeOptions?.palette?.secondary?.main || "#9c27b0",
  );
  const [mode, setMode] = useState(
    serverThemeOptions?.palette?.mode || "light",
  );

  const darkModeLabel = useModifiableLabel(
    "Dark Mode",
    serverThemeOptions?.palette?.mode !== mode,
  );
  const primaryLabel = useModifiableLabel(
    "Primary",
    serverThemeOptions?.palette?.primary?.main !== primary,
  );
  const secondaryLabel = useModifiableLabel(
    "Secondary",
    serverThemeOptions?.palette?.secondary?.main !== secondary,
  );

  const resetTheme = useCallback(() => {
    setPrimary("#1976d2");
    setSecondary("#9c27b0");
    setMode("light");
  }, []);

  const constructedTheme: MyThemeOptions = useMemo(
    () => ({
      palette: {
        primary: {
          main: primary,
        },
        secondary: {
          main: secondary,
        },
        mode,
      },
    }),
    [primary, secondary, mode],
  );

  // Debounce theme update to avoid expensive re-renders
  const debouncedSetTheme = useDebouncedCallback(
    (constructedTheme: MyThemeOptions) => {
      setTheme((_) => createTheme(constructedTheme));
      setThemeOptions((_) => constructedTheme);
    },
    50,
    { trailing: true },
  );

  useEffect(() => {
    debouncedSetTheme(constructedTheme);
  }, [constructedTheme, debouncedSetTheme]);

  useEffect(() => {
    setModified((_) => !isEqual(constructedTheme, serverThemeOptions));
  }, [constructedTheme, serverThemeOptions, setModified]);

  return {
    mode,
    setMode,
    darkModeLabel,
    primary,
    setPrimary,
    primaryLabel,
    secondary,
    setSecondary,
    secondaryLabel,
    resetTheme,
  };
};
