import React from 'react';
import { PageProps } from 'gatsby';
import Layout from '@/components/Layout';
import Exercise from '@/components/Exercise';

const Page: React.FC<PageProps> = () => (
  <Layout title="Exercise">
    <Exercise />
  </Layout>
);

export default Page;
