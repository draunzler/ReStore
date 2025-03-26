import { Backdrop, Box, CircularProgress, Typography } from '@mui/material';

interface Props {
  message?: string;
}

export default function LoadingComponent({ message = 'Loading...' }: Props) {
  return (
    <Backdrop open={true} invisible={true}>
      <Box display='flex' justifyContent='center' alignItems='center' height='100vh' flexDirection='column'>
        <CircularProgress size={100} color='secondary' />
        <Typography variant='h4' sx={{ justifyContent: 'center', mt: 4 }}>{message}</Typography>
      </Box>
    </Backdrop>
  );
}