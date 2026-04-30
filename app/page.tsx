import { Button, Container, Typography } from "@mui/material";
import { ColorSchemeSelection } from "./components/ColorSchemeSelection";

export default function Home() {
  return (
    <Container>
      <Typography>Hello World</Typography>
      <Button variant="contained">Hello world</Button>
      <ColorSchemeSelection />
    </Container>
  );
}
