import { Button } from "@mui/material";

function UploadButton({ name, handleClick, register }) {
  return (
    <Button variant="contained" size="small" component="label" onClick={handleClick}>
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
