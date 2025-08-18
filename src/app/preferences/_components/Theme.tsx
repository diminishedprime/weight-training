import { PreferenceValueAPI } from "@/app/preferences/_components/usePreferenceValue";
import { MyThemeOptions } from "@/common-types";
import LabeledValue from "@/components/LabeledValue";
import { ThemeContext } from "@/components/ThemeProvider";
import TODO from "@/components/TODO";
import { useModifiableLabel } from "@/hooks";
import RestoreIcon from "@mui/icons-material/Restore";
import { Box, Button, createTheme, Stack, Switch } from "@mui/material";
import { MuiColorInput } from "mui-color-input";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

interface ThemeProps {
  api: PreferenceValueAPI<MyThemeOptions>;
}

const Theme: React.FC<ThemeProps> = (props) => {
  const api = useThemeAPI(props);
  return (
    <LabeledValue label="Theme" labelVariant="h6">
      <Stack>
        <Stack direction="row">
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
        <Stack>
          <LabeledValue label="Colors" labelVariant="body1">
            <Stack direction="row" alignItems="center">
              <LabeledValue label={api.primaryLabel}>
                <MuiColorInput
                  size="small"
                  value={api.primary}
                  onChange={api.setPrimary}
                  isAlphaHidden={true}
                  format="hex"
                  fallbackValue={"#1976d2"}
                />
              </LabeledValue>
              <LabeledValue label={api.secondaryLabel}>
                <MuiColorInput
                  size="small"
                  value={api.secondary}
                  onChange={api.setSecondary}
                  isAlphaHidden={true}
                  format="hex"
                  fallbackValue={"#9c27b0"}
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
  const {
    api: { serverValue: serverThemeOptions, setValue: setThemeOptions },
  } = props;

  // This is a bit hacky, but I do know for sure that the ThemeContext isn't
  // _actually_ ever null, just an issue with react and context.
  const themeContext = useContext(ThemeContext);

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

  const constructedTheme: MyThemeOptions = useMemo(() => {
    const isValidColor = (color: string) => /^#[0-9A-F]{6}$/i.test(color);
    const primaryColor = isValidColor(primary) ? primary : "#1976d2";
    const secondaryColor = isValidColor(secondary) ? secondary : "#9c27b0";

    return {
      palette: {
        primary: {
          main: primaryColor,
        },
        secondary: {
          main: secondaryColor,
        },
        mode,
      },
    };
  }, [primary, secondary, mode]);

  // Debounce theme update to avoid expensive re-renders
  const debouncedSetTheme = useDebouncedCallback(
    (constructedTheme: MyThemeOptions) => {
      themeContext?.setTheme((_) => createTheme(constructedTheme));
      setThemeOptions((_) => constructedTheme);
    },
    50,
    { trailing: true },
  );

  useEffect(() => {
    debouncedSetTheme(constructedTheme);
  }, [constructedTheme, debouncedSetTheme]);

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
