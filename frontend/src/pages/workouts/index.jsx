import { useContext, useEffect, useMemo, useState } from "react";
//MATERIAL UI
import {
  Box,
  Button,
  CircularProgress,
  Grid2,
  Typography,
} from "@mui/material";
//COMPONENTS
import { SearchInput } from "../../components/ui/inputs/SearchInput";
import { InputSelect } from "../../components/ui/inputs/Select";
import { FormWorkout } from "../../components/pages/workouts/FormWorkout";
import { postFollowToUser } from "../../services/userApi";
import { patchLikeWorkout } from "../../services/workoutApi";
//CONTEXT
import { UserContext } from "../../contexts/UserContext";
///HOOKS
import { useFetchData } from "../../hooks/useFetchData";
//ICONS
import AddIcon from "@mui/icons-material/Add";
//TANKSTACK  QUERY
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DialogWorkoutCard } from "../../components/pages/workouts/DialogWorkoutCardInformation";
import { WorkoutCard } from "../../components/pages/workouts/WorkoutCard";
import { PeopleListDialog } from "../../components/PeopleListDialog";

const Menu = ({ isParticipe, title }) => {
  const { user, setUser } = useContext(UserContext);
  const [open, setOpen] = useState(false);
  const [openCard, setOpenCard] = useState(false);
  const [openList, setOpenList] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [editingWorkout, setEditingWorkout] = useState(null);
  const [addressFilter, setAddressFilter] = useState(null);
  const [dataFiltered, setDataFiltered] = useState([]);

  const queryClient = useQueryClient();

  const {
    data: dataAddress,
    isLoading: isLoadingAddress,
    error: errorAddress,
  } = useFetchData("address", "/outdoor-gym-addresses");

  const { data, error, isLoading } = useFetchData(
    ["workouts", { subscribed: !isParticipe }], // key
    isParticipe ? "/workouts?subscribed=false" : "/workouts?subscribed=true", // url
    {}, // options
    user._id, // auth
  );

  const optionsAddress = useMemo(() => {
    const options = [];

    if (dataAddress) {
      dataAddress.forEach((ad) => {
        options.push({ label: ad.neighborhood, value: ad._id });
      });
    }

    return options;
  }, [dataAddress]);

  const { mutateAsync: handleFollowToUserFn } = useMutation({
    mutationFn: postFollowToUser,
    onSuccess: (resp) => {
      setUser((prev) => ({
        ...prev,
        following: resp.userFrom.following,
      }));
    },
  });

  const { mutateAsync: handleLikeWorkout } = useMutation({
    mutationFn: patchLikeWorkout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workouts"] });
    },
  });

  const handleOpenListModal = (workout) => {
    setSelectedWorkout(workout);
    setOpenList(true);
  };

  const handleOpenCard = (workout) => {
    setSelectedWorkout(workout);
    setOpenCard(true);
  };

  const handleEditWorkout = (workout) => {
    setEditingWorkout(workout);
    setOpen(true);
  };

  useEffect(() => {
    if (data) {
      if (
        addressFilter === null ||
        addressFilter === "" ||
        addressFilter === "all"
      ) {
        setDataFiltered(data);
      } else {
        setDataFiltered(
          data.filter(
            (workout) => workout.outdoorGym.address === addressFilter,
          ),
        );
      }
      setSelectedWorkout((prev) => {
        if (prev === null) return null;

        const workout = data.find((w) => w._id === prev?._id);

        return workout ?? null;
      });
    }
  }, [addressFilter, data]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
        p: 5,
      }}
    >
      <FormWorkout
        openModal={open}
        onClose={() => {
          setOpen(false);
          setEditingWorkout(null);
        }}
        workout={editingWorkout}
      />
      <PeopleListDialog
        openModal={openList}
        onClose={() => setOpenList(false)}
        title={selectedWorkout?.title ?? ""}
        participants={selectedWorkout?.participants ?? []}
        handleFollowFn={handleFollowToUserFn}
      />
      <Box display="flex" justifyContent="center" gap={4} marginBottom={4}>
        <Typography
          variant="h6"
          color="text.primary"
          fontSize={"2em"}
          fontWeight="medium"
          letterSpacing={"1px"}
        >
          {title}
        </Typography>
      </Box>
      <Grid2 container size={12} alignItems={"center"} mb={4} spacing={1}>
        <Grid2 size={{ xs: 12, sm: 6, md: 8 }}>
          <SearchInput />
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 4, md: 3 }}>
          <InputSelect
            label="Locality"
            disabled={isLoadingAddress || errorAddress}
            size="small"
            defaultValue={-1}
            onChange={(e) => setAddressFilter(e.target.value)}
            options={optionsAddress ?? []}
          />
        </Grid2>
        {isParticipe && (
          <Grid2 size={{ xs: 12, sm: 2, md: 1 }}>
            <Button fullWidth onClick={() => setOpen(true)} variant="contained">
              <AddIcon />
            </Button>
          </Grid2>
        )}
      </Grid2>
      <Grid2 container spacing={2} flex={1}>
        {isLoading ? (
          <Grid2 margin="auto">
            <CircularProgress />
          </Grid2>
        ) : dataFiltered.length > 0 ? (
          dataFiltered.map((workout, index) => (
            <Grid2
              key={index}
              justifyItems={{ xs: "center", sm: "start" }}
              wrap="wrap"
              size={{ xs: 12, sm: 6, lg: 4, xl: 3 }}
            >
              <WorkoutCard
                user_id={user._id}
                isParticipe={isParticipe}
                workout={workout}
                openList={() => handleOpenListModal(workout)}
                onClick={() => handleOpenCard(workout)}
                onEdit={() => handleEditWorkout(workout)}
              />
            </Grid2>
          ))
        ) : (
          <Grid2
            container
            size={12}
            justifyContent={"center"}
            alignItems={"center"}
          >
            <Typography color="text.secondary">
              {error
                ? error?.response?.data
                : dataFiltered.length === 0
                  ? "No Workouts founds"
                  : "Error to fetch workouts."}
            </Typography>
          </Grid2>
        )}
      </Grid2>

      <DialogWorkoutCard
        open={openCard}
        onClose={() => setOpenCard(false)}
        user_id={user._id}
        workout={selectedWorkout}
        onLike={handleLikeWorkout}
      />
    </Box>
  );
};

export default Menu;
