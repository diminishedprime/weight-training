import Banner from "@/components/banner";
import { CssBaseline, Divider, Stack, Typography } from "@mui/material";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
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
  return (
    <html lang="en">
      <body>
        <AppRouterCacheProvider>
          <CssBaseline />
          <Stack
            spacing={1}
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
              spacing={1}
              flexGrow={1}
              sx={{
                px: 2,
                mb: 2,
              }}
            >
              {children}
            </Stack>
            <Stack
              component="footer"
              spacing={1}
              alignItems="center"
              sx={{ p: 1 }}
            >
              <Divider flexItem variant="inset" />
              <Typography>
                <Typography component="span" color="primary">
                  weight-training.app
                </Typography>
                , it&apos;s dot app
              </Typography>
            </Stack>
          </Stack>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
