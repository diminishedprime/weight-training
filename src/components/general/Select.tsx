import * as React from "react";

interface Option {
  label: string;
  value: string;
}

interface SelectProps
  extends React.DetailedHTMLProps<
    React.SelectHTMLAttributes<HTMLSelectElement>,
    HTMLSelectElement
  > {
  options: Option[];
}
const Select: React.FC<SelectProps> = ({ options, ...props }) => {
  return (
    <div className="select">
      <select {...props}>
        {options.map(({ label, value }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;
