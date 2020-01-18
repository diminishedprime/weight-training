import classNames from "classnames";
import { ClassArray } from "classnames/types";
import * as React from "react";

interface WithLabelProps {
  label: string;
  fieldClasses?: ClassArray;
  childrenClasses?: ClassArray;
}

export const WithLabel: React.FC<WithLabelProps> = ({
  label,
  children,
  fieldClasses = [],
  childrenClasses = []
}) => {
  return (
    <div className={classNames("field", fieldClasses)}>
      <label className="label">{label}</label>
      <div className={classNames("field", childrenClasses)}>{children}</div>
    </div>
  );
};

export default WithLabel;
