"use client";

import React from "react";
import {
  Stack,
  TextField,
  InputAdornment,
  IconButton,
  Tooltip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

export const FUZZY_SEARCH_FIELD_TESTID = "fuzzy-search-field";

/**
 * Props for FuzzySearchField component.
 * @property value - The current value of the search field.
 * @property onChange - Callback when the search value changes. Receives the change event from the input.
 * @property onClear - Callback to clear the search field.
 */
export interface SearchFieldProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
}

const FuzzySearchField: React.FC<SearchFieldProps> = ({
  value,
  onChange,
  onClear,
}) => (
  <Stack direction="row" spacing={1} alignItems="center">
    <TextField
      label="Fuzzy search exercise"
      value={value}
      onChange={onChange}
      size="small"
      sx={{ flexGrow: 1 }}
      inputProps={{ "data-testid": FUZZY_SEARCH_FIELD_TESTID }}
      InputProps={{
        endAdornment: value ? (
          <InputAdornment position="end">
            <IconButton
              size="small"
              aria-label="Clear search"
              onClick={onClear}
              edge="end"
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </InputAdornment>
        ) : null,
      }}
    />
    <Tooltip title="Fuzzy search means you don't have to type the exact name—just type part of the exercise or a close match, and we'll find it for you!">
      <IconButton size="small" aria-label="Fuzzy search info" tabIndex={-1}>
        <InfoOutlinedIcon fontSize="small" />
      </IconButton>
    </Tooltip>
  </Stack>
);

export default FuzzySearchField;
