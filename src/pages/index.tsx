import React from 'react';
import { PageProps } from 'gatsby';
import { Button } from '@mui/material';
import Layout from '@/components/Layout';
import { Links } from '@/constants';
import { exerciseUIString } from '@/util';
import { Exercise } from '@/types';

const homeData: [string, string][] = [
  [Links.Deadlift, exerciseUIString(Exercise.Deadlift)],
  [Links.Squat, exerciseUIString(Exercise.Squat)],
  [Links.FrontSquat, exerciseUIString(Exercise.FrontSquat)],
  [Links.BenchPress, exerciseUIString(Exercise.BenchPress)],
  [Links.OverheadPress, exerciseUIString(Exercise.OverheadPress)],
  [Links.Snatch, exerciseUIString(Exercise.Snatch)],
];

const Home: React.FC<PageProps> = () => (
  <Layout title="Home">
    {homeData.map(([href, uiText]) => (
      <Button sx={{ m: 1 }} variant="contained" href={href}>
        {uiText}
      </Button>
    ))}
  </Layout>
);

export default Home;
