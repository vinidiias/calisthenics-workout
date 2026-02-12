import { useMutation, useQueryClient } from "@tanstack/react-query";
// MATERIAL UI
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
// ICONS
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
// HOOKS
import { useResponseNotifier } from "../../../hooks/useResponseNotifier";
// SERVICES
import { subscribeToWorkout, unsubscribeToWorkout } from "../../../services/workoutApi";

export const WorkoutCard = ({
  user_id,
  isParticipe,
  workout,
  openList,
  onClick,
  onEdit,
}) => {
  const queryClient = useQueryClient();
  const { handleErrorResponse } = useResponseNotifier();

  const isCreator = String(workout?.creator?._id || workout?.creator) === String(user_id);

  const { mutateAsync: handleSubscribeToWorkoutFn, isPending: isPendingToSubscribe } =
    useMutation({
      mutationFn: subscribeToWorkout,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["workouts"] });
      },
      onError: (resp) => handleErrorResponse(resp?.response?.data),
    });

  const {
    mutateAsync: handleUnsubscribeToWorkoutFn,
    isPending: isPendingToUnsubscribe,
  } = useMutation({
    mutationFn: unsubscribeToWorkout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workouts"] });
    },
    onError: (resp) => handleErrorResponse(resp?.response?.data),
  });

  const handleSubscription = () => {
    const dto = {
      auth: user_id,
      workoutId: workout._id,
    };

    if (isParticipe) {
      handleSubscribeToWorkoutFn(dto);
    } else {
      handleUnsubscribeToWorkoutFn(dto);
    }
  };

  return (
    <Card elevation={2} sx={{ width: "100%", maxWidth: 300 }}>
      <CardActionArea onClick={onClick}>
        <CardMedia
          component="img"
          height={140}
          image={workout?.outdoorGym?.photo}
          alt={workout?.description}
        />
        <CardContent>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
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
        </CardContent>
      </CardActionArea>
      <CardActions
        sx={{
          minHeight: "57px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Button
            variant="contained"
            onClick={handleSubscription}
            loadingPosition="end"
            color="white"
            loading={isPendingToSubscribe || isPendingToUnsubscribe}
          >
            {isParticipe ? "Subscribe" : "Unsubscribe"}
          </Button>
          {isCreator && (
            <Button size="small" onClick={onEdit}>
              <EditIcon fontSize="small" />
            </Button>
          )}
        </Box>
        {workout?.participants && workout.participants.length > 0 && (
          <Button variant="text" sx={{ flex: 1 }}>
            <AvatarGroup
              onClick={openList}
              max={4}
              spacing="medium"
              sx={{
                width: "100%",
                ".MuiAvatarGroup-avatar": {
                  width: 25,
                  height: 25,
                  cursor: "pointer",
                },
              }}
            >
              {workout?.participants.map((avatar, index) => (
                <Avatar key={index} alt="profile photo" src={avatar?.photo} />
              ))}
            </AvatarGroup>
          </Button>
        )}
      </CardActions>
    </Card>
  );
};
{
  /* <Box sx={{ display: "flex", alignItems: "center", gap: 2, p: 2 }}>
        <Avatar src={photo} sx={{ width: 60, height: 60 }} />
        <div>
          <Typography
            variant="body1"
            fontSize="1em"
            color="text.primary"
            fontWeight="regular"
          >
            {name}
          </Typography>
          <Typography
            variant="body2"
            fontSize=""
            color="text.secondary"
            fontWeight="regular"
          >
            {`${new Date(workout?.date).toLocaleDateString()} - ${new Date(workout?.date).toLocaleTimeString()}`}
          </Typography>
        </div>
      </Box> */
}
{
  /* <CardComponent
        index={workout?._id}
        user_id={user_id}
        img={workout?.outdoorGym?.photo}
        title={workout?.title}
        description={workout?.description}
        participants={workout?.participants}
        likes={workout.likes}
        commentsCount={workout.commentsCount}
        onLike={onLike}
      /> */
}
