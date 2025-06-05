import type { Metadata } from "next";
import { CssBaseline } from "@mui/material";
import Banner from "@/components/banner";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";

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
        <CssBaseline />
        <AppRouterCacheProvider>
          <Banner />
          {children}
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
