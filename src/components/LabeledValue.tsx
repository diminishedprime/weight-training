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

interface LabeledValueProps {
  label: React.ReactNode | string;
  labelVariant?: TypographyProps["variant"];
  labelColor?: TypographyProps["color"];
  children: React.ReactNode;
  gutterBottom?: boolean;
  alignItems?: StackProps["alignItems"];
  flex?: StackProps["flex"];
  help?: JSX.Element | string;
  width?: StackProps["width"];
}

const LabeledValue: React.FC<LabeledValueProps> = (props) => {
  const api = useLabeledValueAPI(props);
  return (
    <Stack
      alignItems={props.alignItems || undefined}
      flex={props.flex || undefined}
      width={props.width || undefined}
    >
      <Typography
        variant={props.labelVariant || "caption"}
        color={props.labelColor || "text.secondary"}
        gutterBottom={props.gutterBottom}
      >
        {props.label}
        {props.help && (
          <IconButton onClick={api.toggleHelp} color="primary">
            <InfoIcon />
          </IconButton>
        )}
      </Typography>
      {props.help && api.showHelp && (
        <Stack>
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
      {props.children}
    </Stack>
  );
};

export default LabeledValue;

const useLabeledValueAPI = (_props: LabeledValueProps) => {
  const [showHelp, setShowHelp] = useState(false);
  const toggleHelp = useCallback(() => {
    setShowHelp((prev) => !prev);
  }, []);
  return { showHelp, toggleHelp };
};
