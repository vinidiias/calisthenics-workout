import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import { Controller } from "react-hook-form";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from "dayjs";

export const ControllerDatePickerInput = ({ control, name, label, rules, ...rest }) => {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { value, onChange } }) => (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateTimePicker
            label={label}
            value={value ? dayjs(value) : null}
            disablePast
            onChange={onChange}
            format="DD/MM/YYYY HH:mm"
            views={["day", "month", "year", "hours", "minutes"]}
            sx={{ width: "100%" }}
            {...rest}
          />
        </LocalizationProvider>
      )}
    />
  );
};
