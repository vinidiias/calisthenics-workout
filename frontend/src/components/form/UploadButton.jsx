import { Button } from "@mui/material";
import { useState } from "react";
import { useForm, useFormContext } from "react-hook-form";

function UploadButton({ name, handleClick }) {
  const { register } = useFormContext();

  return (
    <Button variant="contained" size="small" component="label" onClick={handleClick} sx={{ textTransform: 'none'}}>
      <label htmlFor={name} className="custom-file-button">
        Choose Photo
      </label>
      <input
        type="file"
        id={name} 
        accept="image/*"
        className="hidden"
        {...register(`${name}`)}
      />
    </Button>
  );
}

export default UploadButton;
