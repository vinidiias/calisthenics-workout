import {
  Box,
  Button,
  ButtonGroup,
  Checkbox,
  FormControl,
  FormControlLabel,
  InputLabel,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import { useForm } from "react-hook-form";
import LockIcon from "@mui/icons-material/Lock";
import { useNavigate } from "react-router-dom";
import api from "../../services";
import { useContext, useEffect } from "react";
import { UserContext } from "../../contexts/UserContext";

const Login = () => {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext)

  useEffect(() => setUser({}), [setUser]);

  const submit = async (data) => {
    try {
      await api.post('/user/auth', data)
      .then((resp) => {
        console.log(resp)
        setUser({...resp.data, isLogged: true});
        alert("Logged in successfully");
        navigate('/workouts')
      })
    } catch(err) {
      console.error(err)
    }
  };

  const fields = [
    { name: "email", label: "Email", type: "email" },
    { name: "password", label: "Password", type: "password", autocomplete: 'password'},
  ];

  return (
    <Box
      width="100%"
      className={`flex flex-col flex-1 justify-center items-center gap-2`}
    >
      <LockIcon sx={{ fontSize: "2em" }} className="text-[#463c9e]" />
      <Typography align="center" fontSize={"2em"}>
        Sign In
      </Typography>
      <form
        className="flex flex-col gap-2 w-full max-w-100"
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

        <FormControlLabel
          control={
            <Checkbox {...register("remember_me")} defaultValue={false} />
          }
          label="Remember me"
          color="primary"
          sx={{
            "& .MuiFormControlLabel-label": { fontSize: ".9em" },
          }}
        />
        <Box
          display="flex"
          width="100%"
          maxWidth={450}
          justifyContent="space-between"
          alignItems="center"
        >

          <Link href="#" variant="body2">
            Forget the password?
          </Link>
          <Link href="/register" variant="body2">
            Don't have account?
            <br />
            Sign Up!
          </Link>
        </Box>
        <ButtonGroup
          className="flex flex-col gap-2"
          variant="contained"
          disableElevation
        >
          <Button  type="submit" sx={{ textTransform: "none", fontSize: '1em', fontWeight: 'regular' }} >Sign in</Button>
          <Button sx={{ textTransform: "none", fontSize: '1em', fontWeight: 'regular' }} >
            <GoogleIcon fontSize="small" className="mr-2" />
            Sign in with Google
          </Button>
        </ButtonGroup>
      </form>
    </Box>
  );
};

export default Login;
