import { Clear } from '@mui/icons-material';
import { Box, IconButton, TextField, Typography } from '@mui/material';
import { Link } from 'gatsby';
import * as React from 'react';
import { linkForExercise } from '@/constants';
import useExerciseSearch from '@/components/common/ExerciseSearch/useExerciseSearch';

const ExerciseSearch: React.FC = () => {
  const api = useExerciseSearch();
  return (
    <>
      <TextField
        sx={{ my: 1 }}
        fullWidth
        size="small"
        label="Search for an exercise"
        value={api.search}
        onChange={(e) => api.setSearch(e.target.value)}
        InputProps={{
          endAdornment: (
            <IconButton onClick={() => api.setSearch('')}>
              <Clear />
            </IconButton>
          ),
        }}
      />
      {api.filteredExercises.map((e) => (
        <Box key={e.exercise}>
          <Typography variant="h6">
            <Link to={linkForExercise(e.exercise)}>{e.uiString}</Link>
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', ml: -1 }}>
            <Typography sx={{ ml: 1, fontWeight: 500 }}>Equipment</Typography>
            {e.equipment.map((eq) => (
              <Typography sx={{ ml: 1 }} key={`${e.exercise}-${eq}`}>
                {eq}
              </Typography>
            ))}
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', ml: -1 }}>
            <Typography sx={{ ml: 1, fontWeight: 500 }}>Targets</Typography>
            {e.targetAreas.map((eq) => (
              <Typography sx={{ ml: 1 }} key={`${e.exercise}-${eq}`}>
                {eq}
              </Typography>
            ))}
          </Box>
        </Box>
      ))}
    </>
  );
};

export default ExerciseSearch;
