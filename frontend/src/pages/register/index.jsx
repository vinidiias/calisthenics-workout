import { Box, Button, ButtonGroup, TextField, Typography } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import { useForm } from "react-hook-form";
import { useAtom } from "jotai";
import { useTheme } from "../../App";
import LockIcon from "@mui/icons-material/Lock";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const [theme] = useAtom(useTheme);

  const submit = (data) => {
    navigate("/workouts");
  };

  const fields = [
    { name: "email", label: "Email", type: "email" },
    { name: "password", label: "Password", type: "password" },
    { name: "password", label: "New Password", type: "password" },
  ];

  return (
    <Box
      width="100%"
      className={`flex flex-col flex-1 justify-center items-center gap-5 ${theme}`}
    >
      <LockIcon sx={{ fontSize: "2em" }} className="text-[#463c9e]" />
      <Typography align="center" fontSize={"2em"}>
        Sign Up
      </Typography>
      <form
        className="flex flex-col gap-3 w-full max-w-100"
        onSubmit={handleSubmit(submit)}
      >
        {fields.map((field, index) => (
          <TextField
            className="bg-white"
            type={field.type}
            id={field.name}
            label={field.label}
            variant="outlined"
            {...register(field.name)}
          />
        ))}
        <ButtonGroup
          className="flex flex-col gap-3"
          variant="contained"
          disableElevation
        >
          <Button type="submit">Sign Up</Button>
          <Button size="sm">
            <GoogleIcon fontSize="small" className="mr-2" />
            Sign in with Google
          </Button>
        </ButtonGroup>
      </form>
    </Box>
  );
};

export default Register;
