import * as React from "react";
import Box from "@mui/material/Box";

import api from "../../services";
import UploadButton from "../../components/form/UploadButton";
import CardComponent from "../../components/ui/CardComponent";
import CssBaseline from "@mui/material/CssBaseline";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import {
  Avatar,
  Button,
  Grid,
  Grid2,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useContext } from "react";
import { UserContext } from "../../contexts/UserContext";
import { useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useEffect } from "react";
import { useThemeColor } from "../../hooks/useThemeColor";
import { FriendsFollowing } from "../../components/pages/profile/FriendsFollowing";
import { WorkoutPost } from "../../components/pages/profile/WorkoutPost";

const createImage = async (photo) => {
  const formData = new FormData();
  formData.append("photo", photo);

  const { data } = await api.post("/file", formData);

  return { data };
};

const updateUser = async ({ id, auth, ...dataUser }) => {
  const { data } = await api.patch(`/user/${id}`, dataUser, {
    headers: { auth: auth },
  });

  return { data };
};

const getUser = async ({ id }) => {
  const { data } = await api.get(`/user/${id}`);
  return data;
};

export default function Profile() {
  const params = useParams();
  const methods = useForm();
  const queryClient = useQueryClient();
  const { user } = useContext(UserContext);
  const [isMe] = useState(params.id === user._id || false);
  const [openEdit, setOpenEdit] = useState(false);
  const { isDark } = useThemeColor();

  const watchBackPhoto = methods.watch("backgroundPhoto");

  const { mutateAsync: createBackPhotoFn } = useMutation({
    mutationFn: createImage,
    onSuccess: (data) => {
      updateBackPhotoFn({
        id: params.id,
        auth: user._id,
        backgroundPhoto: data.data,
      });
    },
  });

  const { mutateAsync: updateBackPhotoFn } = useMutation({
    mutationFn: updateUser,
    onSuccess: (newData) => {
      queryClient.setQueriesData(["user"], (oldData) => {
        console.log(newData);
        return oldData
          ? { ...oldData, backgroundPhoto: newData.data.backgroundPhoto }
          : newData.data;
      });
      setOpenEdit(false);
    },
  });

  const { data } = useQuery({
    queryKey: ["user"],
    queryFn: () => getUser({ id: params.id, auth: user._id }),
  });

  useEffect(() => {
    if (watchBackPhoto) {
      createBackPhotoFn(watchBackPhoto[0]);
    }
  }, [createBackPhotoFn, watchBackPhoto]);

  return (
    <Box
      component="main"
      flexGrow={1}
      padding={2}
      display="flex"
      justifyContent="center"
      gap={4}
      sx={{ backgroundColor: "background.primary" }}
    >
      <Box
        display="flex"
        flexDirection="column"
        gap={3}
        width={{ xs: "100%", sm: "80%" }}
      >
        <FormProvider {...methods}>
          <Paper>
            <Box
              position="relative"
              textAlign="right"
              className="relative text-right"
            >
              {data?.backgroundPhoto ? (
                <Box position="absolute" width="100%" height={300}>
                  <img
                    src={data?.backgroundPhoto}
                    alt="Background"
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                </Box>
              ) : (
                <div className="w-full h-[300px] bg-gray-300"></div>
              )}
              {isMe && !openEdit && (
                <EditIcon
                  htmlColor="#FFF"
                  className="cursor-pointer absolute top-3 right-3 z-30"
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
                      backgroundColor: "button.primary",
                      color: "white",
                      padding: 0,
                    }}
                    onClick={() => setOpenEdit(false)}
                  >
                    <CloseIcon />
                  </Button>
                </div>
              )}
            </Box>
            <CssBaseline />
            <Box
              display="flex"
              flexDirection="column"
              padding={7}
              marginTop={10}
              alignItems={{ xs: "center", lg: "start" }}
              position="relative"
              zIndex={20000}
            >
              <img
                src={data?.photo}
                alt=""
                className=" h-45 w-45 br-10 mt-30 object-cover rounded-[100px] outline-white outline-5"
                style={{ outlineColor: isDark ? "rgb(45 46 49)" : "#fff" }}
              />
              <Box display="flex" flexDirection="column" width="100%">
                <Box
                  display="flex"
                  flexDirection={{ xs: "column", lg: "row" }}
                  gap={{ lg: 5 }}
                  component="section"
                  justifyContent="space-between"
                  width="100%"
                  marginBottom={2}
                >
                  <Box
                    display="flex"
                    flexDirection="column"
                    alignItems={{ xs: "center", lg: "start" }}
                    gap={1}
                  >
                    <Box
                      display="flex"
                      alignItems="center"
                      marginTop={1}
                      gap={3}
                    >
                      <Typography
                        variant="h4"
                        sx={{
                          fontSize: "2.125rem",
                          "@media (max-width: 480px)": {
                            fontSize: "1.8rem",
                          },
                        }}
                      >
                        {data?.name}
                      </Typography>
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
                    </Box>
                    <Typography variant="body1" fontWeight="light">
                      {data?.biography}
                    </Typography>
                  </Box>
                  <Stack
                    flexDirection="row"
                    gap={{ xs: 5, sm: 10 }}
                    justifyContent="center"
                    alignItems={{ xs: "center", lg: "start" }}
                  >
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
            </Box>
          </Paper>
        </FormProvider>
        <Box className="flex flex-col lg:flex-row" gap={2} flex={1}>
          <Paper
            sx={
              data?.followers?.length === 0
                ? { flex: 1 }
                : { alignSelf: "flex-start", position: "sticky", top: 0 }
            }
          >
            <FriendsFollowing friends={data} />
          </Paper>
          <Box display="flex" flexDirection="column" gap={5} flex={2}>
            {data?.history?.length > 0 ? (
              <>
                {data.history?.map((hist) => {
                  const date = new Date(hist.date);
                  return (
                    <WorkoutPost
                      photo={data.photo}
                      hist={hist}
                      name={data.name}
                      date={date}
                    />
                  );
                })}
              </>
            ) : (
              <Paper
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flex: 1,
                }}
              >
                <Typography>Sem atividades</Typography>
              </Paper>
            )}
          </Box>
        </Box>
      </Box>
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
