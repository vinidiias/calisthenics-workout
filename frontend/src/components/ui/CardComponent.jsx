import {
  Avatar,
  AvatarGroup,
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useContext } from "react";
import { UserContext } from "../../contexts/UserContext";
import styles from './CardComponent.module.css'

const CardComponent = ({
  index,
  workout,
  textBtn,
  mutateAsync
}) => {
  const { user } = useContext(UserContext)

  const handleSubscription = async() => {
    try {
      await mutateAsync({ auth: user._id, workoutId: index })
      alert('Subscribed sucessfully!')
    } catch(err) { 
      console.error(err)
    }
  }

  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardActionArea>
        <CardMedia component="img" height={140} image={workout.outdoorGym.photo} alt="Outdoor Gym Photo" />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {workout.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {workout.description}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions
        className={`${
          !textBtn || (workout.participants && workout.participants.length === 0)
            ? `${styles.justify_center}`
            : ""
        }`}
      >
        {textBtn && (
          <Button
            onClick={handleSubscription}
            loadingPosition="end"
            endIcon={<AddIcon />}
            variant="contained"
            sx={{
              marginRight: `${
                workout.participants && workout.participants.length !== 0 ? "5px" : "0px"
              }`,
            }}
          >
            {textBtn}
          </Button>
        )}
        {workout.participants && workout.participants.length !== 0 && (
          <AvatarGroup
            max={4}
            spacing="medium"
            sx={{ ".MuiAvatarGroup-avatar": { width: 30, height: 30 } }}
          >
            {workout.participants.map((avatar, index) => (
              <Avatar key={index} alt="profile photo" src={avatar?.photo} />
            ))}
          </AvatarGroup>
        )}
      </CardActions>
    </Card>
  );
};

export default CardComponent;
