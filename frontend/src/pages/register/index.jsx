import { Box, Button, ButtonGroup, TextField, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { useAtom } from "jotai";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../App";
import LockIcon from "@mui/icons-material/Lock";
import api from '../../services'
import { useContext } from "react";
import { UserContext } from '../../contexts/UserContext'

const Register = () => {
  const { register, handleSubmit } = useForm();
  const { user, setUser } = useContext(UserContext)
  const navigate = useNavigate();
  const [theme] = useAtom(useTheme);

  const submit = async (data) => {
    console.log(data)
    try {
      if(data.password !== data.confirmPassword) {
        return alert("Passwords do not match");
      }

      await api.post('/user', data)
      .then((resp) => {
        console.log(resp)
        setUser(resp.data)
        alert('User created sucessfully')
      })
      .catch(err => console.error(err))
    } catch(err) {
      console.error(err)
    }
    navigate("/");
  };

  const fields = [
    { name: "name", label: "Name", type: "text" },
    { name: "email", label: "Email", type: "email" },
    { name: "password", label: "Password", type: "password", autocomplete: 'new-password' },
    { name: "confirmPassword", label: "Confirm Password", type: "password", autocomplete: 'new-password' },
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
            key={index}
            className="bg-white"
            type={field.type}
            id={field.name}
            label={field.label}
            variant="outlined"
            autoComplete={field.autocomplete ?? ""}
            {...register(field.name, { required: true })}
          />
        ))}
        <ButtonGroup
          className="flex flex-col gap-1"
          variant="contained"
          disableElevation
        >
          <Button type="submit">Sign Up</Button>
          <Typography textAlign="center" variant="overline">
            Or
          </Typography>
          <Button onClick={() => navigate("/")} type="button">
            Sign In
          </Button>
        </ButtonGroup>
      </form>
    </Box>
  );
};

export default Register;
