import { PlaceOutlined, Send } from "@mui/icons-material";
import { Box, Button, FormControl, IconButton, InputAdornment, OutlinedInput, TextField } from "@mui/material";

export const SendInput = ({
  label,
  placeholder,
  value,
  onChange,
  onClick,
  onKeyDown,
  size = "small" | "medium" | 'large',
  ...props
}) => {
  return (
    <FormControl variant="outlined" size={size} fullWidth {...props}>
      <OutlinedInput
        type="text"
        label={label}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        endAdornment={
          <InputAdornment position="end">
            <IconButton aria-label="send" onClick={onClick}>
              <Send />
            </IconButton>
          </InputAdornment>
        }
      />
    </FormControl>
  );
};
