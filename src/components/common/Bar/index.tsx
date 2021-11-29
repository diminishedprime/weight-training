import * as React from 'react';
import { css } from '@emotion/react';
import { reverse, sortBy } from 'lodash';
import { Typography } from '@mui/material';
import { PlateWeight } from '@/types';

const barWidthMM = 2200;
const sleeveWidthMM = 415;
const bushingWidthMM = 30;
const shaftWidthMM = 1310;
const plateWidthMM = 56;

const sleeveHeightMM = 50;
const bushingHeightMM = 70;
const shaftHeightMM = 28;
const plateHeightMM = 450;

const barWidthVW = 95;
const aspectRatio = 0.2;
const barHeightVW = barWidthVW * aspectRatio;

const sleeveWidthP = (sleeveWidthMM / barWidthMM) * 100;
const sleeveHeightP = (sleeveHeightMM / barWidthMM / aspectRatio) * 100;

const bushingWidthP = (bushingWidthMM / barWidthMM) * 100;
const bushingHeightP = (bushingHeightMM / barWidthMM / aspectRatio) * 100;

const shaftWidthP = (shaftWidthMM / barWidthMM) * 100;
const shaftHeightP = (shaftHeightMM / barWidthMM / aspectRatio) * 100;

const plateWidthVW = ((plateWidthMM / barWidthMM) * barHeightVW) / aspectRatio;
const plateHeightVW =
  ((plateHeightMM / barWidthMM) * barHeightVW) / aspectRatio;

const _5HeightMM = plateHeightMM / 1.5;
const _5HeightVW = ((_5HeightMM / barWidthMM) * barHeightVW) / aspectRatio;

const _2_5HeightMM = plateHeightMM / 2.0;
const _2_5HeightVW = ((_2_5HeightMM / barWidthMM) * barHeightVW) / aspectRatio;

const barWrapperCss = css`
  width: ${barWidthVW}vw;
  height: ${barHeightVW}vw;
  display: flex;
  align-items: center;
  margin: auto;
`;

const sleeveCss = css`
  width: ${sleeveWidthP}%;
  height: ${sleeveHeightP}%;
  display: flex;
  align-items: center;
`;

const bushingCss = css`
  width: ${bushingWidthP}%;
  height: ${bushingHeightP}%;
`;

const shaftCss = css`
  width: ${shaftWidthP}%;
  height: ${shaftHeightP}%;
  text-align: center;
`;

const plateCss = css`
  width: ${plateWidthVW}vw;
  height: ${plateHeightVW}vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: white;
  border: 0.5px solid black;
  border-radius: 3px;
`;

export const metalCss = css`
  background-image: linear-gradient(
    180deg,
    hsl(0, 0%, 78%) 0%,
    hsl(0, 0%, 90%) 47%,
    hsl(0, 0%, 78%) 53%,
    hsl(0, 0%, 70%) 100%
  );
`;

const leftCss = css`
  justify-content: end;
`;

const rightCss = css``;

const sideWaysTextRightCss = css`
  transform: rotate(90deg);
  font-size: ${plateWidthVW}vw;
`;

const sideWaysTextLeftCss = css`
  transform: rotate(270deg);
  font-size: ${plateWidthVW}vw;
`;

interface PlatesProps {
  plates: PlateWeight[];
  side: 'left' | 'right';
}

const cssForPlate = (plate: PlateWeight) => {
  const { value } = plate;
  switch (value) {
    case 45:
      return css`
        background-color: blue;
      `;
    case 25:
      return css`
        background-color: green;
      `;
    case 10:
      return css`
        background-color: black;
      `;
    case 5:
      return css`
        background-color: orange;
        height: ${_5HeightVW}vw;
      `;
    case 2.5:
      return css`
        background-color: pink;
        height: ${_2_5HeightVW}vw;
      `;
    default: {
      const exhaustiveCheck: never = value;
      throw new Error(`Unhandled case: ${exhaustiveCheck}`);
    }
  }
};

const Plates: React.FC<PlatesProps> = ({ plates, side }) => (
  <>
    {(side === 'left'
      ? sortBy(plates, (p) => p.value)
      : reverse(sortBy(plates, (p) => p.value))
    ).map((plate, idx) => (
      <div
        key={`${plate.value}-${idx}`}
        css={css`
          ${plateCss};
          ${cssForPlate(plate)};
        `}
      >
        <div css={side === 'left' ? sideWaysTextLeftCss : sideWaysTextRightCss}>
          {plate.value}
        </div>
      </div>
    ))}
  </>
);

// If I want to be fancy, I could also pass the bar here which could allow for
// better unit support and fewer magic values.
interface BarProps {
  // Holf of the plates on the bar.
  plates: PlateWeight[];
  noText?: true;
}

const Bar: React.FC<BarProps> = ({ plates, noText }) => (
  <div css={barWrapperCss}>
    <div
      css={css`
        ${metalCss};
        ${sleeveCss};
        ${leftCss};
      `}
    >
      <Plates side="left" plates={plates} />
    </div>
    <div
      css={css`
        ${metalCss};
        ${bushingCss};
      `}
    />
    <div
      css={css`
        ${metalCss}
        ${shaftCss};
      `}
    >
      {!noText && (
        <Typography variant="h4">
          {plates.reduce((acc, a) => acc + a.value, 0) * 2 + 45}
          {plates.length > 0 ? plates[0].unit : 'lbs'}
        </Typography>
      )}
    </div>
    <div
      css={css`
        ${metalCss};
        ${bushingCss};
      `}
    />
    <div
      css={css`
        ${metalCss};
        ${sleeveCss};
        ${rightCss};
      `}
    >
      <Plates side="right" plates={plates} />
    </div>
  </div>
);

export default Bar;
