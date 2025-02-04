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
import GoogleIcon from '@mui/icons-material/Google';
import { useForm } from "react-hook-form";
import { useAtom } from "jotai";
import { useTheme } from "../../App";
import LockIcon from '@mui/icons-material/Lock';
const Login = () => {
  const { register, handleSubmit } = useForm();
  const [theme] = useAtom(useTheme)

  return (
    <Box
      width="100%"
      className={`flex flex-col flex-1 justify-center items-center gap-5`}
    >
      <LockIcon sx={{ fontSize: "2em" }} className="text-[#463c9e]" />
      <Typography align="center" fontSize={"2em"}>
        Sign in
      </Typography>
      <form
        className="flex flex-col gap-3 w-full max-w-100"
        onSubmit={handleSubmit((data) => alert(JSON.stringify(data)))}
      >
        <TextField
          classes={"bg-black"}
          type="email"
          id="email"
          label="Email"
          variant="outlined"
          {...register("email")}
        />
        <TextField
          type="password"
          id="password"
          label="Password"
          variant="outlined"
          {...register("password")}
        />
        <FormControlLabel
          control={<Checkbox {...register("email")} defaultValue={false} />}
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
          <Link href="#" variant="body2">
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
            Sign with Google
          </Button>
        </ButtonGroup>
      </form>
    </Box>
  );
};

export default Login;
