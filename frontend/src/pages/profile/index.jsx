import { useState } from "react";
import { useParams } from "react-router-dom";
import { useContext } from "react";
// MATERIAL UI
import {
  Container,
  Paper,
  Typography,
  Grid2 as Grid,
  Skeleton,
} from "@mui/material";
// COMPONENTS
import { FriendsCards } from "../../components/pages/profile/FriendsCards";
import { HeaderProfile } from "../../components/pages/profile/HeaderProfile";
// HOOKS
import { useFetchData } from "../../hooks/useFetchData";
// CONTEXT
import { UserContext } from "../../contexts/UserContext";
// TANSTACK QUERY
import { AlertErrorPage } from "../../components/AlertErrorPage";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { patchLikeWorkout } from "../../services/workoutApi";
import { FormWorkout } from "../../components/pages/workouts/FormWorkout";
import { WorkoutCardHistory } from "../../components/pages/profile/WorkoutCardHistory";
import { PeopleListDialog } from "../../components/PeopleListDialog";
import { fetchFollowersByUser, fetchFollowingByUser } from "../../services/userApi";
import { DialogWorkoutCard } from "../../components/pages/workouts/DialogWorkoutCardInformation";

export default function Profile() {
  const [openEdit, setOpenEdit] = useState(false);
  const [openFollows, setOpenFollows] = useState(false);
  const [openWorkoutDialog, setOpenWorkoutDialog] = useState(false);
  const [initialTab, setInitialTab] = useState(null);
  const [editingWorkout, setEditingWorkout] = useState(null);
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [follows, setFollows] = useState([]);
  const [titlePeopleList, setTitlePeopleList] = useState("");

  const { user } = useContext(UserContext);

  const params = useParams();
  const queryClient = useQueryClient();

  const { data, error, isLoading } = useFetchData(
    ["user", { _id: params.id }],
    `/users/${params.id}`,
  );
  const {
    data: workouts,
    error: errorWorkout,
    isLoading: isLoadingWorkout,
  } = useFetchData(
    ["workouts", { creator: params.id }],
    `/workouts?creator=${params.id}&hasComments=true`,
  );

  const { mutateAsync } = useMutation({
    mutationFn: patchLikeWorkout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workouts"] });
    },
  });

  const handleEditWorkout = (workout) => {
    setEditingWorkout(workout);
    setOpenEdit(true);
  };

  const handleOpenFollowersDialog = async(isFollowers) => {
    const response = isFollowers
      ? await fetchFollowersByUser(data._id ?? 0)
      : await fetchFollowingByUser(data._id ?? 0);
    
    setFollows(response);
    setTitlePeopleList(isFollowers ? "Followers list" : "Following list")
    setOpenFollows(true);
  }

  const friends = data?.followers?.filter((f) => data?.following?.includes(f?._id));

  if (error) {
    return <AlertErrorPage message={error.message} />;
  }

  return (
    <Container
      maxWidth={false}
      sx={{ p: 2, width: { xs: "100%", sm: "70%" } }}
      disableGutters
    >
      <FormWorkout
        openModal={openEdit}
        onClose={() => {
          setOpenEdit(false);
          setEditingWorkout(null);
        }}
        workout={editingWorkout}
      />
      <Grid container justifyContent="center" spacing={6}>
        <Grid size={12}>
          <HeaderProfile
            backgroundPhoto={data?.backgroundPhoto}
            userData={data}
            isLoading={isLoading}
            onViewFollows={handleOpenFollowersDialog}
          />
        </Grid>
        <Grid
          size={{ xs: 12, md: 5 }}
          sx={{
            alignSelf: "flex-start",
            position: { xs: "inherit", md: "sticky" },
            top: { xs: 0, md: 69 },
          }}
        >
          <FriendsCards friends={friends ?? []} />
        </Grid>
        <Grid container size={{ xs: 12, md: 7 }}>
          {isLoadingWorkout ? (
            <Grid size={12}>
              <Skeleton width="100%" variant="rounded" height="100%" />
            </Grid>
          ) : workouts?.length > 0 ? (
            <Grid container justifyContent={{ md: "end" }} gap={2} size={12}>
              {workouts?.map((workout) => {
                return (
                  <Grid size={12} key={workout._id}>
                    <Paper>
                      <WorkoutCardHistory
                        user_id={user._id}
                        photo={data?.photo}
                        workout={workout}
                        onEdit={() => handleEditWorkout(workout)}
                        onClick={(tab) => {
                          if (typeof tab === "number") setInitialTab(tab);
                          setSelectedWorkout(workout);
                          setOpenWorkoutDialog(true);
                        }}
                      />
                    </Paper>
                  </Grid>
                );
              })}
            </Grid>
          ) : (
            <Grid container size={12}>
              <Paper sx={{ flex: 1, alignContent: "center" }}>
                <Typography textAlign="center" sx={{ alignSelf: "center" }}>
                  {errorWorkout ? errorWorkout.message : "No activities"}
                </Typography>
              </Paper>
            </Grid>
          )}
        </Grid>
      </Grid>
      <PeopleListDialog
        title={titlePeopleList}
        participants={follows}
        onClose={() => setOpenFollows(false)}
        openModal={openFollows}
      />
      <DialogWorkoutCard
        initialTab={initialTab}
        open={openWorkoutDialog}
        onClose={() => {
          setOpenWorkoutDialog(false);
          setSelectedWorkout(null);
        }}
        user_id={user._id}
        workout={selectedWorkout}
        onLike={mutateAsync}
      />
    </Container>
  );
}
