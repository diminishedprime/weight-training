import * as React from "react";

export interface Option<T> {
  label: string;
  value: T;
}

interface SelectProps<T> {
  options: Array<Option<T>>;
  initial: T;
  onChange: React.Dispatch<React.SetStateAction<T>>;
}

// T must be able to be stringy in order for this to work. I want to say that
// the constraints are that T must be an enum, but I can't figure out how to do
// that.
const Select = <T extends unknown>({
  onChange,
  options,
  initial
}: SelectProps<T>) => {
  const [selected, setSelected] = React.useState<T>(initial);

  React.useEffect(() => {
    if (selected !== undefined) {
      onChange(selected);
    }
  }, [selected, onChange]);

  return (
    <div className="select">
      <select
        value={((selected as any) as string) || "__DEFAULT_VALUE"}
        onChange={(e) => setSelected((e.target.value as any) as T)}
      >
        {options.map(({ label, value }) => (
          <option
            key={(value as any) as string}
            value={(value as any) as string}
          >
            {label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;
