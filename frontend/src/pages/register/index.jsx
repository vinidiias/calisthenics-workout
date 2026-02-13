import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// MATERIAL UI
import { Button, Container, Grid2, TextField, Typography } from "@mui/material";
// COMPONENTS
import { AuthContainer } from "../../components/pages/auth";
// CONTEXT
import { UserContext } from "../../contexts/UserContext";
// TANSTACK QUERY
import { useMutation } from "@tanstack/react-query";
// ICONS
import LockIcon from "@mui/icons-material/Lock";
// HOOK FORM
import { useForm } from "react-hook-form";
import { useResponseNotifier } from "../../hooks/useResponseNotifier";
import { postUser } from "../../services/userApi";
import { createImage } from "../../services/imageApi";

const Register = () => {
  const { setUser } = useContext(UserContext);
  const { handleApiResult } = useResponseNotifier();
  const { register, handleSubmit } = useForm();

  const navigate = useNavigate();

  useEffect(() => setUser({}), [setUser]);

  const { mutateAsync: createImageFn, isPending: isPendingImage } = useMutation({
    mutationFn: createImage,
    onSuccess: (data) => {
      createUserFn(data);
      handleApiResult({ data, errorMessage: null });
    },
    onError: () => {
      handleApiResult({
        data: null,
        errorMessage: "Error to send image. Try again.",
      });
    }
  });

  const { mutateAsync: createUserFn, isPending: isPendingUser } = useMutation({
    mutationFn: postUser,
    onSuccess: (data) => {
      setUser(data);
      handleApiResult({ data, errorMessage: null });
      navigate("/");
    },
    onError: (resp) => handleApiResult(resp?.response?.data),
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
                  loading={isPendingUser || isPendingImage}
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
                  loading={isPendingUser || isPendingImage}
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
