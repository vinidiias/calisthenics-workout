// MATERIAL UI
import { Avatar, Grid2, Paper, Typography, useTheme } from "@mui/material";

export const Message = ({ msg, isMyMessage, selectedContact, photo }) => {
  const theme = useTheme();

  return (
    <Grid2
      key={msg.id}
      container
      spacing={1}
      justifyContent={isMyMessage ? "flex-end" : "flex-start"}
    >
      {!isMyMessage && (
        <Grid2>
          <Avatar
            sx={{ width: { xs: 30, sm: 40 }, height: { xs: 30, sm: 40 } }}
            src={selectedContact.photo}
          />
        </Grid2>
      )}
      <Grid2>
        <Paper
          sx={{
            width: "max-content",
            maxWidth: "400px",
            padding: 1,
            paddingY: 0.5,
          }}
        >
          <Typography
            sx={{
              fontSize: {
                xs: "0.7rem",
                sm: "1rem",
                color: theme.palette.text.secondary,
              },
            }}
          >
            {msg.content}
          </Typography>
          <Typography
            sx={{
              fontSize: { xs: "0.55rem", sm: "0.7rem" },
              color: theme.palette.text.secondary,
            }}
          >
            {new Date(msg.timestamp).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Typography>
        </Paper>
      </Grid2>
      {isMyMessage && (
        <Grid2>
          <Avatar
            sx={{ width: { xs: 30, sm: 40 }, height: { xs: 30, sm: 40 } }}
            src={photo}
          />
        </Grid2>
      )}
    </Grid2>
  );
};
