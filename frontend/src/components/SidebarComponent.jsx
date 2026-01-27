import { useContext } from "react";
import { useNavigate } from "react-router-dom";
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
import { WbSunny } from "@mui/icons-material";
// CONTEXT
import { UserContext } from "../contexts/UserContext";

export const SidebarComponent = () => {
  const drawerWidth = 240;
  const { isDark, handleClick } = useThemeColor();
  const { user } = useContext(UserContext);

  const navigate = useNavigate();

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
        {[
          {
            text: "Profile",
            icon: <AccountBoxIcon />,
            handleClick: () => navigate(`/profile/${user._id}`),
          },
          {
            text: "Dark Mode",
            icon: isDark ? <DarkModeIcon /> : <WbSunny />,
            handleClick,
          },
          { text: "Language", icon: <LanguageIcon /> },
        ].map((itemList) => (
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
