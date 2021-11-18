import React from 'react';
import { PageProps } from 'gatsby';
import { Link, Typography } from '@mui/material';
import Layout from '@/components/Layout';

const NotFound: React.FC<PageProps> = () => (
  <Layout title="404">
    <Typography>Sorry, page not found!</Typography>
    <Link href="/">Go Home</Link>
  </Layout>
);

export default NotFound;
