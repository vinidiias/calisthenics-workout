import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import { Box, Toolbar } from "@mui/material";
import { useThemeColor } from "../../hooks/useThemeColor";

export const SidebarComponent = () => {
  const drawerWidth = 240;
  const { isDark } = useThemeColor()

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
          borderColor: isDark ? "color-mix(in oklab, var(--color-gray-600) 50%, transparent)" : "",
        },
        [`& .MuiDivider-root`]: {
          borderColor: isDark ? "color-mix(in oklab, var(--color-gray-800) 50%, transparent)" : "",
        }
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: "auto" }}>
        <Typography
          marginLeft="1em"
          marginTop={2}
          fontWeight="regular"
          variant="body1"
        >
          Profile
        </Typography>
        <List>
          {["Profile", "Language", "Dark Mode", "Notifications"].map((text, index) => (
            <ListItem key={text} disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};
