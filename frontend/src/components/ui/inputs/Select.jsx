import { Box, FormControl, InputLabel, MenuItem } from "@mui/material"
import { Select as SelectMUI } from "@mui/material";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

export const Select = ({ name, disabled, options, value, onChange, placeholder, defaultValue, size, label, ...props }) => {
    return (
      <Box>
        <FormControl sx={{ m: 1, width: 300, }}>
          {label && <InputLabel>{label}</InputLabel>}
          <SelectMUI
            {...props}
            disabled={disabled}
            name={name}
            value={value}
            size={size}
            defaultValue={defaultValue}
            onChange={(e) => onChange(e.target.value)}
            sx={{ maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP, width: 250, color: 'input.secondary' }}
          >
            <MenuItem value="all">{placeholder ?? "All"}</MenuItem>
            {options &&
              options.map((op) => (
                <MenuItem key={op.value} value={op.value}>
                  {op.label}
                </MenuItem>
              ))}
          </SelectMUI>
        </FormControl>
      </Box>
    );
}