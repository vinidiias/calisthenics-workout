import { useLocation } from "react-router-dom";
// MATERIAL UI
import { Box, Toolbar } from "@mui/material";
import Footer from "./footer";
import { Navbar } from "./navbar";
import { SidebarComponent } from "./SidebarComponent";

export const Layout = ({ children }) => {
  const location = useLocation();
  const hasHeader =
    location.pathname !== "/" && location.pathname !== "/register";

  const hasSidebar = hasHeader;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        width: "100%",
      }}
    >
      {hasHeader && (
        <>
          <Navbar />
          <Toolbar />
        </>
      )}
      <Box sx={{ display: "flex", flexGrow: 1, width: "100%" }}>
        <Box sx={{ display: { xs: "none", md: "block" } }}>
          {hasSidebar && <SidebarComponent />}
        </Box>
        {children}
      </Box>
      {/* <Footer /> */}
    </Box>
  );
};
