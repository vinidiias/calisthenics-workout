import { useContext, useEffect, useMemo, useState } from "react";
//MATERIAL UI
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  Grid2,
  Typography,
} from "@mui/material";
//ICONS UI
import AddIcon from "@mui/icons-material/Add";
//API
import api from "../../services";
//COMPONENTS
import ParticipantsListModal from "../../components/ui/ParticipantsListModal";
import { SearchInput } from "../../components/ui/SearchInput";
//TANKSTACK  QUERY
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
//CONTEXT
import { UserContext } from "../../contexts/UserContext";
///HOOKS
import { useFetchAddress } from "../../hooks/useFetchAddress";
import { Select } from "../../components/ui/inputs/Select";
import { CardComponent } from "../../components/ui/CardComponent";
import { FormWorkout } from "../../components/ui/FormWorkout";

const fetchWorkoutNotSubscribed = async ({ auth }) => {
  const { data } = await api.get("/workout/not-subscribed", {
    headers: { auth: auth },
  });

  return data;
};

const fetchWorkoutSubscribed = async ({ auth }) => {
  const { data } = await api.get("/workout/subscribed", {
    headers: { auth: auth },
  });
  return data;
};

const subscribeToWorkout = async ({ auth, workoutId }) => {
  const { data } = await api.post(
    `/workout/subscribe`,
    { id: workoutId },
    { headers: { auth } }
  );

  return data;
};

const unsubscribeToWorkout = async ({ auth, workoutId }) => {
  const { data } = await api.delete(`/workout/unsubscribe/${workoutId}`, {
    headers: { auth },
  });

  return data;
};

const followToUser = async ({ userFrom, userTo }) => {
  const { data } = await api.post(`/user/${userTo}`, { userFrom });

  return data;
};

const Menu = ({ isParticipe, title }) => {
  const { user, setUser } = useContext(UserContext);
  const [open, setOpen] = useState(false);
  const [openList, setOpenList] = useState(false);
  const [participants, setParticipants] = useState([]);

  const {
    data: dataAddress,
    isLoading: isLoadingAddress,
    error: errorAddress,
  } = useFetchAddress("address", "/address");

  const optionsAddress = useMemo(() => {
    const options = [];

    if(dataAddress) {
      dataAddress.forEach(ad => {
        options.push({ label: ad.neighborhood, value: ad._id });
      });
    }

    return options;
  }, [dataAddress])

  const [addressFilter, setAddressFilter] = useState(null);

  const queryClient = useQueryClient();

  const { data, error, isLoading } = useQuery({
    queryKey: ["workouts"],
    queryFn: () =>
      isParticipe
        ? fetchWorkoutNotSubscribed({ auth: user._id })
        : fetchWorkoutSubscribed({ auth: user._id }),
  });

  const [dataFiltered, setDataFiltered] = useState(data || []);

  const { mutateAsync: subscribeToWorkoutFn, isPending } = useMutation({
    mutationFn: subscribeToWorkout,
    onSuccess: (newData) => {
      queryClient.setQueriesData(["workouts"], (oldData) => {
        return oldData
          ? oldData.filter((workout) => workout._id !== newData.workout._id)
          : oldData;
      });
    },
  });

  const {
    mutateAsync: unsubscribeToWorkoutFn,
    isPending: isPendingToUnsubscribe,
  } = useMutation({
    mutationFn: unsubscribeToWorkout,
    onSuccess: (newData) => {
      queryClient.setQueriesData(["workouts"], (oldData) => {
        return oldData
          ? oldData.filter((workout) => workout._id !== newData.workout._id)
          : oldData;
      });
    },
  });

  const { mutateAsync: followToUserFn } = useMutation({
    mutationFn: followToUser,
    onSuccess: (data) => {
      setUser((prevState) => ({
        ...prevState,
        following: [...prevState.following, data.data.userTo._id],
      }));
    },
  });

  const openListModal = (participants) => {
    setParticipants(participants);
    setOpenList(true);
  };

  useEffect(() => {
    if (data) {
      if (addressFilter === null || addressFilter === "") {
        setDataFiltered(data);
      } else {
        setDataFiltered(
          data.filter((workout) => workout.outdoorGym.address === addressFilter)
        );
      }
    }
  }, [addressFilter, setDataFiltered, data]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
        p: 5,
        backgroundColor: "background.default",
        overflowY: "clip",
      }}
    >
      <FormWorkout openModal={open} onClose={() => setOpen(false)} />
      <ParticipantsListModal
        openModal={openList}
        onClose={() => setOpenList(false)}
        participants={participants}
        handleFollowFn={followToUserFn}
      />
      <Box display="flex" justifyContent="center" gap={4} marginBottom={4}>
        <Typography variant="h4" color="text.primary" fontWeight="regular">
          {title}
        </Typography>
      </Box>
      <Box className="flex justify-between items-center gap-10 mb-10 max-sm:flex-col max-sm:gap-5">
        <SearchInput />
        <Box display="flex" alignItems="center" gap={5}>
          <Box display="flex" alignItems="center">
            <Typography
              fontSize="1em"
              color="text.secondary"
              className="text-gray-600"
            >
              Locality
            </Typography>
            <FormControl sx={{ m: 1, minWidth: 100 }}>
              <Select
                disabled={isLoadingAddress || errorAddress}
                size="small"
                displayEmpty
                inputProps={{ "aria-label": "Without label" }}
                defaultValue=""
                onChange={(e) => setAddressFilter(e.target.value)}
                options={optionsAddress ?? []}
                placeholder="All"
              />
            </FormControl>
          </Box>
          {isParticipe && (
            <Button
              onClick={() => setOpen(true)}
              variant="contained"
              sx={{ backgroundColor: "button.primary", color: "white" }}
            >
              <AddIcon />
            </Button>
          )}
        </Box>
      </Box>
      <Grid2
        container
        spacing={10}
        margin={`${!data || isLoading || data.length === 0 ? "auto" : "0"}`}
      >
        {isLoading ? (
          <CircularProgress />
        ) : dataFiltered.length > 0 ? (
          dataFiltered.map((workout, index) => (
            <Grid2 key={index}>
              <CardComponent
                index={workout._id}
                mutateAsync={
                  isParticipe ? subscribeToWorkoutFn : unsubscribeToWorkoutFn
                }
                img={workout.outdoorGym.photo}
                alt="img"
                title={workout.title}
                description={workout.description}
                participants={workout.participants}
                date={workout?.date}
                textBtn={
                  isParticipe
                    ? "Subscribe"
                    : workout.creator._id === user._id
                    ? "Edit"
                    : "Unsubscribe"
                }
                openList={() => openListModal(workout.participants)}
                loading={isPending || isPendingToUnsubscribe}
                isClick={true}
              />
            </Grid2>
          ))
        ) : error ? (
          <Typography color="text.primary">Error to fetch workouts.</Typography>
        ) : (
          <Typography color="text.primary">No Workouts</Typography>
        )}
      </Grid2>
    </Box>
  );
};

export default Menu;
