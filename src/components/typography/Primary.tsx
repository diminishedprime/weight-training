import { Typography, TypographyProps } from "@mui/material";
import { PropsWithChildren } from "react";

interface Props {
  variant?: TypographyProps["variant"];
}

const Primary: React.FC<PropsWithChildren<Props>> = (props) => {
  return (
    <Typography
      component="span"
      color="primary"
      variant={props.variant || "body1"}
    >
      {props.children}
    </Typography>
  );
};

export default Primary;
