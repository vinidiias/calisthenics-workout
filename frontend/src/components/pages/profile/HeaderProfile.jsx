import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";

// MATERIAL UI
import {
  Box,
  Button,
  CssBaseline,
  Paper,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
// COMPONENTS
import UploadButton from "../../UploadButton";
// HOOKS
import { useThemeColor } from "../../../hooks/useThemeColor"
import { useResponseNotifier } from "../../../hooks/useResponseNotifier";
// TANSTACK QUERY
import { useMutation, useQueryClient } from "@tanstack/react-query";
// API
import api from "../../../services";
import { postFollowToUser, deleteFollowToUser } from "../../../services/userApi";
// ICONS
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import { UserContext } from "../../../contexts/UserContext";

const createImage = async (photo) => {
  const formData = new FormData();
  formData.append("photo", photo);

  const { data } = await api.post("/file", formData);

  return { data };
};

const updateUser = async ({ id, auth, ...dataUser }) => {
  const { data } = await api.patch(`/users/${id}`, dataUser, {
    headers: { auth: auth },
  });

  return { data: data.data };
};

export const HeaderProfile = ({ backgroundPhoto, userData, isLoading, onViewFollows }) => {
  const [openEdit, setOpenEdit] = useState(false);
  const { id } = useParams();
  const { isDark } = useThemeColor();
  const { register, watch } = useForm();
  const { user, setUser } = useContext(UserContext);
  const { handleErrorResponse } = useResponseNotifier();

  const queryClient = useQueryClient();

  const watchBackPhoto = watch("backgroundPhoto");

  const { mutateAsync: createBackPhotoFn } = useMutation({
    mutationFn: createImage,
    onSuccess: (data) => {
      updateBackPhotoFn({
        id: id,
        auth: userData._id,
        backgroundPhoto: data.data,
      });
    },
  });

  const { mutateAsync: handleFollowFn } = useMutation({
    mutationFn: postFollowToUser,
    onSuccess: (resp) => {
      setUser((prev) => ({
        ...prev,
        following: resp.userFrom.following,
      }));
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });

  const { mutateAsync: handleUnfollow } = useMutation({
    mutationFn: deleteFollowToUser,
    onSuccess: (resp) => {
      setUser((prev) => ({
        ...prev,
        following: resp.userFrom?.following,
      }));
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: (resp) => handleErrorResponse(resp.response.data),
  });

  const { mutateAsync: updateBackPhotoFn } = useMutation({
    mutationFn: updateUser,
    onSuccess: (newData) => {
      queryClient.setQueriesData(["user", id], (oldData) => {
        return oldData
          ? { ...oldData, backgroundPhoto: newData.data.backgroundPhoto }
          : newData.data;
      });
      setOpenEdit(false);
    },
  });

  const isFollowed = user?.following.includes(userData?._id);
  const isMe = userData?._id === user?._id

  useEffect(() => {
    if (watchBackPhoto) {
      createBackPhotoFn(watchBackPhoto[0]);
    }
  }, [createBackPhotoFn, watchBackPhoto]);

  return (
    <Paper>
      <Box sx={{ display: "flex", position: "relative", textAlign: "right" }}>
        <Box position="absolute" width="100%" height={300}>
          {isLoading ? (
            <Skeleton width="100%" height="300px" variant="rectangular" />
          ) : backgroundPhoto ? (
            <img
              src={backgroundPhoto}
              alt="Background"
              style={{
                objectFit: "cover",
                width: "100%",
                height: "100%",
                borderRadius: "4px",
              }}
            />
          ) : (
            <Box sx={{ width: "100%", height: 300, bgcolor: "grey.300" }} />
          )}
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to top, rgba(0,0,0,0.9), transparent)",
            }}
          />
        </Box>
        {isMe && !openEdit && !isLoading && (
          <EditIcon
            htmlColor="#FFF"
            sx={{
              cursor: "pointer",
              position: "absolute",
              top: 12,
              right: 12,
              zIndex: 30,
            }}
            onClick={() => setOpenEdit(true)}
          />
        )}
        {isMe && openEdit && !isLoading && (
          <Box
            sx={{
              position: "absolute",
              display: "flex",
              gap: 1.5,
              width: "100%",
              justifyContent: "flex-end",
              p: 1.5,
              zIndex: 30,
            }}
          >
            <Button variant="contained" color="error" size="small">
              Delete Photo
            </Button>
            <UploadButton name="backgroundPhoto" register={register} />
            <Button
              variant="contained"
              size="small"
              onClick={() => setOpenEdit(false)}
            >
              <CloseIcon />
            </Button>
          </Box>
        )}
        <Box
          display="flex"
          flexDirection="column"
          padding={3}
          marginTop={15}
          alignItems={{ xs: "center", lg: "start" }}
          position="relative"
          width="100%"
        >
          {isLoading ? (
            <Skeleton
              animation="wave"
              width="180px"
              height="180px"
              variant="circular"
            />
          ) : (
            <img
              src={userData?.photo}
              alt=""
              style={{
                outlineColor: isDark ? "rgb(45 46 49)" : "#fff",
                width: "180px",
                height: "180px",
                objectFit: "cover",
                borderRadius: "100px",
                outline: "rgb(45, 46, 49) solid 5px",
              }}
            />
          )}
          <Box display="flex" flexDirection="column" width="100%">
            {!isLoading && (
              <Box
                display="flex"
                flexDirection={{ xs: "column", lg: "row" }}
                gap={2}
                justifyContent="space-between"
                width="100%"
              >
                <Box
                  display="flex"
                  flexDirection="column"
                  justifyContent={"center"}
                  gap={1}
                  maxWidth={{ xs: "100%", lg: "50%" }}
                  textAlign={{ xs: "center", lg: "start" }}
                >
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent={{ xs: "center", lg: "start" }}
                    gap={1}
                  >
                    <Typography variant="h4" sx={{ fontSize: "1.2em" }}>
                      {userData?.name}
                    </Typography>
                    {!isMe && (
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() =>
                          isFollowed
                            ? handleUnfollow({
                                userFrom: user?._id,
                                userTo: userData?._id,
                              })
                            : handleFollowFn({
                                userFrom: user?._id,
                                userTo: userData._id ?? 0,
                              })
                        }
                      >
                        {isFollowed ? "Stop Following" : "Follow"}
                      </Button>
                    )}
                  </Box>
                  <Typography variant="body1" fontWeight="light">
                    {userData?.biography}
                  </Typography>
                </Box>
                <Stack
                  flexDirection="row"
                  gap={{ xs: 5, sm: 10 }}
                  justifyContent="center"
                  flexWrap="wrap"
                  alignItems={{ xs: "center", lg: "end" }}
                  textAlign={{ xs: "center", md: "start" }}
                >
                  <Button
                    sx={{ display: "flex", flexDirection: "column" }}
                    onClick={() => onViewFollows(true)}
                  >
                    <Typography
                      color="textSecondary"
                      fontWeight="regular"
                      variant="body1"
                    >
                      Followers
                    </Typography>
                    <Typography fontSize="1.6em" fontWeight="medium">
                      {userData?.followers.length}
                    </Typography>
                  </Button>
                  <Button
                    sx={{ display: "flex", flexDirection: "column" }}
                    onClick={() => onViewFollows(false)}
                  >
                    <Typography
                      color="textSecondary"
                      fontWeight="regular"
                      variant="body1"
                    >
                      Following
                    </Typography>
                    <Typography fontSize="1.6em" fontWeight="medium">
                      {userData?.following.length}
                    </Typography>
                  </Button>
                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <Typography
                      color="textSecondary"
                      fontWeight="regular"
                      variant="body1"
                    >
                      Workouts
                    </Typography>
                    <Typography fontSize="1.6em" fontWeight="medium">
                      {userData?.history.length}
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
      <CssBaseline />
    </Paper>
  );
};
