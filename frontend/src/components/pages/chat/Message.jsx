// MATERIAL UI
import { Avatar, Box, Grid2, Paper, Typography, useTheme } from "@mui/material";

export const Message = ({ msg, isMyMessage, selectedContact, photo, name }) => {
  const theme = useTheme();

  return (
    <Grid2
      key={msg.id}
      container
      spacing={1}
      justifyContent={isMyMessage ? "flex-end" : "flex-start"}
      alignItems="center"
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
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            backgroundColor: "background.chat",
            borderRadius: 1,
            px: 1.5,
            py: 0.5,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {isMyMessage ? (
              <Typography
                sx={{
                  fontSize: { xs: "0.55rem", sm: ".65rem" },
                  color: theme.palette.text.secondary,
                  fontWeigh: 300,
                }}
              >
                {new Date(msg.timestamp)
                  .toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                  .toLocaleLowerCase()}
              </Typography>
            ) : (
              <Typography
                sx={{
                  fontSize: { xs: "0.55rem", sm: "0.8rem" },
                  color: theme.palette.text.primary,
                  fontWeigh: 300,
                }}
              >
                {name ?? ""}
              </Typography>
            )}
            {isMyMessage ? (
              <Typography
                sx={{
                  fontSize: { xs: "0.55rem", sm: ".8rem" },
                  color: theme.palette.text.primary,
                  fontWeigh: 300,
                }}
              >
                {name ?? ""}
              </Typography>
            ) : (
              <Typography
                sx={{
                  fontSize: { xs: "0.55rem", sm: ".65rem" },
                  color: theme.palette.text.secondary,
                  fontWeigh: 300,
                }}
              >
                {new Date(msg.timestamp)
                  .toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                  .toLocaleLowerCase()}
              </Typography>
            )}
          </Box>
          <Typography
            textAlign={isMyMessage ? "end" : "start"}
            sx={{
              fontSize: {
                xs: "0.7rem",
                sm: ".8rem",
                color: theme.palette.text.primary,
                fontWeight: "200",
              },
            }}
          >
            {msg.content}
          </Typography>
        </Box>
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
