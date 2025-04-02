import { Box, Button, ButtonGroup, TextField, Toolbar, Typography, useMediaQuery } from "@mui/material";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
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
  const { setUser } = useContext(UserContext);
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  useEffect(() => setUser({}), [setUser]);

  const { mutateAsync: createImageFn, isPending: isPendingImage } = useMutation({
    mutationFn: createImage,
    onSuccess: (data) => {
      createUserFn(data);
    },
  });

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

  const isLargeScreen = useMediaQuery("(min-width:1600px)");


  return (
    <Box
      width="100%"
      className={`flex flex-col flex-1 justify-center items-center gap-2`}
      sx={{ backgroundColor: 'background.default'}}
    >
      <LockIcon sx={{ fontSize: "2em" }} className="text-[#463c9e]" />
      <Typography align="center" fontSize={"2em"} sx={{ color: 'text.primary'}}>
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
            size={isLargeScreen ? "medium" : "small"}
            autoComplete={field.autocomplete ?? ""}
            sx={{ backgroundColor: 'background.default',
              ['.MuiOutlinedInput-root']: {
                color: 'input.secondary'
              },
             }}
            defaultValue=''
            {...register(field.name, { required: true })}
          />
        ))}
        <ButtonGroup
          className="flex flex-col"
          variant="contained"
          disableElevation
        >
          <Button type="submit" sx={{ textTransform: "none", fontSize: '1em', fontWeight: 'regular', backgroundColor: 'button.primary', color: 'white' }} loading={isPendingImage || isPendingUser} >Sign Up</Button>
          <Typography textAlign="center" variant="overline" sx={{ color: 'text.secondary' }}>
            Or
          </Typography>
          <Button onClick={() => navigate("/")} type="button" sx={{ textTransform: "none", fontSize: '1em', fontWeight: 'regular', backgroundColor: 'button.primary', color: 'white' }} loading={isPendingImage || isPendingUser}>
            Sign In
          </Button>
        </ButtonGroup>
      </form>
    </Box>
  );
};

export default Register;
