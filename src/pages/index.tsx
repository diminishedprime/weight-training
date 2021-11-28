import React from 'react';
import { PageProps } from 'gatsby';
import Layout from '@/components/Layout';
import HomeComponent from '@/components/Home';

const Home: React.FC<PageProps> = () => (
  <Layout title="weight-training">
    <HomeComponent />
  </Layout>
);

export default Home;
