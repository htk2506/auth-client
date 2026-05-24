'use client'
import { Box, CssBaseline } from "@mui/material";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v16-appRouter';
import InitColorSchemeScript from '@mui/material/InitColorSchemeScript';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../theme';
import { RootLayoutAppBar } from './components/RootLayoutAppBar';
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <title>{"Auth Client"}</title>
      <meta name="description" content={"Front-end for an auth server"} />
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
