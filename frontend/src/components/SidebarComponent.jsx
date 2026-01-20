import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { useThemeColor } from "../hooks/useThemeColor";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import LanguageIcon from "@mui/icons-material/Language";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import { useContext } from "react";
import { WbSunny } from "@mui/icons-material";

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
