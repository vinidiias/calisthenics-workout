import { TextField } from "@mui/material";
import { Controller } from "react-hook-form"

export const ControllerInput = ({ name, control, ...rest }) => {
    return (
      <Controller
        control={control}
        name={name}
        render={({ field: { value, onChange } }) => (
          <TextField value={value} onChange={onChange} {...rest} />
        )}
      />
    );
}