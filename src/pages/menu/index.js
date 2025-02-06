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
          variant="contained"
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
          variant="contained"
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
  
    marginLeft: 0,
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
    return (
      <Box sx={{ flexGrow: 1, padding: 5 }} className="bg-gray-50">
        <Box className="flex justify-between items-center mb-10">
          <Typography variant="overline" className="text-gray-600" sx={{ fontSize: '1.5em', fontWeight: 600 }}>
            Workouts
          </Typography>
          <Search sx={{backgroundColor: 'white', border: '2px solid #d6d6d6'}}>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ "aria-label": "search" }}
            />
          </Search>
         <Box className="flex items-center">
          <Typography variant="inherit" color="gray">
            Locality
          </Typography>
         <FormControl sx={{ m: 1, minWidth: 100 }}>
            <Select
              size="small"
              displayEmpty
              inputProps={{ "aria-label": "Without label" }}
              defaultValue=""
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
          {wourkoutItem.map((workout, index) => (
            <React.Fragment key={index}>{workout}</React.Fragment>
          ))}
        </Grid2>
      </Box>
    );
}

export default Menu