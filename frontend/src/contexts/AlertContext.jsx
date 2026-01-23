import { createContext, useState } from "react";
// COMPONENTS
import { CustomAlert } from "../components/ui/CustomAlert";

// eslint-disable-next-line react-refresh/only-export-components
export const AlertContext = createContext();

export function AlertProvider({ children }) {
  const [open, setOpen] = useState(false);
  const [autoHide, setAutoHide] = useState(false);
  const [severity, setSeverity] = useState("success");
  const [message, setMessage] = useState("");

  function showAlet({ typeSeverity, message, isAutoHide }) {
    if (typeSeverity) {
      setSeverity(typeSeverity);
    }

    setMessage(message);
    checkAutoHide(isAutoHide);

    setOpen(true);
  }

  function dismissAlert() {
    if (open) setOpen(false);
  }

  function checkAutoHide(isAutoHide) {
    if (isAutoHide == false) {
      setAutoHide(false);
    } else {
      setAutoHide(true);
    }
  }

  function handleClose(event, reason) {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  }

  return (
    <AlertContext.Provider value={{ showAlet, dismissAlert }}>
      {children}
      <CustomAlert
        severity={severity}
        message={message}
        autoHide={autoHide}
        open={open}
        onClose={handleClose}
      />
    </AlertContext.Provider>
  );
}
