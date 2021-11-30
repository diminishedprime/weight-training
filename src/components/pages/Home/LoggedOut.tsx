import { Typography } from '@mui/material';
import * as React from 'react';
import { LoggedOutProps } from '@/components/Layout';

const LoggedOut: React.FC<LoggedOutProps> = ({ LogIn }) => (
  <>
    <Typography variant="h6">About</Typography>
    <Typography>
      Weight-Training.app lets you log your exercises and keep track of goals.
    </Typography>
    <Typography variant="h6">Get Started</Typography>
    <Typography>To get started, {LogIn} with your Google account.</Typography>
  </>
);

export default LoggedOut;
