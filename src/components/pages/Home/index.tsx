import { Box, Button, Typography } from '@mui/material';
import * as React from 'react';
import { linkForExercise, Links } from '@/constants';
import { Exercise, exerciseUIString } from '@/types';
import useUserDoc from '@/firebase/hooks/useUserDoc';
import CenteredSpinny from '@/components/common/CenteredSpinny';
import Settings from '@/components/pages/Home/Settings';

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

const Home: React.FC = () => {
  const userDocRequest = useUserDoc();

  const pinned = React.useMemo(() => {
    if (
      userDocRequest.type === 'in-progress' ||
      userDocRequest.type === 'not-started'
    ) {
      return <CenteredSpinny />;
    }
    if (
      userDocRequest.type === 'resolved' &&
      userDocRequest.userDoc.pinnedExercises.type === 'set'
    ) {
      return (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="h6">Pinned Exercises</Typography>
            <Settings userDoc={userDocRequest.userDoc} />
          </Box>
          {userDocRequest.userDoc.pinnedExercises.exercises.map((e) => (
            <Button
              sx={{ mr: 1 }}
              variant="contained"
              size="small"
              key={e}
              href={linkForExercise(e)}
            >
              {exerciseUIString(e)}
            </Button>
          ))}
          <Box sx={{ mb: 1 }} />
        </>
      );
    }
    return null;
  }, [userDocRequest]);

  return (
    <Box sx={{ mx: 1 }}>
      {pinned}
      <Typography variant="h6">Powerlifting</Typography>
      {powerlifting.map(([href, uiText]) => (
        <Button
          sx={{ mr: 1 }}
          variant="contained"
          key={href}
          href={href}
          size="small"
        >
          {uiText}
        </Button>
      ))}
      <Box sx={{ mb: 1 }} />
      <Typography variant="h6">Bar Accessory</Typography>
      {barAccessory.map(([href, uiText]) => (
        <Button
          sx={{ mr: 1 }}
          variant="contained"
          key={href}
          href={href}
          size="small"
        >
          {uiText}
        </Button>
      ))}
      <Box sx={{ mb: 1 }} />
      <Typography variant="h6">Dumbbell</Typography>
      {commonDumbbell.map(([href, uiText]) => (
        <Button
          sx={{ mr: 1, mb: 1 }}
          variant="contained"
          key={href}
          href={href}
          size="small"
        >
          {uiText}
        </Button>
      ))}
    </Box>
  );
};

export default Home;
