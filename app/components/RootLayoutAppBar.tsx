import { AppBar, Toolbar, IconButton, Typography, Button } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';

export function RootLayoutAppBar() {
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
                <Button href="/login" color="inherit">Login</Button>

            </Toolbar>
        </AppBar>
    );
}