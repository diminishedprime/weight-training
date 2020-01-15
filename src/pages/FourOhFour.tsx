import React from "react";
import { Link } from "react-router-dom";
import * as hooks from "../hooks";

const FourOhFour = () => {
  hooks.useMeasurePage("404");
  return (
    <div>
      There is no page here. Please go <Link to="/">Home</Link>
    </div>
  );
};

export default FourOhFour;
