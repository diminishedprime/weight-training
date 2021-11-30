import React from 'react';
import { PageProps } from 'gatsby';
import Layout from '@/components/Layout';
import Home from '@/components/pages/Home';
import LoggedOut from '@/components/pages/Home/LoggedOut';

const Page: React.FC<PageProps> = () => (
  <Layout title="weight-training" LoggedOut={LoggedOut}>
    <Home />
  </Layout>
);

export default Page;
