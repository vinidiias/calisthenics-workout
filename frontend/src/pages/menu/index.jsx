import {
  Box,
  Button,
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
import { useMutation, useQuery } from "@tanstack/react-query";
import { UserContext } from "../../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import ParticipantsListModal from "../../components/ui/ParticipantsListModal";
import { SearchInput } from "../../components/ui/SearchInput";

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
  const navigate = useNavigate()

  const { data, error, isLoading } = useQuery({
    queryKey: ["workouts"],
    queryFn: () => isParticipe ? fetchWorkoutNotSubscribed({ auth: user._id }) : fetchWorkoutSubscribed({ auth: user._id })
  });

  const { mutateAsync: subscribeToWorkoutFn } = useMutation({
    mutationFn: subscribeToWorkout,
    onSuccess: (data) => {
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
    console.log('aqui', participants)
    setParticipants(participants)
    setOpenList(true)
  }

  useEffect(() => {
    if(!user.isLogged) {
      navigate('/')
    }
  })

  return (
    <Box sx={{ flex:1, padding: 5, display: 'flex', flexDirection: 'column' }} className="bg-gray-50">
      <TransitionsModal openModal={open} onClose={() => setOpen(false)} />
      <ParticipantsListModal
        openModal={openList}
        onClose={() => setOpenList(false)}
        participants={participants}
        handleFollowFn={followToUserFn}
      />
      <Box className="flex justify-center gap-4 mb-4">
        <Typography variant="h4" className="text-gray-800" fontWeight="regular">
          {title}
        </Typography>
      </Box>
      <Box className="flex justify-between items-center gap-10 mb-10">
        <SearchInput />
        <Box className="flex items-center">
          <Typography fontSize="1em" className="text-gray-600">
            Locality
          </Typography>
          <FormControl sx={{ m: 1, minWidth: 100 }}>
            <Select
              size="small"
              displayEmpty
              inputProps={{ "aria-label": "Without label" }}
              defaultValue=""
              sx={{ backgroundColor: "white" }}
            >
              <MenuItem value="">
                <em>All</em>
              </MenuItem>
              <MenuItem value="vila-a">Vila A</MenuItem>
              <MenuItem value="vila-c">Vila C</MenuItem>
              <MenuItem value="cidade-nova">Cidade Nova</MenuItem>
            </Select>
          </FormControl>
        </Box>
        {isParticipe && (
          <Button
            onClick={() => setOpen(true)}
            variant="contained"
            sx={{ backgroundColor: "var(--color-gray-700)" }}
          >
            <AddIcon />
          </Button>
        )}
      </Box>
        <Grid2 container spacing={10}>
          {data &&
            data.map((workout, index) => (
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
                />
              </Grid2>
            ))}
        </Grid2>
    </Box>
  );
};

export default Menu;
