// MATERIAL UI
import { Button } from "@mui/material";

function UploadButton({ name, handleClick, register }) {
  return (
    <Button
      variant="contained"
      size="small"
      component="label"
      onClick={handleClick}
    >
      <label htmlFor={name}>
        Choose Photo
      </label>
      <input
        type="file"
        id={name}
        accept="image/*"
        style={{ display: "none" }}
        {...register(`${name}`)}
      />
    </Button>
  );
}

export default UploadButton;
