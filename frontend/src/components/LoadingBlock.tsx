import { Box, CircularProgress } from '@mui/material';

export function LoadingBlock() {
  return (
    <Box sx={{ minHeight: 280, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <CircularProgress />
    </Box>
  );
}
