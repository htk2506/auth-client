import { Box, Link, Typography } from '@mui/material';

export default function NotFound() {
    return (
        <Box className="flex h-full flex-col items-center justify-center gap-2">
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