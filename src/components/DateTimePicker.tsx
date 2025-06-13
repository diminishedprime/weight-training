import { Dispatch, SetStateAction } from "react";
import {
  DatePicker,
  TimePicker,
  LocalizationProvider,
} from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { Stack } from "@mui/material";

interface DateTimePickerProps {
  date: Date | null;
  setDate: Dispatch<SetStateAction<Date | null>>;
  time: Date | null;
  setTime: Dispatch<SetStateAction<Date | null>>;
}

export default function DateTimePicker({
  date,
  setDate,
  time,
  setTime,
}: DateTimePickerProps) {
  return (
    <Stack flexDirection="row" flexWrap="wrap" useFlexGap gap={1}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DatePicker
          label="Date"
          value={date}
          onChange={setDate}
          slotProps={{
            textField: {
              size: "small",
              sx: {
                minWidth: 0,
                width: "auto",
                "& .MuiInputBase-root": {
                  minWidth: 0,
                  width: "auto",
                },
                "& .MuiOutlinedInput-root": {
                  minWidth: 0,
                  width: "auto",
                },
                "& .MuiPickersSectionList-root": {
                  minWidth: 0,
                  width: "auto",
                },
              },
            },
          }}
        />
        <TimePicker
          label="Time"
          value={time}
          onChange={setTime}
          views={["hours", "minutes", "seconds"]}
          format="HH:mm:ss"
          slotProps={{
            textField: {
              size: "small",
              sx: {
                minWidth: 0,
                width: "auto",
                "& .MuiInputBase-root": {
                  minWidth: 0,
                  width: "auto",
                },
                "& .MuiOutlinedInput-root": {
                  minWidth: 0,
                  width: "auto",
                },
                "& .MuiPickersSectionList-root": {
                  minWidth: 0,
                  width: "auto",
                },
              },
            },
          }}
        />
      </LocalizationProvider>
    </Stack>
  );
}
