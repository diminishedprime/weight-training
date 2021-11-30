import { Box, Typography } from '@mui/material';
import * as React from 'react';
import { LoggedOutProps } from '@/components/Layout';

const PageRequiresLogin: React.FC<LoggedOutProps> = ({ LogIn }) => (
  <>
    <Typography>This page requires you to be logged in.</Typography>
    <Box sx={{ m: 1 }}>{LogIn}</Box>
  </>
);

export default PageRequiresLogin;
