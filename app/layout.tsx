import { Box, CssBaseline } from "@mui/material";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v16-appRouter';
import InitColorSchemeScript from '@mui/material/InitColorSchemeScript';
import { ThemeProvider } from '@mui/material/styles';
import type { Metadata } from "next";
import theme from '../theme';
import { RootLayoutAppBar } from './components/RootLayoutAppBar';
import "./globals.css";

export const metadata: Metadata = {
  title: "Auth Client",
  description: "Front-end for an auth server",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`antialiased`}>
        <InitColorSchemeScript attribute="data" />
        <AppRouterCacheProvider options={{ enableCssLayer: true }}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box>
              <RootLayoutAppBar />
              <Box className="mt-5">
                {children}
              </Box>
            </Box>
          </ThemeProvider >
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
