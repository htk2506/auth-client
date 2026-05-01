import { Box, Link, Typography } from '@mui/material';

export default function NotFound() {
    return (
        <Box className="grid grid-cols-1 gap-2 place-items-center">
            <Typography variant="h1" className="text-2xl font-medium">
                404 Not Found
            </Typography>
            <Typography>
                Could not find the requested page.
            </Typography>
            <Link href="/">
                Home
            </Link>
        </Box>
    );
}