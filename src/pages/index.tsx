import React from 'react';
import { PageProps } from 'gatsby';
import Layout from '@/components/Layout';
import Home from '@/components/pages/Home';

const Page: React.FC<PageProps> = () => (
  <Layout title="weight-training">
    <Home />
  </Layout>
);

export default Page;
