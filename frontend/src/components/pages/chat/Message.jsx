import { Avatar, Grid2, Paper, Typography, useTheme } from "@mui/material";

export const Message = ({ msg, isMyMessage, selectedContact, photo }) => {
  const theme = useTheme();

  return (
    <Grid2
      key={msg.id}
      container
      spacing={1}
      sx={{
        justifyContent: isMyMessage ? "flex-end" : "flex-start",
        marginBottom: 1,
      }}
    >
      {!isMyMessage && (
        <Grid2>
          <Avatar src={selectedContact.photo} />
        </Grid2>
      )}
      <Grid2>
        <Paper
          sx={{
            width: "max-content",
            maxWidth: "400px",
            padding: 1,
            paddingY: 0.5,
            backgroundColor: isMyMessage
              ? theme.palette.primary.main
              : theme.palette.background.default,
            color: isMyMessage
              ? theme.palette.primary.contrastText
              : theme.palette.text.primary,
          }}
        >
          <Typography>{msg.content}</Typography>
          <Typography
            variant="caption"
            sx={{ fontSize: "0.65rem", opacity: 0.7 }}
          >
            {new Date(msg.timestamp).toLocaleTimeString("pt-BR", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Typography>
        </Paper>
      </Grid2>
      {isMyMessage && (
        <Grid2>
          <Avatar src={photo} />
        </Grid2>
      )}
    </Grid2>
  );
};
