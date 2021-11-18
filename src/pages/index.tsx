import React from 'react';
import { PageProps } from 'gatsby';
import { Typography } from '@mui/material';
import Layout from '@/components/Layout';

const Home: React.FC<PageProps> = () => (
  <Layout title="Home">
    <Typography>
      A TypeScript starter for Gatsby. Great for advanced users.
    </Typography>
  </Layout>
);

export default Home;
