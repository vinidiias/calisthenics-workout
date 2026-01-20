import {
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  Grid2,
  Link,
  Stack,
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
import { useMutation } from "@tanstack/react-query";
import { AuthContainer } from "../../components/auth";

const createAuth = async ({ userData }) => {
  const { data } = await api.post("/user/auth", userData);

  return data;
};

const Login = () => {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  useEffect(() => setUser({}), [setUser]);

  const { mutateAsync: handleAuthFn, isPending } = useMutation({
    mutationFn: (data) => createAuth({ userData: data }),
    onSuccess: (resp) => {
      setUser({ ...resp, isLogged: true });
      navigate("/workouts");
    },
  });

  const fields = [
    { name: "email", label: "Email", type: "email" },
    {
      name: "password",
      label: "Password",
      type: "password",
      autocomplete: "password",
    },
  ];

  return (
    <Container maxWidth={false}>
      <AuthContainer>
        <LockIcon color="action" />
        <Typography variant="h5">
          Sign In
        </Typography>
        <form onSubmit={handleSubmit(handleAuthFn)}>
          <Grid2 container size={12} gap={1}>
            {fields.map((field, index) => (
              <Grid2 size={12}>
                <TextField
                  fullWidth
                  key={index}
                  type={field.type}
                  id={field.name}
                  label={field.label}
                  variant="outlined"
                  autoComplete={field.autocomplete ?? ""}
                  {...register(field.name, { required: true })}
                />
              </Grid2>
            ))}
            <Grid2 container justifyContent="start">
              <Grid2>
                <FormControlLabel
                  control={
                    <Checkbox
                      {...register("remember_me")}
                      defaultValue={false}
                    />
                  }
                  label="Remember me"
                  color="primary"
                />
              </Grid2>
            </Grid2>
            <Grid2 size={12} container justifyContent="space-between">
              <Grid2>
                <Link href="#" variant="body2">
                  Forget the password?
                </Link>
              </Grid2>
              <Grid2>
                <Link href="/register" variant="body2">
                  Don't have account?
                  <br />
                  Sign Up!
                </Link>
              </Grid2>
            </Grid2>
            <Grid2 size={12}>
              <Stack spacing={1}>
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  type="submit"
                  loading={isPending}
                >
                  Sign in
                </Button>
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  loading={isPending}
                >
                  <GoogleIcon fontSize="small" className="mr-2" />
                  Sign in with Google
                </Button>
              </Stack>
            </Grid2>
          </Grid2>
        </form>
      </AuthContainer>
    </Container>
  );
};

export default Login;
