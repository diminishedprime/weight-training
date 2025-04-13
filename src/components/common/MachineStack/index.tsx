import * as React from 'react';
import { Box, css } from '@mui/material';
import { metalCss } from '@/components/common/Bar';
import { Weight_V1 } from '@/types';

interface MachineProps {
  weight: Weight_V1;
}

const MachineStack: React.FC<MachineProps> = ({ weight }) => (
  // TODO - add in some code such that I can create small rectangles that look a
  // bit like a weight stack. The weights go in 5 pound increments, and it should be labeled

  <Box
    css={css`
      ${metalCss};
      padding: 8px;
    `}
  >
    {weight.value} {weight.unit}
  </Box>
);
export default MachineStack;
