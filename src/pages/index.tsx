import React from 'react';
import { PageProps } from 'gatsby';
import { Typography } from '@mui/material';

const Home: React.FC<PageProps> = () => (
  <main>
    <Typography variant="h1">Hello TypeScript!</Typography>
    <Typography>
      A TypeScript starter for Gatsby. Great for advanced users.
    </Typography>
  </main>
);

export default Home;
