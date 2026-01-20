import { Box, Toolbar } from "@mui/material";
import { useLocation } from "react-router-dom";
import Footer from "./footer";
import { Navbar } from "./navbar";

export const Layout = ({ children }) => {
  const location = useLocation();
  const hasHeader = location.pathname !== "/" && location.pathname !== "/register";

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh", width: "100%" }}>
      {hasHeader && (
        <>
          <Navbar />
          <Toolbar />
        </>
      )}
      <Box sx={{ display: "flex", flexGrow: 1, width: "100%" }}>{children}</Box>
      <Footer />
    </Box>
  );
};
