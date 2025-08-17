"use client";
import { MyThemeOptions, RDispatch } from "@/common-types";
import {
  createTheme,
  ThemeProvider as MUIThemeProvider,
  Theme,
} from "@mui/material";
import merge from "lodash/merge";
import { createContext, useCallback, useState } from "react";

interface ThemeProviderProps {
  children: React.ReactNode;
  // Theme options need to be passed as opposed to a theme because you can't
  // pass objects with functions to client components in next.
  themeOptions: MyThemeOptions;
}

interface ThemeContextType {
  theme: Theme;
  setTheme: RDispatch<Theme>;
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
  const [theme, setTheme] = useState<Theme>(
    createTheme(merge(baseThemeOptions, props.themeOptions)),
  );
  const setThemeWithDefaults: RDispatch<Theme> = useCallback((o) => {
    if (typeof o === "function") {
      setTheme((prev) => merge(baseThemeOptions, o(prev)));
    } else {
      setTheme((_) => merge(baseThemeOptions, o));
    }
  }, []);

  return { theme, setTheme: setThemeWithDefaults };
};
