"use client";
import { MyThemeOptions, RDispatch } from "@/common-types";
import { useThrottledValue } from "@/hooks";
import {
  createTheme,
  ThemeProvider as MUIThemeProvider,
  Theme,
} from "@mui/material";
import merge from "lodash/merge";
import { createContext, useCallback, useEffect, useState } from "react";

interface ThemeProviderProps {
  children: React.ReactNode;
  // Theme options need to be passed as opposed to a theme because you can't
  // pass objects with functions to client components in next.
  themeOptions: MyThemeOptions;
}

interface ThemeContextType {
  theme: Theme;
  setThemeOptions: RDispatch<MyThemeOptions>;
}
export const ThemeContext = createContext<ThemeContextType | null>(null);

const ThemeProvider: React.FC<ThemeProviderProps> = (props) => {
  const api = useThemeProviderAPI(props);

  return (
    <ThemeContext.Provider value={api}>
      <MUIThemeProvider theme={api.theme}>{props.children}</MUIThemeProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;

const baseThemeOptions = {
  components: {
    MuiStack: {
      defaultProps: {
        useFlexGap: true,
        spacing: 1,
      },
    },
  },
} as MyThemeOptions;

const useThemeProviderAPI = (props: ThemeProviderProps) => {
  const [themeOptions, setThemeOptions] = useState<MyThemeOptions>(
    merge(baseThemeOptions, props.themeOptions),
  );

  const [theme, setTheme] = useState<Theme>(createTheme(themeOptions));

  const setThemeOptionsWithDefaults: RDispatch<MyThemeOptions> = useCallback(
    (o) =>
      setThemeOptions((prev) => ({
        ...baseThemeOptions,
        ...(typeof o === "function" ? o(prev) : o),
      })),
    [],
  );

  const throttledOptions = useThrottledValue(themeOptions, 50);

  useEffect(() => {
    setTheme(createTheme(throttledOptions));
  }, [throttledOptions]);

  return { theme, setThemeOptions: setThemeOptionsWithDefaults };
};
