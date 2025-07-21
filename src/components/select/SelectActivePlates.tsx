"use client";

import React from "react";
import {
  Button,
  ButtonGroup,
  Badge,
  FormControl,
  FormLabel,
  IconButton,
  Stack,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { PLATE_COLORS } from "@/constants";
import { fractionWeightFormat } from "@/util";
import UndoIcon from "@mui/icons-material/Undo";
import { TestIds } from "@/test-ids";

export interface SelectActivePlatesProps {
  availablePlates: number[];
  activePlates: Record<number, number>; // plate weight -> count
  label?: string;
  modified?: boolean;
  onAddPlate: (plate: number) => void;
  onClear: () => void;
  clearDisabled: boolean;
  onUndo: () => void;
  undoDisabled: boolean;
}

const useSelectActivePlatesAPI = (props: SelectActivePlatesProps) => {
  const { activePlates, onAddPlate, onClear, modified, label } = props;

  const [localActivePlates, setLocalActivePlates] = React.useState<
    Record<number, number>
  >(activePlates || {});

  const localOnAddPlate = React.useCallback(
    (plate: number) => {
      const newActivePlates = { ...localActivePlates };
      newActivePlates[plate] = (newActivePlates[plate] || 0) + 1;
      setLocalActivePlates(newActivePlates);
      onAddPlate(plate);
    },
    [localActivePlates, onAddPlate]
  );

  const localOnClear = React.useCallback(() => {
    setLocalActivePlates({});
    onClear();
  }, [onClear]);

  const selectActivePlatesLabel = React.useMemo(() => {
    return `${label ?? "Active Plates"}${modified ? "*" : ""}`;
  }, [modified, label]);

  const badgeMetadata = React.useMemo(() => {
    const metadata: Record<number, { sx: object; testid: string }> = {};
    Object.keys(PLATE_COLORS).forEach((plateStr) => {
      const plate = Number(plateStr);
      metadata[plate] = {
        sx: {
          "& .MuiBadge-badge": {
            backgroundColor: PLATE_COLORS[plate]?.bg || "gray",
            color: PLATE_COLORS[plate]?.fg || "white",
          },
        },
        testid: TestIds.ActivePlate(plate),
      };
    });
    return metadata;
  }, []);

  React.useEffect(() => {
    setLocalActivePlates(activePlates);
  }, [activePlates]);

  return {
    activePlates: localActivePlates,
    onAddPlate: localOnAddPlate,
    onClear: localOnClear,
    label: selectActivePlatesLabel,
    badgeMetadata,
  };
};

const SelectActivePlates: React.FC<SelectActivePlatesProps> = (props) => {
  const api = useSelectActivePlatesAPI(props);

  // TODO consider making this a togglegroup thing instead of a button group. It
  // may look okay that way?

  return (
    <FormControl>
      <FormLabel>{api.label}</FormLabel>
      <Stack direction="row" flexWrap="wrap" useFlexGap spacing={0.5}>
        <IconButton
          color="primary"
          size="small"
          onClick={props.onUndo}
          aria-label="Undo weight change"
          disabled={props.undoDisabled}>
          <UndoIcon />
        </IconButton>
        <ButtonGroup>
          {props.availablePlates.map((plate) => {
            const count = api.activePlates[plate] || 0;
            const metadata = api.badgeMetadata?.[plate];
            return (
              <Badge
                key={plate}
                sx={metadata?.sx}
                data-testid={metadata?.testid}
                badgeContent={count > 0 ? count : undefined}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
                <Button size="small" onClick={() => api.onAddPlate(plate)}>
                  {fractionWeightFormat(plate)}
                </Button>
              </Badge>
            );
          })}
        </ButtonGroup>
        <IconButton
          color="error"
          size="small"
          onClick={api.onClear}
          aria-label="Clear plates"
          disabled={props.clearDisabled}>
          <DeleteOutlineIcon />
        </IconButton>
      </Stack>
    </FormControl>
  );
};

export default SelectActivePlates;
