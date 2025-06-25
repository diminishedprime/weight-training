import React from "react";
import { Stack, Typography, Chip, Tooltip, IconButton } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { Set } from "immutable";
import { equipmentTypeUIString } from "@/uiStrings";
import type { Database } from "@/database.types";

interface EquipmentChipFiltersProps {
  allEquipmentTypes: Database["public"]["Enums"]["equipment_type_enum"][];
  selectedEquipment: Set<Database["public"]["Enums"]["equipment_type_enum"]>;
  setSelectedEquipment: React.Dispatch<
    React.SetStateAction<
      Set<Database["public"]["Enums"]["equipment_type_enum"]>
    >
  >;
}

export const EQUIPMENT_CHIP_TESTID_ALL = "equipment-type-chip-all";
export const EQUIPMENT_CHIP_TESTID_NONE = "equipment-type-chip-none";

export const getEquipmentChipTestIds = (
  equipmentType: Database["public"]["Enums"]["equipment_type_enum"]
) => `equipment-type-chip-${equipmentType}`;

const EquipmentChipFilters: React.FC<EquipmentChipFiltersProps> = ({
  allEquipmentTypes,
  selectedEquipment,
  setSelectedEquipment,
}) => {
  return (
    <Stack>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
        <Typography
          variant="subtitle2"
          sx={{ mb: 0.5 }}
          component="label"
          htmlFor="equipment-type-chips">
          Equipment Type
        </Typography>
        <Tooltip title="Filter the list by equipment type. Click chips to show or hide exercises for each equipment.">
          <IconButton
            size="small"
            aria-label="Equipment filter info"
            tabIndex={-1}>
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
        id="equipment-type-chips">
        {allEquipmentTypes.map((equipmentType) => (
          <Chip
            key={equipmentType}
            data-testid={getEquipmentChipTestIds(equipmentType)}
            label={equipmentTypeUIString(equipmentType)}
            color={selectedEquipment.has(equipmentType) ? "primary" : "default"}
            onClick={() => {
              selectedEquipment.has(equipmentType)
                ? setSelectedEquipment((prev) => prev.remove(equipmentType))
                : setSelectedEquipment((prev) => prev.add(equipmentType));
            }}
            variant={
              selectedEquipment.has(equipmentType) ? "filled" : "outlined"
            }
          />
        ))}
        <Chip
          label="All"
          data-testid={EQUIPMENT_CHIP_TESTID_ALL}
          color="primary"
          onClick={() => setSelectedEquipment(Set(allEquipmentTypes))}
          variant="outlined"
          sx={{ ml: 1, width: "10ch" }}
          disabled={selectedEquipment.size === allEquipmentTypes.length}
        />
        <Chip
          label="None"
          data-testid={EQUIPMENT_CHIP_TESTID_NONE}
          color="error"
          onClick={() => setSelectedEquipment((old) => old.clear())}
          variant="outlined"
          sx={{ width: "10ch" }}
          disabled={selectedEquipment.size === 0}
        />
      </Stack>
    </Stack>
  );
};

export default EquipmentChipFilters;
