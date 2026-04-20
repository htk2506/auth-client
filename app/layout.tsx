import MenuIcon from '@mui/icons-material/Menu';
import { AppBar, Box, Button, CssBaseline, IconButton, Toolbar, Typography } from "@mui/material";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v16-appRouter';
import InitColorSchemeScript from '@mui/material/InitColorSchemeScript';
import { ThemeProvider } from '@mui/material/styles';
import type { Metadata } from "next";
import theme from '../theme';
import { ColorSchemeSelection } from './components/ColorSchemeSelection';
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
    <html lang="en">
      <body className={`antialiased`}>
        <InitColorSchemeScript attribute="data" />
        <AppRouterCacheProvider options={{ enableCssLayer: true }}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box sx={{ flexGrow: 1 }}>
              <AppBar position="sticky">
                <Toolbar>
                  <IconButton
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    sx={{ mr: 2 }}
                  >
                    <MenuIcon />
                  </IconButton>
                  <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    Welcome
                  </Typography>
                  <Button color="inherit">Login</Button>
                </Toolbar>
              </AppBar>
              <Box className="mt-3">
                <ColorSchemeSelection />
                {children}
              </Box>
            </Box>
          </ThemeProvider >
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
