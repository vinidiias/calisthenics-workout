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
import DateRangeIcon from '@mui/icons-material/DateRange';
import { useContext } from "react";
import { UserContext } from "../../contexts/UserContext";
import styles from './CardComponent.module.css'

const CardComponent = ({
  index,
  img,
  alt,
  title,
  description,
  textBtn,
  participants,
  date,
  mutateAsync,
  openList
}) => {
  const { user } = useContext(UserContext)
  const dateFormatted = new Date(date)

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
        <CardMedia component="img" height={140} image={img} alt={alt} />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {title}
          </Typography>
          <Typography marginBottom={1} variant="body1" color="text.secondary">
            {description}
          </Typography>{" "}
          <Typography
            display="flex"
            alignSelf="center"
            gap={0.5}
            variant="subtitle1"
            color="text.secondary"
          >
            <DateRangeIcon />{" "}
            <span>
              {dateFormatted.toLocaleDateString()} às{" "}
              {dateFormatted.toLocaleTimeString()}
            </span>
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions
        className={`${
          !textBtn || (participants && participants.length === 0)
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
                participants && participants.length !== 0 ? "5px" : "0px"
              }`,
              textTransform: "none",
              fontSize: "1em",
              fontWeight: "regular",
              backgroundColor: 'var(--color-gray-700)'
            }}
          >
            {textBtn}
          </Button>
        )}
        {participants && participants.length !== 0 && (
          <Button onClick={openList}>
            <AvatarGroup
              max={4}
              spacing="medium"
              sx={{ ".MuiAvatarGroup-avatar": { width: 30, height: 30, cursor: "pointer" } }}
            >
              {participants.map((avatar, index) => (
                <Avatar key={index} alt="profile photo" src={avatar?.photo} />
              ))}
            </AvatarGroup>
          </Button>
        )}
      </CardActions>
    </Card>
  );
};

export default CardComponent;
