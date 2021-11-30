import React from 'react';
import { PageProps } from 'gatsby';
import Layout from '@/components/Layout';
import Exercise from '@/components/pages/Exercise';
import PageRequiresLogin from '@/components/common/PageRequiresLogin';

const Page: React.FC<PageProps> = () => (
  <Layout title="Exercise" LoggedOut={PageRequiresLogin}>
    <Exercise />
  </Layout>
);

export default Page;
