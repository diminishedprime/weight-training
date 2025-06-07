import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import { SxProps } from "@mui/material/styles";
import { Database, Constants } from "@/database.types";
import { completionStatusUIString } from "@/uiStrings";
import React from "react";

interface CompletionStatusSelectProps {
  value: Database["public"]["Enums"]["completion_status_enum"];
  onChange: (
    event: React.ChangeEvent<{
      value: Database["public"]["Enums"]["completion_status_enum"];
    }>
  ) => void;
  sx?: SxProps;
}

export default function CompletionStatusEditor({
  value,
  onChange,
  sx,
}: CompletionStatusSelectProps) {
  return (
    <FormControl sx={{ minWidth: 120, ...sx }}>
      <InputLabel id="completion-status-label">Completion Status</InputLabel>
      <Select
        labelId="completion-status-label"
        name="completion_status"
        value={value}
        label="Completion Status"
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onChange={onChange as any}
      >
        {Constants.public.Enums.completion_status_enum.map((status) => (
          <MenuItem key={status} value={status}>
            {completionStatusUIString(status)}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
