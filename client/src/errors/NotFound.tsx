import { Button, Container, Divider, Paper, Typography } from "@mui/material";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <Container component={Paper} sx={{ height: 400, p: 4 }}>
      <Typography gutterBottom variant="h3">Not found</Typography>
      <Divider />
      <Typography gutterBottom>The resource you are looking for could not be found.</Typography>
      <Button fullWidth component={Link} to='/catalog'>Go back to shop</Button>
    </Container>
  );
}