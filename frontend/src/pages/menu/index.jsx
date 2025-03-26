import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  Grid2,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import CardComponent from "../../components/ui/CardComponent";
import AddIcon from "@mui/icons-material/Add";
import TransitionsModal from "../../components/ui/CreateForm";
import api from "../../services";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { UserContext } from "../../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import ParticipantsListModal from "../../components/ui/ParticipantsListModal";
import { SearchInput } from "../../components/ui/SearchInput";
import { useFetchAddress } from "../../hooks/useFetchAddress";

const fetchWorkoutNotSubscribed = async({ auth }) => {
  const { data } = await api.get('/workout/not-subscribed', {
    headers: { auth: auth }
  })
  return data
}

const fetchWorkoutSubscribed = async({ auth }) => {
  const { data } = await api.get('/workout/subscribed', {
    headers: { auth: auth }
  })
  return data
}

const subscribeToWorkout = async({ auth, workoutId }) => {
  const { data } = await api.post(
    `/workout/subscribe`,
    { id: workoutId },
    { headers: { auth: auth } }
  );

  return data
}

const followToUser = async ({ userFrom, userTo }) => {
  const { data } = await api.post(`/user/${userTo}`, { userFrom })

  return { data }
}

const Menu = ({ isParticipe, title }) => {
  const { user, setUser } = useContext(UserContext)
  const [open, setOpen] = useState(false);
  const [openList, setOpenList] = useState(false)
  const [participants, setParticipants] = useState([])
  const { data: dataAddress, isLoading: isLoadingAddress, error: errorAddress } = useFetchAddress("address", "/address")
  const navigate = useNavigate()
  const [addressFilter, setAddressFilter] = useState(null)
  
  const queryClient = useQueryClient()

  const { data, error, isLoading } = useQuery({
    queryKey: ["workouts"],
    queryFn: () => isParticipe ? fetchWorkoutNotSubscribed({ auth: user._id }) : fetchWorkoutSubscribed({ auth: user._id })
  });

  const [dataFiltered, setDataFiltered] = useState(data || [])


  const { mutateAsync: subscribeToWorkoutFn, isPending } = useMutation({
    mutationFn: subscribeToWorkout,
    onSuccess: (newData) => {
      console.log(newData)
      queryClient.setQueriesData(["workouts"], (oldData) => {
        console.log(oldData)
        return oldData ? oldData.filter(workout => workout._id !== newData.workout._id) : oldData
      })
    }
  })

  const { mutateAsync: followToUserFn } = useMutation({
    mutationFn: followToUser,
    onSuccess: (data) => {
      setUser(prevState => ({
        ...prevState,
        following: [...prevState.following, data.data.userTo._id]
      }))
    }
  })

  const openListModal = ( participants ) => {
    setParticipants(participants)
    setOpenList(true)
  }

  useEffect(() => {
    if(data) {
      if(addressFilter === null || addressFilter === '') {
        setDataFiltered(data)
      } else {
        setDataFiltered(data.filter(workout => workout.outdoorGym.address === addressFilter))
      }
    }
  }, [addressFilter, setDataFiltered, data])

  useEffect(() => {
    if(!user.isLogged) {
      navigate('/')
    }
  })

  return (
    <Box
      sx={{ flex: 1, padding: 5, display: "flex", flexDirection: "column", backgroundColor: 'background.default' }}
      className="bg-gray-50"

    >
      <TransitionsModal openModal={open} onClose={() => setOpen(false)} />
      <ParticipantsListModal
        openModal={openList}
        onClose={() => setOpenList(false)}
        participants={participants}
        handleFollowFn={followToUserFn}
      />
      <Box className="flex justify-center gap-4 mb-4">
        <Typography variant="h4" color="text.primary" fontWeight="regular">
          {title}
        </Typography>
      </Box>
      <Box className="flex justify-between items-center gap-10 mb-10 max-sm:flex-col max-sm:gap-5">
        <SearchInput />
        <Box className="flex items-center gap-5">
          <div className="flex items-center">
            <Typography fontSize="1em" color="text.secondary" className="text-gray-600">
              Locality
            </Typography>
            <FormControl sx={{ m: 1, minWidth: 100 }}>
              <Select
                size="small"
                displayEmpty
                inputProps={{ "aria-label": "Without label" }}
                defaultValue=""
                sx={(theme) => ({
                  backgroundColor: theme.palette.input.primary,
                  color: theme.palette.input.secondary,
                  borderColor: `${theme.palette.input.border}`,
                })}
                onChange={(e) => setAddressFilter(e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                {dataAddress &&
                  dataAddress.map((address) => (
                    <MenuItem key={address._id} value={address._id}>
                      {address.neighborhood}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </div>
          {isParticipe && (
          <Button
            onClick={() => setOpen(true)}
            variant="contained"
            sx={{ backgroundColor: "button.primary", color: 'white' }}
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
        ) :dataFiltered.length > 0 ? (
         dataFiltered.map((workout, index) => (
            <Grid2 key={index}>
              <CardComponent
                index={workout._id}
                mutateAsync={subscribeToWorkoutFn}
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
                loading={isPending}
              />
            </Grid2>
          ))
        ) : (
          <Typography color="text.primary">No Workouts</Typography>
        )}
      </Grid2>
    </Box>
  );
};

export default Menu;
