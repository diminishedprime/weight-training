"use client";

import React from "react";
import {
  Button,
  ButtonGroup,
  Badge,
  FormControl,
  FormLabel,
} from "@mui/material";
import { PLATE_COLORS } from "@/constants";

export interface SelectActivePlatesProps {
  availablePlates: number[];
  activePlates: Record<number, number>; // plate weight -> count
  label?: string;
  modified?: boolean;
  onAddPlate: (plate: number) => void;
  onClear: () => void;
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
    const metadata: Record<number, { sx: object }> = {};
    Object.keys(activePlates).forEach((plateStr) => {
      const plate = Number(plateStr);
      metadata[plate] = {
        sx: {
          "& .MuiBadge-badge": {
            backgroundColor: PLATE_COLORS[plate]?.bg || "gray",
            color: PLATE_COLORS[plate]?.fg || "white",
          },
        },
      };
    });
    return metadata;
  }, [activePlates]);

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

  return (
    <FormControl>
      <FormLabel>{api.label}</FormLabel>
      <ButtonGroup>
        {props.availablePlates.map((plate) => {
          const count = api.activePlates[plate] || 0;
          const metadata = api.badgeMetadata?.[plate];
          return (
            <Badge
              key={plate}
              sx={metadata?.sx}
              badgeContent={count > 0 ? count : undefined}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
              <Button size="small" onClick={() => api.onAddPlate(plate)}>
                {plate}
              </Button>
            </Badge>
          );
        })}
        <Button color="error" size="small" onClick={api.onClear}>
          Clear
        </Button>
      </ButtonGroup>
    </FormControl>
  );
};

export default SelectActivePlates;
