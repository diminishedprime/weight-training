import { Box, useTheme } from '@mui/material';
import * as React from 'react';
import { BounceLoader } from 'react-spinners';

const CenteredSpinny: React.FC = () => {
  const theme = useTheme();
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
      <BounceLoader color={theme.palette.primary.main} />
    </Box>
  );
};

export default CenteredSpinny;
