import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import MUISelect from "@material-ui/core/Select";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1)
  }
}));

interface Select2Props<T> {
  label?: string;
  options: T[];
  toValue: (t: T) => string;
  toText: (t: T) => string;
  initial?: T;
  update: (t: T) => void;
  className?: string;
}

const Select = <T extends unknown>({
  className,
  toValue,
  toText,
  label,
  initial,
  options,
  update
}: Select2Props<T>) => {
  const classes = useStyles();
  const [localValue, setLocalValue] = React.useState<T | "">(initial || "");

  const onChange = (
    event: React.ChangeEvent<{ name?: string; value: unknown }>
  ) => {
    setLocalValue(event.target.value as T | "");
  };

  React.useEffect(() => {
    if (localValue !== "") {
      update(localValue);
    }
  }, [localValue, update]);

  return (
    <FormControl className={classes.formControl}>
      {label && <InputLabel>{label}</InputLabel>}
      <MUISelect
        autoWidth
        value={localValue}
        onChange={onChange}
        className={className}
      >
        {options.map((option) => {
          const value = toValue(option);
          const text = toText(option);
          return (
            <MenuItem key={value} value={value}>
              {text}
            </MenuItem>
          );
        })}
      </MUISelect>
    </FormControl>
  );
};

export default Select;
