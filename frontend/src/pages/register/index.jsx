import {
  Button,
  Container,
  Grid2,
  TextField,
  Typography,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import LockIcon from "@mui/icons-material/Lock";
import api from "../../services";
import { useContext, useEffect } from "react";
import { UserContext } from "../../contexts/UserContext";
import { useMutation } from "@tanstack/react-query";
import { AuthContainer } from "../../components/auth";

const createImage = async (dataUser) => {
  const formData = new FormData();
  formData.append("photo", dataUser.photo[0]);

  const { data } = await api.post("/file", formData);

  return { ...dataUser, photo: data };
};

const createUser = async (dataUser) => {
  const { data } = await api.post("/user", dataUser);

  return data;
};

const Register = () => {
  const { setUser } = useContext(UserContext);
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  useEffect(() => setUser({}), [setUser]);

  const { mutateAsync: createImageFn } = useMutation(
    {
      mutationFn: createImage,
      onSuccess: (data) => {
        createUserFn(data);
      },
    }
  );

  const { mutateAsync: createUserFn, isPending: isPendingUser } = useMutation({
    mutationFn: createUser,
    onSuccess: (data) => {
      setUser(data);
      navigate("/");
    },
  });

  const submit = async (data) => {
    createImageFn(data);
  };

  const fields = [
    { name: "photo", type: "file" },
    { name: "name", label: "Name", type: "text" },
    { name: "email", label: "Email", type: "email" },
    { name: "phone", label: "Phone", type: "text" },
    {
      name: "password",
      label: "Password",
      type: "password",
      autocomplete: "new-password",
    },
    {
      name: "confirmPassword",
      label: "Confirm Password",
      type: "password",
      autocomplete: "new-password",
    },
  ];

  return (
    <Container maxWidth={false}>
      <AuthContainer>
        <LockIcon />
        <Typography variant="h5">Sign Up</Typography>
        <form onSubmit={handleSubmit(submit)}>
          <Grid2 container size={12} gap={2}>
            <Grid2 container gap={1}>
              {fields.map((field, index) => (
                <Grid2 size={12}>
                  <TextField
                    fullWidth
                    key={index}
                    type={field.type}
                    id={field.name}
                    label={field.label}
                    size="medium"
                    variant="outlined"
                    autoComplete={field.autocomplete ?? ""}
                    defaultValue=""
                    {...register(field.name, { required: true })}
                  />
                </Grid2>
              ))}
            </Grid2>
            <Grid2 container size={12}>
              <Grid2 size={12}>
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  type="submit"
                  loading={isPendingUser}
                >
                  Sign Up
                </Button>
              </Grid2>
              <Grid2 size={12}>
                <Typography
                  textAlign="center"
                  variant="overline"
                  sx={{ color: "text.secondary" }}
                >
                  Or
                </Typography>
              </Grid2>
              <Grid2 size={12}>
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  onClick={() => navigate("/")}
                  type="button"
                  loading={isPendingUser}
                >
                  Sign In
                </Button>
              </Grid2>
            </Grid2>
          </Grid2>
        </form>
      </AuthContainer>
    </Container>
  );
};

export default Register;
