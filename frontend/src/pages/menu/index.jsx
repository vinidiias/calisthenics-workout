import {
  Box,
  Button,
  FormControl,
  Grid2,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import React, { useContext, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import { styled, alpha } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import CardComponent from "../../components/ui/CardComponent";
import AddIcon from "@mui/icons-material/Add";
import TransitionsModal from "../../components/ui/CreateForm";
import api from "../../services";
import { useMutation, useQuery } from "@tanstack/react-query";
import { UserContext } from "../../contexts/UserContext";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "100%",
    maxWidth: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "gray",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}));

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

const Menu = ({ isParticipe, title }) => {
  const { user } = useContext(UserContext)
  const [open, setOpen] = useState(false);

  const { data, error, isLoading } = useQuery({
    queryKey: ["workouts"],
    queryFn: () => isParticipe ? fetchWorkoutNotSubscribed({ auth: user._id }) : fetchWorkoutSubscribed({ auth: user._id })
  });

  const { mutateAsync: subscribeToWorkoutFn, } = useMutation({
    mutationFn: subscribeToWorkout,
    onSuccess: (data) => {
    }
  })

  return (
    <Box sx={{ flexGrow: 1, padding: 5 }} className="bg-gray-50">
      <TransitionsModal openModal={open} onClose={() => setOpen(false)} />
      <Box className="flex justify-center gap-4 mb-4">
        <Search sx={{ backgroundColor: "white", border: "1px solid #d6d6d6" }}>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Search…"
            inputProps={{ "aria-label": "search" }}
          />
        </Search>
        {isParticipe && (
          <Button
            onClick={() => setOpen(true)}
            variant="contained"
            color="primary"
          >
            <AddIcon />
          </Button>
        )}
      </Box>
      <Box className="flex justify-between items-center mb-10">
        <Typography
          variant="overline"
          className="text-gray-600"
          sx={{ fontSize: "1.5em", fontWeight: 600 }}
        >
          {title}
        </Typography>
       
        <Box className="flex items-center">
          <Typography className="text-gray-600">Locality</Typography>
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
      </Box>
      <Grid2 container spacing={10}>
        {data && data.map((workout, index) => (
          <Grid2 key={index}>
            <CardComponent
              index={workout._id}
              mutateAsync={subscribeToWorkoutFn}
              img={workout.outdoorGym.photo}
              alt='img'
              title={workout.title}
              description={workout.description}
              participants={workout.participants}
              date={workout?.date}
              textBtn={isParticipe ? "Subscribe" : workout.creator._id === user._id  ? "Edit" : "Unsubscribe"}
            />
          </Grid2>
        ))}
      </Grid2>
    </Box>
  );
};

export default Menu;
