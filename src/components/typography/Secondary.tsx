import { Typography, TypographyProps } from "@mui/material";
import { PropsWithChildren } from "react";

interface Props {
  variant?: TypographyProps["variant"];
}

const Secondary: React.FC<PropsWithChildren<Props>> = (props) => {
  return (
    <Typography
      component="span"
      color="secondary"
      variant={props.variant || "body1"}
    >
      {props.children}
    </Typography>
  );
};

export default Secondary;
