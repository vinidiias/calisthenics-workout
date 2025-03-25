import * as React from "react";
import Box from "@mui/material/Box";

import api from "../../services";
import CssBaseline from "@mui/material/CssBaseline";
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import { Button, Paper, Stack, Typography } from "@mui/material";
import { useContext } from "react";
import { UserContext } from "../../contexts/UserContext";
import { useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import UploadButton from "../../components/form/UploadButton";
import { FormProvider, useForm } from "react-hook-form";
import { useEffect } from "react";
import { useThemeColor } from "../../hooks/useThemeColor";

const createImage = async (photo) => {
  const formData = new FormData();
  formData.append("photo", photo);

  const { data } = await api.post("/file", formData);

  return { data };
};

const updateUser = async ({ id, auth, ...dataUser }, ) => { 
  const { data } = await api.patch(`/user/${id}`, dataUser, {
    headers: { auth: auth }
  });

  return { data }
}

const getUser = async({ id }) => {
  const { data } = await api.get(`/user/${id}`)
  return data
}

export default function Profile() {
  const params = useParams();
  const methods = useForm();
  const queryClient = useQueryClient()
  const { user } = useContext(UserContext);
  const [isMe] = useState(params.id === user._id || false)
  const [openEdit, setOpenEdit] = useState(false)
  const { isDark } = useThemeColor()


  const watchBackPhoto = methods.watch("backgroundPhoto");

  const  { mutateAsync: createBackPhotoFn } = useMutation({
    mutationFn: createImage,
    onSuccess: (data) => {
      updateBackPhotoFn({ id: params.id, auth: user._id, backgroundPhoto: data.data })
    }
  })

  const  { mutateAsync: updateBackPhotoFn } = useMutation({
    mutationFn: updateUser,
    onSuccess: (newData) => {
      queryClient.setQueriesData(['user'], (oldData) => {
        console.log(newData)
        return oldData ? {...oldData, backgroundPhoto: newData.data.backgroundPhoto } : newData.data
      })
      setOpenEdit(false)
    }
  })

  const { data } = useQuery({
    queryKey: ['user'],
    queryFn: () => getUser({ id: params.id, auth: user._id })
  })

  useEffect(() => {
    if (watchBackPhoto) {
      createBackPhotoFn(watchBackPhoto[0])
    }
  }, [createBackPhotoFn, watchBackPhoto])

  return (
    <Box
      component="main"
      flexGrow={1}
      padding={2}
      display="flex"
      flexDirection="column"
      gap={4}
      sx={{ backgroundColor: 'background.primary'}}
    >
      <FormProvider {...methods}>
        <Paper>
          <div className="relative text-right">
            {data?.backgroundPhoto ? (
              <img
                src={data?.backgroundPhoto}
                alt=""
                className="object-cover w-full h-50 absolute"
              />
            ) : (
              <div className="w-full h-50 absolute bg-gray-300"></div>
            )}
            {isMe && !openEdit && (
              <EditIcon
                htmlColor="#FFF"
                className="cursor-pointer absolute top-3 right-3 z-30000"
                onClick={() => setOpenEdit(true)}
              />
            )}
            {isMe && openEdit && (
              <div className="absolute flex gap-3 w-full justify-end p-3 z-30000">
                <Button
                  variant="contained"
                  color="error"
                  size="small"
                  sx={{ textTransform: "none" }}
                >
                  Delete Photo
                </Button>
                <UploadButton name="backgroundPhoto" />
                <Button
                  variant="contained"
                  size="small"
                  sx={{
                    textTransform: "none",
                    backgroundColor: "var(--color-gray-700)",
                    padding: 0,
                  }}
                  onClick={() => setOpenEdit(false)}
                >
                  <CloseIcon />
                </Button>
              </div>
            )}
          </div>
          <CssBaseline />
          <div className="flex flex-col p-7 px-10 relative z-20000">
            <img
              src={data?.photo}
              alt=""
              className=" h-25 w-25 br-10 mt-30 object-cover rounded-[100px] outline-white outline-5"
              style={{ outlineColor: isDark ? 'rgb(45 46 49)' : '#fff'}}
            />
            <Box display="flex" flexDirection="column">
              <Box
                display="flex"
                component="section"
                justifyContent="space-between"
                width="100%"
                marginBottom={2}
              >
                <div className="flex flex-col gap-1">
                  <div className="flex items-center mt-1 gap-3">
                    <Typography variant="h4">{data?.name}</Typography>
                    {!isMe && (
                      <Button
                        variant="contained"
                        size="small"
                        sx={{
                          textTransform: "none",
                          fontSize: ".9em",
                          fontWeight: "regular",
                          backgroundColor: "var(--color-gray-700)",
                          borderRadius: 5,
                        }}
                      >
                        {user.following.includes(data?._id)
                          ? "Stop Following"
                          : "Follow"}
                      </Button>
                    )}
                  </div>
                  <Typography>{data?.biography}</Typography>
                </div>
                <Stack flexDirection="row" gap={10}>
                  <Box display="flex" flexDirection="column">
                    <Typography
                      color="textSecondary"
                      fontWeight="regular"
                      variant="body1"
                    >
                      Followers
                    </Typography>
                    <Typography fontSize="1.6em" fontWeight="medium">
                      {data?.followers.length}
                    </Typography>
                  </Box>
                  <Box display="flex" flexDirection="column">
                    <Typography
                      color="textSecondary"
                      fontWeight="regular"
                      variant="body1"
                    >
                      Following
                    </Typography>
                    <Typography fontSize="1.6em" fontWeight="medium">
                      {data?.following.length}
                    </Typography>
                  </Box>
                  <Box display="flex" flexDirection="column">
                    <Typography
                      color="textSecondary"
                      fontWeight="regular"
                      variant="body1"
                    >
                      Workouts
                    </Typography>
                    <Typography fontSize="1.6em" fontWeight="medium">
                      {data?.history.length}
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            </Box>
          </div>
        </Paper>
      </FormProvider>
      <Paper sx={{ flex: 1 }}>
        <Box className="p-7 px-10 h-full">
          <Typography
            variant="body1"
            fontSize="large"
            color="textSecondary"
            fontWeight="regular"
          >
            Atividades
          </Typography>
          <div className="text-center mt-13">
            <Typography>Nenhuma Atividade</Typography>
          </div>
        </Box>
      </Paper>
    </Box>
  );
}

/*

                <Button
                  variant="contained"
                  size="small"
                  sx={{
                    padding: 1,
                    paddingX: 2,
                    fontWeight: "550",
                    textTransform: "none",
                  }}
                >
                  Update Photo
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  sx={{
                    padding: 1,
                    paddingX: 2,
                    color: "red",
                    backgroundColor: "#eff",
                    fontWeight: "550",
                    textTransform: "none",
                  }}
                >
                  Delete Photo
                </Button>*/
