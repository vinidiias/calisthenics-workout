// MATERIAL UI
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
// ICONS
import AddIcon from "@mui/icons-material/Add";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import CommentIcon from "@mui/icons-material/Comment";

export const CardComponent = ({
  index,
  user_id,
  img,
  alt,
  title,
  description,
  commentsCount,
  likes,
  textBtn,
  participants,
  date,
  handleSubscription,
  onLike,
  openList,
  onClick,
  isHistory=false,
  loading,
}) => {
  const dateFormatted = new Date(date);

  return (
    <Card
      sx={{
        width: "100%",
        maxWidth: isHistory ? 345 : "100%",
        backgroundColor: isHistory ? "" : "transparent",
      }}
      elevation={isHistory ? 2 : 0}
    >
      {isHistory ? (
        <CardActionArea onClick={onClick}>
          <CardMedia component="img" height={140} image={img} alt={alt} />
          <CardContent>
            <Typography
              gutterBottom
              variant="subtitle1"
              fontSize="1.5em"
              color="text.primary"
            >
              {title}
            </Typography>
            <Typography
              marginBottom={1}
              fontSize=".9em"
              variant="subtitle2"
              color="text.secondary"
            >
              {description}
            </Typography>
            {date && (
              <Typography
                display="flex"
                alignSelf="center"
                fontSize=".9em"
                variant="subtitle2"
                color="text.secondary"
              >
                <span>
                  {dateFormatted.toLocaleDateString()} -{" "}
                  {dateFormatted.toLocaleTimeString()}
                </span>
              </Typography>
            )}
          </CardContent>
        </CardActionArea>
      ) : (
        <CardContent>
          <CardMedia component="img" image={img} alt={alt} />
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
                flexDirection: { xs: "column", sm: "row" },
                gap: 2,
              }}
            >
              <Button
                fullWidth
                startIcon={
                  likes?.includes(user_id) ? (
                    <FavoriteIcon />
                  ) : (
                    <FavoriteBorderIcon />
                  )
                }
                onClick={() => onLike({ user_id, workout_id: index })}
              >
                Like {likes?.length ?? 0}
              </Button>
              <Button fullWidth startIcon={<CommentIcon />}>
                Comment {commentsCount ?? 0}
              </Button>
            </Box>
          </CardContent>
        </CardContent>
      )}
      <CardActions
        // sx={{
        //   justifyContent:
        //     !textBtn || (participants && participants.length === 0)
        //       ? "center"
        //       : "",
        // }}
      >
        {handleSubscription && (
          <Box marginRight={participants && participants.length !== 0 ? 5 : 0}>
            <Button
              variant="contained"
              onClick={handleSubscription}
              loadingPosition="end"
              endIcon={<AddIcon />}
              color="white"
              loading={loading}
            >
              {textBtn ?? "Subscribe"}
            </Button>
          </Box>
        )}
        {isHistory && participants && participants.length !== 0 && (
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
    </Card>
  );
};
