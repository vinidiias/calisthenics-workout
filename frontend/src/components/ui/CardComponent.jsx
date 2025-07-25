import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Divider,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DateRangeIcon from '@mui/icons-material/DateRange';
import { useContext } from "react";
import { UserContext } from "../../contexts/UserContext";
import FavoriteIcon from '@mui/icons-material/Favorite';
import CommentIcon from '@mui/icons-material/Comment';

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
  openList,
  isClick,
  loading
}) => {
  const { user } = useContext(UserContext)
  const dateFormatted = new Date(date)

  const handleSubscription = async() => {
    try {
      await mutateAsync({ auth: user._id, workoutId: index })
    } catch(err) { 
      console.error(err)
    }
  }

  return (
    <Card
      sx={{
        maxWidth: isClick ? 345 : "100%",
        backgroundColor: isClick ? "" : "transparent",
      }}
      elevation={isClick ? 2 : 0}
    >
      {isClick ? (
        <CardActionArea>
          <CardMedia component="img" height={140} image={img} alt={alt} />
          <CardContent>
            <Typography
              gutterBottom
              variant="h5"
              component="div"
              color="text.primary"
            >
              {title}
            </Typography>
            <Typography marginBottom={1} variant="body1" color="text.secondary">
              {description}
            </Typography>
            {date && (
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
            )}
          </CardContent>
        </CardActionArea>
      ) : (
        <CardContent>
          <CardMedia component="img" height={140} image={img} alt={alt} />
          <CardContent>
            <Typography
              gutterBottom
              variant="h5"
              component="div"
              color="text.primay"
            >
              {title}
            </Typography>
            <Typography
              marginBottom={1}
              variant="body1"
              color="text.secondary"
              fontSize="1em"
            >
              {description}
            </Typography>
            <Button onClick={openList} sx={{ minWidth: 0, padding: 0 }}>
              <AvatarGroup
                max={4}
                spacing="medium"
                sx={{
                  ".MuiAvatarGroup-avatar": {
                    width: 30,
                    height: 30,
                    cursor: "pointer",
                  },
                }}
              >
                {participants?.map((avatar, index) => (
                  <Avatar key={index} alt="profile photo" src={avatar?.photo} />
                ))}
              </AvatarGroup>
            </Button>
            <Divider sx={{ my: 2 }} />
            <div className="flex items-center justify-around">
              <Button
                sx={{ textTransform: "none", color: "text.secondary" }}
                startIcon={<FavoriteIcon />}
              >
                Like
              </Button>
              <Button
                sx={{ textTransform: "none", color: "text.secondary" }}
                startIcon={<CommentIcon />}
              >
                Comment
              </Button>
            </div>
          </CardContent>
        </CardContent>
      )}
      {isClick && (
        <CardActions
          sx={{
            justifyContent:
              !textBtn || (participants && participants.length === 0)
                ? "center"
                : "",
          }}
        >
          {textBtn && (
            <Box
              marginRight={participants && participants.length !== 0 ? 5 : 0}
            >
              <Button
                onClick={handleSubscription}
                loadingPosition="end"
                endIcon={<AddIcon />}
                variant="contained"
                color="white"
                sx={{
                  textTransform: "none",
                  fontSize: "1em",
                  fontWeight: "regular",
                  backgroundColor: "button.primary",
                  color: "white",
                }}
                loading={loading}
              >
                {textBtn}
              </Button>
            </Box>
          )}
          {isClick && participants && participants.length !== 0 && (
            <Button onClick={openList}>
              <AvatarGroup
                max={4}
                spacing="medium"
                sx={{
                  ".MuiAvatarGroup-avatar": {
                    width: 30,
                    height: 30,
                    cursor: "pointer",
                  },
                }}
              >
                {participants.map((avatar, index) => (
                  <Avatar key={index} alt="profile photo" src={avatar?.photo} />
                ))}
              </AvatarGroup>
            </Button>
          )}
        </CardActions>
      )}
    </Card>
  );
};

export default CardComponent;