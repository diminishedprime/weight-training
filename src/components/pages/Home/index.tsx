import { Box, Button, Divider, Typography } from '@mui/material';
import * as React from 'react';
import { Links } from '@/constants';
import { Exercise, exerciseUIString } from '@/types';

const powerlifting = [
  [Links.Squat, exerciseUIString(Exercise.Squat)],
  [Links.BenchPress, exerciseUIString(Exercise.BenchPress)],
  [Links.Deadlift, exerciseUIString(Exercise.Deadlift)],
];

const barAccessory = [
  [Links.FrontSquat, exerciseUIString(Exercise.FrontSquat)],
  [Links.OverheadPress, exerciseUIString(Exercise.OverheadPress)],
];

const commonDumbbell = [
  [Links.DumbbellFly, exerciseUIString(Exercise.DumbbellFly)],
  [Links.DumbbellRow, exerciseUIString(Exercise.DumbbellRow)],
  [Links.DumbbellBicepCurl, exerciseUIString(Exercise.DumbbellBicepCurl)],
  [Links.DumbbellHammerCurl, exerciseUIString(Exercise.DumbbellHammerCurl)],
];

const Home: React.FC = () => (
  <Box sx={{ mx: 1 }}>
    <Typography variant="h6">Powerlifting</Typography>
    {powerlifting.map(([href, uiText]) => (
      <Button sx={{ m: 1 }} variant="contained" key={href} href={href}>
        {uiText}
      </Button>
    ))}
    <Divider sx={{ my: 1, mx: -1 }} />
    <Typography variant="h6">Bar Accessory</Typography>
    {barAccessory.map(([href, uiText]) => (
      <Button sx={{ m: 1 }} variant="contained" key={href} href={href}>
        {uiText}
      </Button>
    ))}
    <Divider sx={{ my: 1, mx: -1 }} />
    <Typography variant="h6">Dumbbell</Typography>
    {commonDumbbell.map(([href, uiText]) => (
      <Button sx={{ m: 1 }} variant="contained" key={href} href={href}>
        {uiText}
      </Button>
    ))}
  </Box>
);

export default Home;
