'use client'
import { Box, Button, Typography } from '@mui/material';
import { ColorSchemeSelection } from './components/color-scheme-selection';

export default function Home() {
  return (
    <Box className='flex flex-col justify-center items-center gap-2'>
      <Typography>Hello World</Typography>
      <Button variant='contained'>Hello world</Button>
      <ColorSchemeSelection />
    </Box>
  );
}
