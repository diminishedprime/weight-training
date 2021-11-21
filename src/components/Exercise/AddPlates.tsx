import { Badge, Button } from '@mui/material';
import { css } from '@emotion/react';
import * as React from 'react';
import usePlates from './usePlates';

interface AddPlatesProps {
  api: ReturnType<typeof usePlates>;
}

interface BadgedButtonProps {
  count: number | undefined;
  buttonText: JSX.Element | string | number;
  onClick: () => void;
}

const BadgedButton: React.FC<BadgedButtonProps> = ({
  count,
  buttonText,
  onClick,
}) => (
  <Badge color="primary" badgeContent={count}>
    <Button variant="outlined" onClick={onClick}>
      {buttonText}
    </Button>
  </Badge>
);

const buttonGroupCss = css`
  *:not(:first-child) > button {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
  *:not(:last-child) > button {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }
  button:not(:last-child) {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }
  button:not(:first-child) {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
`;

const AddPlates: React.FC<AddPlatesProps> = ({ api }) => {
  const { add45, add25, add10, add5, add2_5, plateCounts, clearPlates } = api;
  return (
    <span css={buttonGroupCss}>
      <BadgedButton
        onClick={add45}
        buttonText={45}
        count={
          plateCounts.find(([p]) => p.value === 45 && p.unit === 'lb')?.[1]
        }
      />
      <BadgedButton
        onClick={add25}
        buttonText={25}
        count={
          plateCounts.find(([p]) => p.value === 25 && p.unit === 'lb')?.[1]
        }
      />
      <BadgedButton
        onClick={add10}
        buttonText={10}
        count={
          plateCounts.find(([p]) => p.value === 10 && p.unit === 'lb')?.[1]
        }
      />
      <BadgedButton
        onClick={add5}
        buttonText={5}
        count={plateCounts.find(([p]) => p.value === 5 && p.unit === 'lb')?.[1]}
      />
      <BadgedButton
        onClick={add2_5}
        buttonText={2.5}
        count={
          plateCounts.find(([p]) => p.value === 2.5 && p.unit === 'lb')?.[1]
        }
      />
      <Button color="warning" variant="outlined" onClick={clearPlates}>
        clear
      </Button>
    </span>
  );
};

export default AddPlates;
