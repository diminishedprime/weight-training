"use client";
// TODO: easy I should be able to make this a server component, but I'd just need to
// make the help-text specific parts be a client component.
import InfoIcon from "@mui/icons-material/InfoOutlined";
import {
  Button,
  IconButton,
  Stack,
  StackProps,
  Typography,
  TypographyProps,
} from "@mui/material";
import React, { JSX, useCallback, useState } from "react";

export interface Props {
  label: React.ReactNode | string;
  labelVariant?: TypographyProps["variant"];
  labelColor?: TypographyProps["color"];
  children: React.ReactNode;
  gutterBottom?: boolean;
  alignItems?: StackProps["alignItems"];
  flex?: StackProps["flex"];
  help?: JSX.Element | string;
  width?: StackProps["width"];
  sx?: StackProps["sx"];
  spacing?: StackProps["spacing"];
  onClick?: () => void;
}

const LabeledValue: React.FC<Props> = (props) => {
  // TODO:  I may want to make where the help shows configurable. Right now it's
  // always the bottom.
  const api = useLabeledValueAPI(props);
  return (
    <Stack
      alignItems={props.alignItems}
      flex={props.flex}
      width={props.width}
      onClick={props.onClick}
      sx={props.sx}
      spacing={props.spacing || 0}
    >
      <Typography
        variant={props.labelVariant || "body2"}
        color={props.labelColor || "text.primary"}
        gutterBottom={props.gutterBottom}
        component="span"
      >
        {props.label}
        <IconButton
          size="small"
          onClick={api.toggleHelp}
          color="primary"
          sx={{
            visibility: props.help ? "visible" : "hidden",
            width: props.help ? undefined : "0px",
            p: props.help ? undefined : 0,
          }}
        >
          <InfoIcon />
        </IconButton>
      </Typography>
      {props.children}
      {props.help && api.showHelp && (
        <Stack mt={1}>
          <Typography variant="caption" color="text.secondary" sx={{ flex: 1 }}>
            {props.help}
          </Typography>
          <Button
            color="error"
            onClick={api.toggleHelp}
            sx={{ alignSelf: "end" }}
          >
            Hide Help
          </Button>
        </Stack>
      )}
    </Stack>
  );
};

export default LabeledValue;

const useLabeledValueAPI = (_props: Props) => {
  const [showHelp, setShowHelp] = useState(false);
  const toggleHelp = useCallback(() => {
    setShowHelp((prev) => !prev);
  }, []);
  return { showHelp, toggleHelp };
};
