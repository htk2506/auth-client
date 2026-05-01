import { Box, Button, Typography } from "@mui/material";
import { ColorSchemeSelection } from "./components/ColorSchemeSelection";

export default function Home() {
  return (
    <Box className="grid grid-cols-1 gap-2 place-items-center">
      <Typography>Hello World</Typography>
      <Button variant="contained">Hello world</Button>
      <ColorSchemeSelection />
    </Box>
  );
}
