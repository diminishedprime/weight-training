import React from 'react';
import { PageProps } from 'gatsby';
import Layout from '@/components/Layout';
import EditExercise from '@/components/pages/EditExercise';

const Page: React.FC<PageProps> = () => (
  <Layout title="Edit Exercise">
    <EditExercise />
  </Layout>
);

export default Page;
