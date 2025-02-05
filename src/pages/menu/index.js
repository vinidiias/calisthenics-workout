import { Avatar, AvatarGroup, Box, Button, Card, CardActionArea, CardActions, CardContent, CardMedia, FormControl, Grid2, InputLabel, MenuItem, Select, Typography } from "@mui/material"
import AddIcon from '@mui/icons-material/Add';
import GroupsIcon from '@mui/icons-material/Groups';
import React from "react";
import SearchIcon from '@mui/icons-material/Search';
import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';

const wourkoutItem = [
  <Grid2>
    <Card sx={{ maxWidth: 345 }}>
      <CardActionArea>
        <CardMedia
          component="img"
          height={140}
          image="https://tubefittings.eu/blog/wp-content/uploads/2023/07/Tubefittings_blog_tubefittings_Calisthenics_Parks_-Street_Workout2.jpg"
          alt="calithenics place"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            Praça Vila A
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Back-day and Chest-day
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button
          loadingPosition="end"
          endIcon={<AddIcon />}
          variant="outlined"
          sx={{ marginRight: 5 }}
        >
          Participe
        </Button>
        <AvatarGroup
          max={4}
          spacing="medium"
          sx={{ ".MuiAvatarGroup-avatar": { width: 30, height: 30 } }}
        >
          <Avatar alt="Remy Sharp" src="" />
          <Avatar alt="Travis Howard" src="" />
          <Avatar alt="Cindy Baker" src="" />
          <Avatar alt="Agnes Walker" src="" />
          <Avatar alt="Trevor Henderson" src="" />
        </AvatarGroup>
      </CardActions>
    </Card>
  </Grid2>,
  <Grid2>
    <Card sx={{ maxWidth: 345 }}>
      <CardActionArea>
        <CardMedia
          component="img"
          height={140}
          image="https://tubefittings.eu/blog/wp-content/uploads/2023/07/Tubefittings_blog_tubefittings_Calisthenics_Parks_-Street_Workout2.jpg"
          alt="calithenics place"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            Praça Vila A
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Back-day and Chest-day
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button
          loadingPosition="end"
          endIcon={<AddIcon />}
          variant="outlined"
          sx={{ marginRight: 5 }}
        >
          Participe
        </Button>
        <AvatarGroup
          max={4}
          spacing="medium"
          sx={{ ".MuiAvatarGroup-avatar": { width: 30, height: 30 } }}
        >
          <Avatar alt="Remy Sharp" src="" />
          <Avatar alt="Travis Howard" src="" />
          <Avatar alt="Cindy Baker" src="" />
          <Avatar alt="Agnes Walker" src="" />
          <Avatar alt="Trevor Henderson" src="" />
        </AvatarGroup>
      </CardActions>
    </Card>
  </Grid2>,
];
const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    border: '1px solid currentColor',
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: 'auto',
    },
  }));
  
  const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }));
  
  const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    width: '100%',
    '& .MuiInputBase-input': {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)})`,
      transition: theme.transitions.create('width'),
      [theme.breakpoints.up('sm')]: {
        width: '12ch',
        '&:focus': {
          width: '20ch',
        },
      },
    },
  }));

const Menu = () => {

    console.log(wourkoutItem)
    return (
      <Box sx={{ flexGrow: 1, padding: 5 }}>
        <Box className="flex justify-between items-center mb-10">
          <Typography variant="h4" component="div">
            Workouts
          </Typography>
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ "aria-label": "search" }}
            />
          </Search>
          <FormControl  sx={{  minWidth: 100 }}>
            <InputLabel id="demo-simple-select-label">Locality</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Age"
              autoWidth
            >
              <MenuItem value={10}>Ten</MenuItem>
              <MenuItem value={20}>Twenty</MenuItem>
              <MenuItem value={30}>Thirasdasdasty</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Grid2 container spacing={10}>
          {wourkoutItem.map((workout, index) => (
            <React.Fragment key={index}>{workout}</React.Fragment>
          ))}
        </Grid2>
      </Box>
    );
}

export default Menu