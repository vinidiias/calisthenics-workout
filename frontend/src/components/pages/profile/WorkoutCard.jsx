import { Avatar, Box, Paper, Typography } from "@mui/material";
import { CardComponent } from "../../ui/CardComponent";

export const WorkoutCard = ({ hist, photo, name, date }) => {
    return (
      <Paper key={hist._id} sx={{ flexGrow: 1 }}>
        <Box className="flex items-center gap-3 p-4">
          <Avatar src={photo} sx={{ width: 60, height: 60 }} />
          <div>
            <Typography
              variant="body1"
              fontSize="1em"
              color="text.primary"
              fontWeight="regular"
            >
              {name}
            </Typography>
            <Typography
              variant="body2"
              fontSize=""
              color="text.secondary"
              fontWeight="regular"
            >
              {`${date.toLocaleDateString()} - ${date.toLocaleTimeString()}`}
            </Typography>
          </div>
        </Box>
        <CardComponent
          index={hist?._id}
          img={hist?.outdoorGym?.photo}
          title={hist?.title}
          description={hist?.description}
          participants={hist?.participants}
          isClick={false}
        />
      </Paper>
    );
}