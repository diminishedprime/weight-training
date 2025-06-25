import type { Metadata } from "next";
import Banner from "@/components/banner";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { CssBaseline, Stack } from "@mui/material";

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
          <Banner />
          <Stack
            sx={{
              maxWidth: "800px",
              mx: "auto",
              px: 2,
            }}>
            {children}
          </Stack>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
