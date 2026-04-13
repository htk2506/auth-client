'use client';
import { createTheme } from '@mui/material/styles';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

const theme = createTheme({
    cssVariables: true,
    typography: {
        fontFamily: 'Roboto',
    },
});

export default theme;