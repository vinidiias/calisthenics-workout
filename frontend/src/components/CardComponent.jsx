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
import { UserContext } from "../contexts/UserContext";
import FavoriteIcon from '@mui/icons-material/Favorite';
import CommentIcon from '@mui/icons-material/Comment';

export const CardComponent = ({
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
                <DateRangeIcon />
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
            <AvatarGroup
              max={4}
              spacing="medium"
              sx={{
                justifyContent: "start",
                ".MuiAvatarGroup-avatar": {
                  width: 30,
                  height: 30,
                  cursor: "pointer",
                },
              }}
              onClick={openList}
            >
              {participants?.map((avatar, index) => (
                <Avatar key={index} alt="profile photo" src={avatar?.photo} />
              ))}
            </AvatarGroup>
            <Divider sx={{ my: 2 }} />
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                gap: 2,
              }}
            >
              <Button fullWidth startIcon={<FavoriteIcon />}>
                Like
              </Button>
              <Button fullWidth startIcon={<CommentIcon />}>
                Comment
              </Button>
            </Box>
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
                variant="contained"
                onClick={handleSubscription}
                loadingPosition="end"
                endIcon={<AddIcon />}
                color="white"
                loading={loading}
              >
                {textBtn}
              </Button>
            </Box>
          )}
          {isClick && participants && participants.length !== 0 && (
            <Button variant="text">
              <AvatarGroup
                onClick={openList}
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