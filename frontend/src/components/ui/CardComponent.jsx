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

const CardComponent = ({
  img,
  alt,
  title,
  description,
  textBtn,
  participants,
}) => {
  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardActionArea>
        <CardMedia component="img" height={140} image={img} alt={alt} />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions
        className={`${
          !textBtn || (participants && participants.length === 0)
            ? "flex justify-center"
            : ""
        }`}
      >
        {textBtn && (
          <Button
            loadingPosition="end"
            endIcon={<AddIcon />}
            variant="contained"
            sx={{
              marginRight: `${
                participants && participants.length !== 0 ? "5px" : "0px"
              }`,
            }}
          >
            {textBtn}
          </Button>
        )}
        {participants && participants.length !== 0 && (
          <AvatarGroup
            max={4}
            spacing="medium"
            sx={{ ".MuiAvatarGroup-avatar": { width: 30, height: 30 } }}
          >
            {participants.map((avatar, index) => (
              <Avatar key={index} alt="Remy Sharp" src="" />
            ))}
          </AvatarGroup>
        )}
      </CardActions>
    </Card>
  );
};

export default CardComponent;
