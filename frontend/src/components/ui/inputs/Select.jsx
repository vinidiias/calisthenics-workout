// MATERIAL
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Select as SelectMUI,
  TextField,
  Typography,
} from "@mui/material";
import { Controller } from "react-hook-form";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

export const InputSelect = ({ readOnly, placeholder, input_props, options, ...rest }) => {
  return (
    <TextField
      fullWidth
      select
      sx={{ textAlign: "start" }}
      {...rest}
      slotProps={{
        htmlInput: {
          readOnly: readOnly,
          ...input_props,
        },

        inputLabel: {
          shrink: true,
        },
      }}
    >
      <MenuItem disabled value={-1}>
        <Typography variant="inherit" color="action.disabled">
          {placeholder ?? "Selecionar..."}
        </Typography>
      </MenuItem>
      {options.map((option) => (
        <MenuItem
          key={option.value}
          value={option.value}
          disabled={option.disabled}
        >
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  );
}

export const InputSelectController = ({
  control,
  name,
  errors,
  ...rest
}) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={{ required: true }}
      render={({ field: { value, onChange } }) => (
        <InputSelect
          value={value}
          onChange={onChange}
          error={!!errors}
          helperText={!!errors && errors.message}
          {...rest}
        />
      )}
    />
  );
};
