import { Box, Button, ButtonGroup, TextField, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { useAtom } from "jotai";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../App";
import LockIcon from "@mui/icons-material/Lock";
import api from "../../services";
import { useContext, useEffect } from "react";
import { UserContext } from "../../contexts/UserContext";
import { useMutation } from "@tanstack/react-query";

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
  const { user, setUser } = useContext(UserContext);
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const [theme] = useAtom(useTheme);

  useEffect(() => setUser({}), [setUser]);

  const { mutateAsync: createImageFn } = useMutation({
    mutationFn: createImage,
    onSuccess: (data) => {
      createUserFn(data);
    },
  });

  const { mutateAsync: createUserFn } = useMutation({
    mutationFn: createUser,
    onSuccess: (data) => {
      setUser(data);
      alert("User created sucessfully");
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
    <Box
      width="100%"
      className={`flex flex-col flex-1 justify-center items-center gap-2 ${theme}`}
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
          className="flex flex-col"
          variant="contained"
          disableElevation
        >
          <Button type="submit" sx={{ textTransform: "none", fontSize: '1em', fontWeight: 'regular' }} >Sign Up</Button>
          <Typography textAlign="center" variant="overline">
            Or
          </Typography>
          <Button onClick={() => navigate("/")} type="button" sx={{ textTransform: "none", fontSize: '1em', fontWeight: 'regular' }}>
            Sign In
          </Button>
        </ButtonGroup>
      </form>
    </Box>
  );
};

export default Register;
