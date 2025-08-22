import usePreferenceValue, {
  PreferenceValueAPI,
} from "@/app/preferences/_components/usePreferenceValue";
import { MyThemeOptions } from "@/common-types";
import LabeledValue from "@/components/LabeledValue";
import { ThemeContext } from "@/components/ThemeProvider";
import TODO from "@/components/TODO";
import RestoreIcon from "@mui/icons-material/Restore";
import { Box, Button, Stack, Switch } from "@mui/material";
import { MuiColorInput } from "mui-color-input";
import { useCallback, useContext, useEffect, useMemo } from "react";

interface ThemeProps {
  api: PreferenceValueAPI<MyThemeOptions>;
}

const Theme: React.FC<ThemeProps> = (props) => {
  const api = useThemeAPI(props);
  return (
    <LabeledValue label="Theme" labelVariant="h6">
      <Stack>
        <Stack direction="row">
          <LabeledValue label={api.modeApi.label}>
            <Switch
              checked={api.modeApi.value === "dark"}
              onChange={(_, checked) =>
                api.modeApi.setValue((_) => (checked ? "dark" : "light"))
              }
            />
          </LabeledValue>
          <TODO>Add in a drop-down here with some pre-made themes.</TODO>
        </Stack>
        <Stack>
          <LabeledValue label="Colors" labelVariant="body1">
            <Stack direction="row" alignItems="center">
              <LabeledValue label={api.primaryApi.label}>
                <MuiColorInput
                  size="small"
                  value={api.primaryApi.value || ""}
                  onChange={api.primaryApi.setValue}
                  isAlphaHidden={true}
                  format="hex"
                  fallbackValue={"#1976d2"}
                />
              </LabeledValue>
              <LabeledValue label={api.secondaryApi.label}>
                <MuiColorInput
                  size="small"
                  value={api.secondaryApi.value || ""}
                  onChange={api.secondaryApi.setValue}
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

  const themeContext = useContext(ThemeContext);

  const primary = usePreferenceValue(
    "Primary",
    "#1976d2",
    serverThemeOptions?.palette?.primary?.main || null,
    false,
  );

  const secondary = usePreferenceValue(
    "Secondary",
    "#9c27b0",
    serverThemeOptions?.palette?.secondary?.main || null,
    false,
  );

  const mode = usePreferenceValue<"light" | "dark">(
    "Mode",
    "light",
    serverThemeOptions?.palette?.mode || null,
    false,
  );

  const [
    { setValue: setPrimary },
    { setValue: setSecondary },
    { setValue: setMode },
  ] = [primary, secondary, mode];

  const resetTheme = useCallback(() => {
    setPrimary("#1976d2");
    setSecondary("#9c27b0");
    setMode("light");
  }, [setPrimary, setSecondary, setMode]);

  const constructedTheme: MyThemeOptions = useMemo(() => {
    const isValidColor = (color: string | null): color is string =>
      color !== null && /^#[0-9A-F]{6}$/i.test(color);
    const primaryColor = isValidColor(primary.value)
      ? primary.value
      : "#1976d2";
    const secondaryColor = isValidColor(secondary.value)
      ? secondary.value
      : "#9c27b0";

    return {
      palette: {
        primary: {
          main: primaryColor,
        },
        secondary: {
          main: secondaryColor,
        },
        mode: mode.value || "light",
      },
    };
  }, [primary.value, secondary.value, mode.value]);

  const { setThemeOptions: themeContextSet } = themeContext || {};
  useEffect(() => {
    themeContextSet?.((_) => constructedTheme);
    setThemeOptions(constructedTheme);
  }, [constructedTheme, themeContextSet, setThemeOptions]);

  return {
    resetTheme,
    primaryApi: primary,
    secondaryApi: secondary,
    modeApi: mode,
  };
};
