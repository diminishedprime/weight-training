import { Link as MUILink, LinkProps as MUILinkProps } from "@mui/material";
import NextLink from "next/link";

// Intential wrapper in case we ever want to add more props.
type LinkProps = MUILinkProps;

const Link: React.FC<LinkProps> = (props) => {
  return <MUILink component={NextLink} {...props} />;
};

export default Link;
