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
import { useAtom } from "jotai";
import { useTheme } from "../../App";
import LockIcon from "@mui/icons-material/Lock";
import { useNavigate } from "react-router-dom";
import api from "../../services";
import { useContext } from "react";
import { UserContext } from "../../contexts/UserContext";

const Login = () => {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const [theme] = useAtom(useTheme);
  const { setUser } = useContext(UserContext)

  const submit = async (data) => {
    try {
      await api.post('/user/auth', data)
      .then((resp) => {
        console.log(resp.data)
        setUser({...resp.data, isLogged: true});
        alert("Logged in successfully");
        navigate('/workouts')
      })
    } catch(err) {
      console.error(err)
    }
  };

  const fields = [
    <TextField
      key={0}
      className="bg-white"
      type="email"
      id="email"
      label="Email"
      variant="outlined"
      autoComplete=""
      {...register("email", { required: true })}
    />,
    <TextField
      key={1}
      className="bg-white"
      type="password"
      id="password"
      label="Password"
      variant="outlined"
      autoComplete="password"
      {...register("password", { required: true })}
    />,
  ];

  return (
    <Box
      width="100%"
      className={`flex flex-col flex-1 justify-center items-center gap-5 ${theme}`}
    >
      <LockIcon sx={{ fontSize: "2em" }} className="text-[#463c9e]" />
      <Typography align="center" fontSize={"2em"}>
        Sign In
      </Typography>
      <form
        className="flex flex-col gap-3 w-full max-w-100"
        onSubmit={handleSubmit(submit)}
      >
        {fields[0]}
        {fields[1]}
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
          className="flex flex-col gap-3"
          variant="contained"
          disableElevation
        >
          <Button type="submit">Sign in</Button>
          <Button size="sm">
            <GoogleIcon fontSize="small" className="mr-2" />
            Sign in with Google
          </Button>
        </ButtonGroup>
      </form>
    </Box>
  );
};

export default Login;
