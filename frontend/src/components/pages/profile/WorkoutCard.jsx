// MATERIAL UI
import { Avatar, Box, Typography } from "@mui/material";
// COMPONENTS
import { CardComponent } from "../../CardComponent";

export const WorkoutCard = ({ hist, photo, name, date }) => {
  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, p: 2 }}>
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
    </Box>
  );
};
