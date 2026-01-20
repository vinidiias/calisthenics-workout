import {
  Box,
  Button,
  CssBaseline,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import UploadButton from "../../form/UploadButton";
import CloseIcon from "@mui/icons-material/Close";
import { useThemeColor } from "../../../hooks/useThemeColor";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../../services";

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

export const HeaderProfile = ({ backgroundPhoto, isMe, user }) => {
  const [openEdit, setOpenEdit] = useState(false);

  const { isDark } = useThemeColor();
  const { register, watch } = useForm();
  const queryClient = useQueryClient();

  const watchBackPhoto = watch("backgroundPhoto");

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
      queryClient.setQueriesData(["user", params.id], (oldData) => {
        console.log(newData);
        return oldData
          ? { ...oldData, backgroundPhoto: newData.data.backgroundPhoto }
          : newData.data;
      });
      setOpenEdit(false);
    },
  });

  useEffect(() => {
    if (watchBackPhoto) {
      createBackPhotoFn(watchBackPhoto[0]);
    }
  }, [createBackPhotoFn, watchBackPhoto]);

  return (
    <Paper>
      <Box sx={{ display: "flex", position: "relative", textAlign: "right" }}>
        <Box position="absolute" width="100%" height={300}>
          {backgroundPhoto ? (
            <img
              src={backgroundPhoto}
              alt="Background"
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="w-full h-[300px] bg-gray-300"></div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent"></div>
        </Box>
        {isMe && !openEdit && (
          <EditIcon
            htmlColor="#FFF"
            className="cursor-pointer absolute top-3 right-3 z-30"
            onClick={() => setOpenEdit(true)}
          />
        )}
        {isMe && openEdit && (
          <div className="absolute flex gap-3 w-full justify-end p-3 z-30000">
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
          </div>
        )}
      </Box>
      <CssBaseline />
      <Box
        display="flex"
        flexDirection="column"
        padding={{ xs: 2, sm: 4, md: 7 }}
        marginTop={10}
        alignItems={{ xs: "center", lg: "start" }}
        position="relative"
      >
        <img
          src={user?.photo}
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
              <Typography
                variant="h4"
                sx={{ fontSize: { xs: "1.8rem", sm: "2.125rem" } }}
              >
                {user?.name}
              </Typography>
              {!isMe && (
                <Button variant="contained" size="small">
                  {user?.following.includes(user?._id)
                    ? "Stop Following"
                    : "Follow"}
                </Button>
              )}
              <Typography variant="body1" fontWeight="light">
                {user?.biography}
              </Typography>
            </Box>
            <Stack
              flexDirection="row"
              gap={{ xs: 5, sm: 10 }}
              justifyContent="center"
              flexWrap="wrap"
              alignItems={{ xs: "center", lg: "start" }}
              textAlign={{ xs: "center", md: "start" }}
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
                  {user?.followers.length}
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
                  {user?.following.length}
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
                  {user?.history.length}
                </Typography>
              </Box>
            </Stack>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};
