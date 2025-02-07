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
import AddIcon from '@mui/icons-material/Add';

const CardComponent = ({ img, alt, title, description, textBtn }) => {
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
      <CardActions className={`${!textBtn ? 'flex justify-center': ''}`}>
        {textBtn && (
          <Button
            loadingPosition="end"
            endIcon={<AddIcon />}
            variant="contained"
            sx={{ marginRight: 5 }}
          >
            {textBtn}
          </Button>
        )}
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
  );
};

export default CardComponent;
