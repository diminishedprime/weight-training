import * as React from "react";

interface WithLabelProps {
  label: string;
}

const Select: React.FC<WithLabelProps> = ({ label, children }) => {
  return (
    <div className="field">
      <label className="label">{label}</label>
      <div className="control">{children}</div>
    </div>
  );
};

export default Select;
