import * as React from "react";

interface CheckboxProps
  extends React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  label: string;
}
const Checkbox: React.FC<CheckboxProps> = ({ label, ...props }) => {
  return (
    <label className="checkbox">
      <input type="checkbox" {...props} />
      {label}
    </label>
  );
};

export default Checkbox;
