'use client'
import MenuIcon from '@mui/icons-material/Menu';
import { AppBar, Button, IconButton, Toolbar, Typography } from "@mui/material";
import { usePathname } from 'next/navigation';

export function RootLayoutAppBar() {
    const pathname = usePathname();
    const loginUrl = `/login?callback_url=${encodeURIComponent(pathname)}`

    return (
        <AppBar position="sticky">
            <Toolbar variant="dense">

                {/* TODO: Add functionality to menu button */}
                <IconButton
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    className="mr-2"
                >
                    <MenuIcon />
                </IconButton>

                <Typography variant="h6" className="grow">
                    Welcome
                </Typography>

                {/* TODO: Make button change to logout if signed in already */}
                <Button href={loginUrl} color="inherit">Login</Button>

            </Toolbar>
        </AppBar>
    );
}