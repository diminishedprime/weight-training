import { Box, Button, Typography } from '@mui/material';
import * as React from 'react';
import { linkForExercise } from '@/constants';
import { exerciseUIString } from '@/types';
import useUserDoc from '@/firebase/hooks/useUserDoc';
import CenteredSpinny from '@/components/common/CenteredSpinny';
import Settings from '@/components/pages/Home/Settings';
import ExerciseSearch from '@/components/common/ExerciseSearch';

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
      <ExerciseSearch />
    </Box>
  );
};

export default Home;
