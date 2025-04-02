import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { Box, Toolbar } from "@mui/material";
import { useThemeColor } from "../../hooks/useThemeColor";
import DarkModeIcon from '@mui/icons-material/DarkMode';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import LanguageIcon from '@mui/icons-material/Language';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext";
import { useContext } from "react";

export const SidebarComponent = () => {
  const drawerWidth = 240;
  const navigate = useNavigate()
  const { isDark } = useThemeColor()
  const { user } = useContext(UserContext)

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: "border-box",
          backgroundColor: isDark ? "#202124" : "",
          borderColor: isDark
            ? "color-mix(in oklab, var(--color-gray-600) 50%, transparent)"
            : "",
        },
        [`& .MuiDivider-root`]: {
          borderColor: isDark
            ? "color-mix(in oklab, var(--color-gray-800) 50%, transparent)"
            : "",
        },
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: "auto" }}>
        <List>
          {[
            { text: "Profile", icon: <AccountBoxIcon />, handleClick: () => navigate(`/profile/${user._id}`) },
            { text: "Settings", icon: <SettingsIcon />, handleClick: () => navigate("/settings") },
            { text: "Dark Mode", icon: <DarkModeIcon /> },
            { text: "Language", icon: <LanguageIcon /> },
            { text: "Notifications", icon: <NotificationsIcon /> },
          ].map((itemList) => (
            <ListItem key={itemList.text} >
              <ListItemButton onClick={itemList.handleClick}>
                <ListItemIcon>{itemList.icon}</ListItemIcon>
                <ListItemText primary={itemList.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};
