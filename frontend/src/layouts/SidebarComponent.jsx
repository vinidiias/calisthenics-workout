import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useMemo } from "react";
// MATERIAL UI
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
// HOOKS
import { useThemeColor } from "../hooks/useThemeColor";
// ICONS
import DarkModeIcon from "@mui/icons-material/DarkMode";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import LanguageIcon from "@mui/icons-material/Language";
import { Settings, WbSunny } from "@mui/icons-material";
// CONTEXT
import { UserContext } from "../contexts/UserContext";

export const SidebarComponent = () => {
  const drawerWidth = 240;
  const { isDark, handleClick } = useThemeColor();
  const { user } = useContext(UserContext);

  const navigate = useNavigate();

  const items = useMemo(
    () => [
      {
        text: "Profile",
        icon: <AccountBoxIcon />,
        handleClick: () => navigate(`/profile/${user._id}`),
      },
      {
        text: "Settings",
        icon: <Settings />,
        handleClick: () => navigate("/settings"),
      },
      {
        text: "Dark Mode",
        icon: isDark ? <DarkModeIcon /> : <WbSunny />,
        handleClick,
      },
      { text: "Language", icon: <LanguageIcon /> },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isDark],
  );

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        [`& .MuiDrawer-paper`]: {
          marginTop: "56px",
          zIndex: 0,
          width: drawerWidth,
        },
      }}
    >
      <List>
        {items.map((itemList) => (
          <ListItem key={itemList.text}>
            <ListItemButton onClick={itemList.handleClick}>
              <ListItemIcon>{itemList.icon}</ListItemIcon>
              <ListItemText primary={itemList.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};
