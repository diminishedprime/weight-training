import { MyThemeOptions } from "@/common-types";
import Banner from "@/components/banner";
import ThemeProvider from "@/components/ThemeProvider";
import { getSession, supabaseRPC } from "@/serverUtil";
import { CssBaseline, Divider, Stack, Typography } from "@mui/material";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { Analytics } from "@vercel/analytics/next";
import merge from "lodash/merge";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Weight Training",
  description: "App to help you track your weight training.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const themeOptions = await getThemeOptions();
  return (
    <html lang="en">
      <body>
        <AppRouterCacheProvider>
          <ThemeProvider themeOptions={themeOptions}>
            <CssBaseline enableColorScheme />
            <Stack
              sx={{
                maxWidth: "800px",
                mx: "auto",
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Banner />
              <Stack
                flex={1}
                sx={{
                  px: 1,
                  mb: 2,
                }}
              >
                {children}
                <Analytics />
              </Stack>
              <Stack component="footer" alignItems="center" sx={{ p: 1 }}>
                <Divider flexItem variant="inset" />
                <Typography>
                  <Typography component="span" color="primary">
                    weight-training.app
                  </Typography>
                  , it&apos;s dot app
                </Typography>
              </Stack>
            </Stack>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}

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

const getThemeOptions = async (): Promise<MyThemeOptions> => {
  const session = await getSession();
  if (!session?.user?.id) {
    return { ...baseThemeOptions };
  }
  const userId = session.user.id;
  const theme_options = await supabaseRPC("get_theme_options", {
    p_user_id: userId,
  });
  if (theme_options === null) {
    return { ...baseThemeOptions };
  }
  // Use lodash merge for deep merging theme options
  return merge({}, baseThemeOptions, theme_options) as MyThemeOptions;
};
