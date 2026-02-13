import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Divider,
  IconButton,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import CommentIcon from "@mui/icons-material/Comment";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  subscribeToWorkout,
  unsubscribeToWorkout,
} from "../../../services/workoutApi";
import { useResponseNotifier } from "../../../hooks/useResponseNotifier";
import { useFetchData } from "../../../hooks/useFetchData";
import { WorkoutCardChat } from "../workouts/WorkoutCardChat";

function TabContent(props) {
  const { children, value, index, ...other } = props;

  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </Box>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export const WorkoutCardInformations = ({
  initialTab,
  user_id,
  isHistory,
  workout,
  onLike,
  // onComment,
  onCancel,
}) => {
  const [value, setValue] = useState(0);

  const { data: creator } = useFetchData("key", `/users/${workout?.creator._id}`);
  const { handleErrorResponse } = useResponseNotifier();
  
  const queryClient = useQueryClient();

  const { mutateAsync: subscribeToWorkoutFn, isPending: isPendingToSubscribe } =
    useMutation({
      mutationFn: subscribeToWorkout,
      onSuccess: () => {
        onCancel?.();
        queryClient.invalidateQueries({ queryKey: ["workouts"] });
      },
      onError: (resp) => handleErrorResponse(resp?.response?.data),
    });

  const {
    mutateAsync: unsubscribeToWorkoutFn,
    isPending: isPendingToUnsubscribe,
  } = useMutation({
    mutationFn: unsubscribeToWorkout,
    onSuccess: () => {
      onCancel?.();
      queryClient.invalidateQueries({ queryKey: ["workouts"] });
    },
  });

  const handleSubscription = () => {
    const dto = {
      auth: user_id,
      workoutId: workout._id,
    };

    if (!hasParticipation) {
      subscribeToWorkoutFn(dto);
    } else {
      unsubscribeToWorkoutFn(dto);
    }
  };

  const hasParticipation = workout?.participants?.some(
    (p) => p._id === user_id,
  );

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    if (initialTab !== undefined && initialTab !== null) {
      setValue(initialTab); 
      return;
    }
    setValue(0);
  }, [initialTab]);

  console.log(workout)

  return (
    <Card>
      <Box sx={{ width: "100%", bgcolor: "primary.dark" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            variant="fullWidth"
            aria-label="tabs-workout"
          >
            <Tab
              label="Informations"
              {...a11yProps(0)}
              sx={{ fontSize: "1em", textTransform: "none" }}
            />
            {hasParticipation && (
              <Tab
                label="Chat"
                {...a11yProps(1)}
                sx={{ fontSize: "1em", textTransform: "none" }}
              />
            )}
          </Tabs>
        </Box>
        <TabContent value={value} index={0}>
          <Box sx={{ display: "flex" }}>
            <Box
              sx={{ display: "flex", flexDirection: "column", width: "100%" }}
            >
              <CardContent sx={{ flex: "1 0 auto" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Avatar src={creator?.photo} sx={{ width: 30, height: 30 }} />
                  <Box>
                    <Typography
                      variant="body1"
                      fontSize=".8em"
                      color="text.secondary"
                      fontWeight="regular"
                    >
                      {creator?.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      fontWeight="light"
                      fontSize=".7em"
                    >
                      {`${new Date(workout?.date).toLocaleDateString()} - ${new Date(workout?.date).toLocaleTimeString()}`}
                    </Typography>
                  </Box>
                </Box>
                <Divider sx={{ width: "100%", my: 1 }} />
                <Typography
                  variant="subtitle1"
                  fontSize="1.1em"
                  color="text.primary"
                >
                  {workout?.title}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  fontWeight="light"
                  fontSize=".8em"
                >
                  {workout?.description}
                </Typography>
                {!isHistory  && (
                  <Box mt={2}>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={handleSubscription}
                      loadingPosition="end"
                      color="white"
                      loading={isPendingToSubscribe || isPendingToUnsubscribe}
                    >
                      {!hasParticipation ? "Subscribe" : "Unsubscribe"}
                    </Button>
                  </Box>
                )}
              </CardContent>
              <Divider sx={{ width: "100%", my: 1 }} />
              <CardActions>
                <Button
                  fullWidth
                  startIcon={
                    workout?.likes?.includes(user_id) ? (
                      <FavoriteIcon />
                    ) : (
                      <FavoriteBorderIcon />
                    )
                  }
                  onClick={() => onLike({ user_id, workout_id: workout._id })}
                >
                  Like {workout?.likes?.length ?? 0}
                </Button>
                {hasParticipation && (
                  <Button
                    fullWidth
                    startIcon={<CommentIcon />}
                    onClick={() => setValue(1)}
                  >
                    Comment {workout?.commentsCount ?? 0}
                  </Button>
                )}
              </CardActions>
            </Box>
            <CardMedia
              component="img"
              sx={{ width: 200 }}
              image={workout?.outdoorGym?.photo}
              alt={workout?.title + " image"}
            />
          </Box>
        </TabContent>
        <TabContent value={value} index={1}>
          <WorkoutCardChat
            participants={workout?.participants}
            workout_id={workout?._id}
          />
        </TabContent>
      </Box>
    </Card>
  );
};
