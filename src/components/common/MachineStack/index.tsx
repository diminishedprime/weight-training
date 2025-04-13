import * as React from 'react';
import { metalCss } from '@/components/common/Bar';
import { Box, css } from '@mui/material';
import { Weight_V1 } from '@/types';

interface MachineProps {
  weight: Weight_V1;
  viewportWidth: number;
}

const MachineStack: React.FC<MachineProps> = ({ weight, viewportWidth }) => {
  // TODO - add in some code such that I can create small rectangles that look a
  // bit like a weight stack. The weights go in 5 pound increments, and it should be labeled

  return (
    <Box
      css={css`
        ${metalCss};
        padding: 8px;
      `}
    >
      {weight.value} {weight.unit}
    </Box>
  );
};

export default MachineStack;
