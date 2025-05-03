import * as React from 'react';
import { Box, css } from '@mui/material';
import { metalCss } from '@/components/common/Bar';
import { Weight_V1 } from '@/types';
import { MachineAPI } from '@/components/pages/Exercise/AddExercise/useMachineWeight';

interface MachineProps {
  machineAPI: MachineAPI;
}

const MachineStack: React.FC<MachineProps> = ({
  machineAPI: { weight, stack, setWeight },
}) => {
  const [selectedWeight, bumpSelected] = React.useMemo(() => {
    const selectedWeight = stack.weights.find((w) => {
      if (w.value === weight.value) {
        return true;
      }
      if (stack.bump && w.value === weight.value - stack.bump.value) {
        return true;
      }
      return false;
    });
    const bumpSelected =
      (stack.bump &&
        selectedWeight &&
        selectedWeight.value + stack.bump.value === weight.value) ||
      (stack.bump && weight.value === stack.bump.value);
    return [selectedWeight, bumpSelected];
  }, [weight]);

  const handleWeightClick = (w: Weight_V1) => {
    if (bumpSelected && stack.bump) {
      // If the bump is selected, add the bump value to the clicked weight
      setWeight({
        ...w,
        value: w.value + stack.bump.value,
      });
    } else {
      // Otherwise, just set the clicked weight
      setWeight(w);
    }
  };

  const handleBumpClick = () => {
    if (bumpSelected && selectedWeight) {
      // Turn off the bump
      setWeight(selectedWeight);
    } else if (selectedWeight && stack.bump) {
      // Turn on the bump
      setWeight({
        ...selectedWeight,
        value: selectedWeight.value + stack.bump.value,
      });
    }
  };

  return (
    <Box
      css={css`
        padding: 16px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1px;
      `}
    >
      {stack.bump && (
        <Box
          css={css`
            width: 75px;
            height: 20px;
            background-color: #444;
            border: 1px solid #222;
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
          `}
          onClick={handleBumpClick}
        >
          <Box
            css={css`
              position: absolute;
              left: 10px;
              color: white;
              font-size: 12px;
            `}
          >
            {stack.bump.value}
          </Box>
          <Box
            css={css`
              width: 10px;
              height: 10px;
              border-radius: 50%;
              background-color: ${bumpSelected ? 'red' : 'white'};
            `}
          />
        </Box>
      )}
      {stack.weights.map((w, index) => (
        <Box
          key={index}
          css={css`
            width: 100px;
            height: 20px;
            background-color: #444;
            border: 1px solid #222;
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
          `}
          onClick={() => handleWeightClick(w)}
        >
          <Box
            css={css`
              position: absolute;
              left: 10px;
              color: white;
              font-size: 12px;
            `}
          >
            {w.value}
          </Box>
          <Box
            css={css`
              width: 10px;
              height: 10px;
              border-radius: 50%;
              background-color: ${w === selectedWeight ? 'red' : 'white'};
            `}
          />
        </Box>
      ))}
    </Box>
  );
};

export default MachineStack;
