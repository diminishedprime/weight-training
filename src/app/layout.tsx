import { MyThemeOptions } from "@/common-types";
import Banner from "@/components/banner";
import ThemeProvider from "@/components/ThemeProvider";
import { getSession, supabaseRPC } from "@/serverUtil";
import { CssBaseline, Divider, Stack, Typography } from "@mui/material";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { Analytics } from "@vercel/analytics/next";
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
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      </head>
      <body>
        <AppRouterCacheProvider>
          <ThemeProvider themeOptions={themeOptions}>
            <CssBaseline enableColorScheme />
            <Stack minHeight="100vh" maxWidth="800px" mx="auto">
              <Banner />
              <Stack flex={1} px={1}>
                {children}
                <Analytics />
              </Stack>
              <Stack component="footer" alignItems="center" p={1}>
                <Divider flexItem />
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

const getThemeOptions = async (): Promise<MyThemeOptions> => {
  const session = await getSession();
  if (!session?.user?.id) {
    return {};
  }
  const userId = session.user.id;
  const theme_options = await supabaseRPC("get_theme_options", {
    p_user_id: userId,
  });
  if (theme_options === null) {
    return {};
  }
  return theme_options as MyThemeOptions;
};
