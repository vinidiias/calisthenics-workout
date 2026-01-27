// MATERIAL UI
import { Box, Paper } from "@mui/material";

export const AuthContainer = ({ children }) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
      }}
    >
      <Paper>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 1,
            p: 3,
            maxWidth: 400,
            width: "100%",
            textAlign: "center",
          }}
        >
          {children}
        </Box>
      </Paper>
    </Box>
  );
};
