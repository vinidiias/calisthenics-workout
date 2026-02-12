import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Divider,
  IconButton,
  Typography,
} from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useResponseNotifier } from "../../../hooks/useResponseNotifier";
import { patchLikeWorkout } from "../../../services/workoutApi";
import EditIcon from "@mui/icons-material/Edit";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import CommentIcon from "@mui/icons-material/Comment";
import { PeopleListDialog } from "../../PeopleListDialog";
import { useState } from "react";
import { InfoOutlined } from "@mui/icons-material";

export const WorkoutCardHistory = ({
  user_id,
  workout,
  onClick,
  onEdit,
}) => {
  const [openParticipantsList, setOpenParticipantsList] = useState(false);
  const { handleErrorResponse } = useResponseNotifier();
  
  const queryClient = useQueryClient();

  const isCreator = String(workout?.creator?._id || workout?.creator) === String(user_id);

  const { mutateAsync: handleLikeToWorkout } = useMutation({
    mutationFn: patchLikeWorkout,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["workouts"] }),
    onError: (resp) => handleErrorResponse(resp),
  });

  const hasParticipation = workout?.participants?.some(
    (p) => String(p?._id || p) === String(user_id),
  );

  return (
    <>
      <Card elevation={2} sx={{ width: "100%" }}>
        <CardMedia
          component="img"
          height={200}
          image={workout?.outdoorGym?.photo}
          alt={workout?.description}
        />
        <CardContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
              gap: 2,
            }}
          >
            <Box>
              <Avatar
                src={workout?.creator?.photo}
                sx={{ width: 30, height: 30 }}
              />
              <Box>
                <Typography
                  variant="body1"
                  fontSize="1em"
                  color="text.secondary"
                  fontWeight="regular"
                >
                  {workout?.creator?.name}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  fontWeight="light"
                  fontSize=".8em"
                >
                  {`${new Date(workout?.date).toLocaleDateString()} - ${new Date(workout?.date).toLocaleTimeString()}`}
                </Typography>
              </Box>
            </Box>
            <Box>
              {isCreator && (
                <IconButton size="small" onClick={onEdit}>
                  <EditIcon fontSize="small" />
                </IconButton>
              )}
            </Box>
          </Box>
          <Divider sx={{ width: "100%", my: 1 }} />
          <Typography variant="subtitle1" fontSize="1.5em" color="text.primary">
            {workout?.title}
          </Typography>
          <Typography
            fontSize=".9em"
            variant="subtitle2"
            fontWeight="light"
            color="text.secondary"
          >
            {workout?.description}
          </Typography>
          {workout?.participants && workout.participants.length > 0 && (
            <Button
              variant="text"
              onClick={() => setOpenParticipantsList(true)}
              sx={{ flex: 1, px: 0, justifyContent: "start", minWidth: 0 }}
            >
              <AvatarGroup
                max={4}
                spacing="medium"
                sx={{
                  width: "100%",
                  px: 0,
                  ".MuiAvatarGroup-avatar": {
                    width: 25,
                    height: 25,
                    cursor: "pointer",
                  },
                }}
              >
                {workout?.participants?.map((avatar, index) => (
                  <Avatar key={index} alt="profile photo" src={avatar?.photo} />
                ))}
              </AvatarGroup>
            </Button>
          )}
        </CardContent>
        <CardActions
          sx={{
            minHeight: "57px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Button
            fullWidth
            startIcon={
              workout?.likes?.includes(user_id) ? (
                <FavoriteIcon />
              ) : (
                <FavoriteBorderIcon />
              )
            }
            onClick={() => handleLikeToWorkout({ user_id, workout_id: workout._id })}
          >
            Like {workout?.likes?.length ?? 0}
          </Button>
          {hasParticipation && (
            <Button
              fullWidth
              startIcon={<CommentIcon />}
              onClick={() => onClick(1)}
            >
              Comment {workout?.commentsCount ?? 0}
            </Button>
          )}
          <IconButton onClick={() => onClick(0)}>
            <InfoOutlined sx={{ color: "text.secondary" }} />
          </IconButton>
        </CardActions>
      </Card>
      <PeopleListDialog
        onClose={() => setOpenParticipantsList(false)}
        participants={workout?.participants ?? []}
        title="Participants list"
        openModal={openParticipantsList}
      />
    </>
  );
};
