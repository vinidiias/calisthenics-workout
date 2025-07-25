import { MenuItem } from "@mui/material"
import {Select as SelectMUI} from "@mui/material";

export const Select = ({ name, disabled, options, value, onChange, placeholder, defaultValue, size, ...props}) => {
    return (
      <SelectMUI
        {...props}
        disabled={disabled}
        name={name}
        value={value}
        size={size}
        displayEmpty
        defaultValue={defaultValue}
        sx={(theme) => ({
          backgroundColor: theme.palette.input.primary,
          color: theme.palette.input.secondary,
          borderColor: `${theme.palette.input.border}`,
        })}
        onChange={(e) => onChange(e.target.value)}
      >
        <MenuItem value="">{placeholder ?? "All"}</MenuItem>
        {options &&
          options.map((op) => (
            <MenuItem key={op.value} value={op.value}>
              {op.label}
            </MenuItem>
          ))}
      </SelectMUI>
    );
}