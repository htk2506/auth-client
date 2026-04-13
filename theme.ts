'use client';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    cssVariables: true,
    typography: {
        fontFamily: 'Roboto',
    },
});

export default theme;