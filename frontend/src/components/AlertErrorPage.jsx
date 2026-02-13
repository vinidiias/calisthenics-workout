import { Box, Container, Typography } from "@mui/material";

export const AlertErrorPage = ({ message }) => {
  return (
    <Container
      maxWidth={false}
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: 2,
        width: { xs: "100%", sm: "90%" },
      }}
      disableGutters
    >
      <Box display="flex" flexDirection="column">
        <Typography color="error">
          An error occurred while loading the data
        </Typography>
        <Typography color="error">[REASON]: {message}</Typography>
      </Box>
    </Container>
  );
};