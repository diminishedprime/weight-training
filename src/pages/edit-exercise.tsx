import React from 'react';
import { PageProps } from 'gatsby';
import Layout from '@/components/Layout';
import EditExercise from '@/components/pages/EditExercise';
import PageRequiresLogin from '@/components/common/PageRequiresLogin';

const Page: React.FC<PageProps> = () => (
  <Layout title="Edit Exercise" LoggedOut={PageRequiresLogin}>
    <EditExercise />
  </Layout>
);

export default Page;
