import { Box, css } from '@mui/material';
import * as React from 'react';
import { metalCss } from '@/components/common/Bar';
import { Weight_V1 } from '@/types';

interface DumbbellProps {
  weight: Weight_V1;
  viewportWidth: number;
}

//             16.69
//  |----------------------|
//   5.825
//  |-----|  5.04            _
//  =======|-------|======== |
//  =======         ======== |
//  ======================== | 8.54
//  =======         ======== |
//  =======         ======== -
//
//  Ratio of Height to Width = 8.54 / 16.69 = 0.511
//  For every 1 "unit" of Width, there should be 0.511 "units" of Height
//  For every 1 "unit" of Height, there should be 1 / 0.511 "units" of Height
//
const TotalWidth = 16.69;
const HandleWidth = 5.04;
const TotalHeight = 8.54;
const BulbHeight = 8.54;
const HandleHeight = 1.6;

const BulbWidthP = ((TotalWidth - HandleWidth) / 2 / TotalWidth) * 100;
const BulbHeightP = 100;
const HandleHeightP = (HandleHeight / BulbHeight) * 100;
const HandleWidthP = (HandleWidth / TotalWidth) * 100;

const Ratio = TotalHeight / TotalWidth;

const Dumbbell: React.FC<DumbbellProps> = ({ weight, viewportWidth }) => {
  const ref = React.useRef<HTMLElement>(null);
  const [height, setHeight] = React.useState(0);
  React.useEffect(() => {
    if (ref.current === null) {
      return;
    }
    const actualWidth = ref.current.clientWidth;
    setHeight(actualWidth * Ratio);
  }, [ref]);

  const bulbCss = css`
    height: ${BulbHeightP}%;
    width: ${BulbWidthP}%;
    background-color: black;
    border-radius: ${height / 10}px;
    color: white;
    writing-mode: vertical-rl;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 150%;
    font-weight: bold;
  `;

  return (
    <Box
      css={css`
        height: ${height}px;
        width: ${viewportWidth}vw;
        display: flex;
        align-items: center;
      `}
      ref={ref}
    >
      <Box
        css={css`
          ${bulbCss};
          transform: rotate(180deg);
        `}
      >
        {weight.value}
      </Box>
      <Box
        css={css`
          ${metalCss};
          height: ${HandleHeightP}%;
          width: ${HandleWidthP}%;
        `}
      />
      <Box css={bulbCss}>{weight.value}</Box>
    </Box>
  );
};

export default Dumbbell;
