import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { useCallback, useMemo } from "react";

interface SelectNumberProps {
  selectedNumber: number;
  setSelectedNumber: React.Dispatch<React.SetStateAction<number>>;
  choices: number[];
}

const SelectNumber: React.FC<SelectNumberProps> = (props) => {
  const api = useSelectNumberAPI(props);
  return (
    <ToggleButtonGroup
      color="primary"
      value={props.selectedNumber}
      exclusive
      onChange={(_, number) => api.onChange(number)}
      size="small"
      aria-label="Select Number"
    >
      <ToggleButton
        value="-"
        disabled={api.isDecrementDisabled}
        aria-label="decrement number"
        size="small"
      >
        -
      </ToggleButton>
      {props.choices.map((number) => (
        <ToggleButton
          key={number}
          value={number}
          aria-label={`reps ${number}`}
          size="small"
        >
          {number}
        </ToggleButton>
      ))}
      <ToggleButton value="+" aria-label="increment number" size="small">
        +
      </ToggleButton>
    </ToggleButtonGroup>
  );
};

export default SelectNumber;

const useSelectNumberAPI = (props: SelectNumberProps) => {
  const { selectedNumber, setSelectedNumber } = props;
  const isDecrementDisabled = useMemo(() => {
    return selectedNumber < 2;
  }, [selectedNumber]);

  const onChange = useCallback(
    (number: number | string | null) => {
      if (number === null) return;
      if (typeof number === "string") {
        if (number === "-" && !isDecrementDisabled) {
          setSelectedNumber((prev) => Math.max(prev - 1, 1));
        } else if (number === "+") {
          setSelectedNumber((prev) => prev + 1);
        }
      } else {
        setSelectedNumber((_) => number);
      }
    },
    [isDecrementDisabled, setSelectedNumber],
  );

  return { isDecrementDisabled, onChange };
};
