"use client";

import React, { useCallback } from "react";
import { Stack, Typography, Chip, Tooltip, IconButton } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { Set } from "immutable";
import { equipmentTypeUIString } from "@/uiStrings";
import type { Database } from "@/database.types";

/**
 * Type alias for equipment type enum from the database.
 */
type EquipmentType = Database["public"]["Enums"]["equipment_type_enum"];

/**
 * Props for EquipmentChipFilters.
 * @property allEquipmentTypes - All available equipment types.
 * @property selectedEquipment - Currently selected equipment types.
 * @property setSelectedEquipment - Setter for selected equipment types.
 */
export interface EquipmentChipFiltersProps {
  allEquipmentTypes: EquipmentType[];
  selectedEquipment: Set<EquipmentType>;
  setSelectedEquipment: React.Dispatch<
    React.SetStateAction<Set<EquipmentType>>
  >;
}

export const EQUIPMENT_CHIP_TESTID_ALL = "equipment-type-chip-all";
export const EQUIPMENT_CHIP_TESTID_NONE = "equipment-type-chip-none";

export const getEquipmentChipTestIds = (equipmentType: EquipmentType) =>
  `equipment-type-chip-${equipmentType}`;

/**
 * Local hook for EquipmentChipFilters logic and event handlers.
 * @param props EquipmentChipFiltersProps
 * @returns EquipmentChipFiltersAPI
 */
const useEquipmentChipFiltersAPI = (props: EquipmentChipFiltersProps) => {
  // Destructure props for useCallback dependencies
  const { setSelectedEquipment, allEquipmentTypes } = props;

  const handleChipClick = useCallback(
    (equipmentType: EquipmentType) => {
      setSelectedEquipment((prev) =>
        prev.has(equipmentType)
          ? prev.remove(equipmentType)
          : prev.add(equipmentType),
      );
    },
    [setSelectedEquipment],
  );

  const handleAllClick = useCallback(() => {
    setSelectedEquipment(Set(allEquipmentTypes));
  }, [setSelectedEquipment, allEquipmentTypes]);

  const handleNoneClick = useCallback(() => {
    setSelectedEquipment((old) => old.clear());
  }, [setSelectedEquipment]);

  const isAllDisabled =
    props.selectedEquipment.size === props.allEquipmentTypes.length;
  const isNoneDisabled = props.selectedEquipment.size === 0;

  return {
    handleChipClick,
    handleAllClick,
    handleNoneClick,
    isAllDisabled,
    isNoneDisabled,
  };
};

const EquipmentChipFilters: React.FC<EquipmentChipFiltersProps> = (props) => {
  const api = useEquipmentChipFiltersAPI(props);

  return (
    <Stack>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
        <Typography
          variant="subtitle2"
          sx={{ mb: 0.5 }}
          component="label"
          htmlFor="equipment-type-chips"
        >
          Equipment Type
        </Typography>
        <Tooltip title="Filter the list by equipment type. Click chips to show or hide exercises for each equipment.">
          <IconButton
            size="small"
            aria-label="Equipment filter info"
            tabIndex={-1}
          >
            <InfoOutlinedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Stack>
      <Stack
        direction="row"
        useFlexGap
        flexWrap="wrap"
        spacing={1}
        alignItems="center"
        aria-labelledby="equipment-type-label"
        role="group"
        id="equipment-type-chips"
      >
        {props.allEquipmentTypes.map((equipmentType) => (
          <Chip
            key={equipmentType}
            data-testid={getEquipmentChipTestIds(equipmentType)}
            label={equipmentTypeUIString(equipmentType)}
            color={
              props.selectedEquipment.has(equipmentType) ? "primary" : "default"
            }
            onClick={() => api.handleChipClick(equipmentType)}
            variant={
              props.selectedEquipment.has(equipmentType) ? "filled" : "outlined"
            }
          />
        ))}
        <Chip
          label="All"
          data-testid={EQUIPMENT_CHIP_TESTID_ALL}
          color="primary"
          onClick={api.handleAllClick}
          variant="outlined"
          sx={{ ml: 1, width: "10ch" }}
          disabled={api.isAllDisabled}
        />
        <Chip
          label="None"
          data-testid={EQUIPMENT_CHIP_TESTID_NONE}
          color="error"
          onClick={api.handleNoneClick}
          variant="outlined"
          sx={{ width: "10ch" }}
          disabled={api.isNoneDisabled}
        />
      </Stack>
    </Stack>
  );
};

export default EquipmentChipFilters;
