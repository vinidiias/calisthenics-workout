// MATERIAL UI
import { Alert, AlertTitle, Snackbar } from "@mui/material"

export const CustomAlert = ({ severity, message, open, autoHide, onClose }) => {
    return (
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={open}
        autoHideDuration={autoHide ? 4000 : undefined}
        onClose={onClose}
      >
        <Alert
          onClose={onClose}
          severity={severity}
          sx={{ width: "100%", maxWidth: { xs: 400, lg: 475 } }}
        >
          <AlertTitle>{severity.toUpperCase()}</AlertTitle>
          {message}
        </Alert>
      </Snackbar>
    );
}