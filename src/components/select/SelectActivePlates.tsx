"use client";

import { PLATE_COLORS } from "@/constants";
import { TestIds } from "@/test-ids";
import { fractionWeightFormat } from "@/util";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import RemoveIcon from "@mui/icons-material/Remove";
import UndoIcon from "@mui/icons-material/Undo";
import {
  Badge,
  Button,
  ButtonGroup,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import React from "react";

export interface SelectActivePlatesProps {
  availablePlates: number[];
  activePlates: Record<number, number>; // plate weight -> count
  label?: string;
  modified?: boolean;
  onAddPlate: (plate: number) => void;
  onRemovePlate: (plate: number) => void;
  removePlateDisabled: (plate: number) => boolean;
  onClear: () => void;
  clearDisabled: boolean;
  onUndo: () => void;
  undoDisabled: boolean;
  editing?: boolean;
}

const SelectActivePlates: React.FC<SelectActivePlatesProps> = (props) => {
  const api = useSelectActivePlatesAPI(props);

  return (
    <Stack
      direction="row"
      flexWrap="wrap"
      useFlexGap
      spacing={0.5}
      alignItems="flex-end"
      sx={{ mt: 1 }}
    >
      {props.editing && (
        <IconButton
          color="primary"
          size="small"
          onClick={props.onUndo}
          aria-label="Undo weight change"
          disabled={props.undoDisabled}
        >
          <UndoIcon />
        </IconButton>
      )}
      {props.availablePlates.map((plate) => {
        const count = props.activePlates[plate] || 0;
        const metadata = api.badgeMetadata[plate];
        return (
          <Stack
            key={plate}
            alignItems="center"
            sx={(theme) => ({
              visibility: !props.editing && count === 0 ? "hidden" : "visible",
              minWidth: theme.spacing(4),
            })}
          >
            <Badge badgeContent={count} sx={{ ...metadata.sx }}>
              <Typography
                sx={{
                  p: 0.5,
                  pb: 0,
                }}
              >
                {fractionWeightFormat(plate)}
              </Typography>
            </Badge>
            {props.editing && (
              <ButtonGroup orientation="vertical" size="small">
                <Button
                  size="small"
                  onClick={() => props.onAddPlate(plate)}
                  data-testid={TestIds.ActivePlate(plate)}
                >
                  <AddIcon fontSize="small" />
                </Button>
                <Button
                  size="small"
                  disabled={props.removePlateDisabled(plate)}
                  onClick={() => props.onRemovePlate(plate)}
                >
                  <RemoveIcon fontSize="small" />
                </Button>
              </ButtonGroup>
            )}
          </Stack>
        );
      })}
      {props.editing && (
        <IconButton
          data-testid={TestIds.ClearActivePlatesButton}
          color="error"
          size="small"
          onClick={props.onClear}
          aria-label="Clear plates"
          disabled={props.clearDisabled}
        >
          <DeleteOutlineIcon />
        </IconButton>
      )}
    </Stack>
  );
};

export default SelectActivePlates;

const useSelectActivePlatesAPI = (props: SelectActivePlatesProps) => {
  const badgeMetadata = React.useMemo(() => {
    const metadata: Record<
      number,
      { sx: object; testid: string; backgroundColor: string; color: string }
    > = {};
    Object.keys(PLATE_COLORS).forEach((plateStr) => {
      const plate = Number(plateStr);
      const bg = PLATE_COLORS[plate]?.bg || "gray";
      const fg = PLATE_COLORS[plate]?.fg || "white";
      metadata[plate] = {
        backgroundColor: PLATE_COLORS[plate]?.bg || "gray",
        color: PLATE_COLORS[plate]?.fg || "white",
        sx: {
          "& .MuiBadge-badge": {
            backgroundColor: bg,
            color: fg,
            border: `1px solid ${bg === "white" ? "black" : bg === "black" ? "white" : bg}`,
          },
        },
        testid: TestIds.ActivePlate(plate),
      };
    });
    return metadata;
  }, []);

  return {
    badgeMetadata,
  };
};
