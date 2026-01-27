import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
// MATERIAL UI
import {
  IconButton,
  AppBar,
  Toolbar,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  Menu,
  MenuItem,
  Avatar,
  Button,
  useTheme,
  Stack,
} from "@mui/material";
// COMPONENTS
import SwitchThemeButton from "../../components/SwitchTheme";
import { IconLogo } from "../../components/logo_org";
// HOOKS
import { useCurrentIndex } from "../../hooks/useCurrentIndex";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
// CONTEXTS
import { UserContext } from "../../contexts/UserContext";
// ICONS
import { MessageSharp } from "@mui/icons-material";

const navigation = [
  { name: "Workouts", href: "/workouts" },
  { name: "My Workouts", href: "/workouts/my-workouts" },
];

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const { user, setUser } = useContext(UserContext);
  const theme = useTheme();
  const current = useCurrentIndex();
  const navigate = useNavigate();
  const profileMenuOpen = Boolean(anchorEl);

  const handleProfileMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <AppBar
      position="fixed"
      sx={(theme) => {
        return {
          background: theme.palette.background.default,
          color: theme.palette.text.secondary,
        };
      }}
    >
      <Toolbar sx={{ mx: "auto", maxWidth: 2000, width: "100%", px: { xs: 1, sm: 3, lg: 4 } }}>
        <Box sx={{ position: "absolute", top: 0, bottom: 0, left: 0, display: { xs: "flex", sm: "none" }, alignItems: "center" }}>
          {user.isLogged && (
            <IconButton
              onClick={toggleMobileMenu}
              sx={{
                position: "relative",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 1,
                p: 1,
                color: "grey.500",
                "&:hover": { bgcolor: "grey.800", color: "white" },
                "&:focus": { outline: "none", boxShadow: "inset 0 0 0 2px white" },
              }}
            >
              {mobileMenuOpen ? (
                <XMarkIcon aria-hidden="true" style={{ width: 24, height: 24 }} />
              ) : (
                <Bars3Icon aria-hidden="true" style={{ width: 24, height: 24 }} />
              )}
            </IconButton>
          )}
        </Box>
        <Box sx={{ display: "flex", flex: 1, alignItems: "center", justifyContent: { xs: "center", sm: "flex-start" }, gap: 2.5 }}>
          <Box sx={{ display: { xs: "none", sm: "flex" }, flexShrink: 0, alignItems: "center" }}>
            <a href="/workouts">
              <IconLogo />
            </a>
          </Box>
          {user.isLogged && (
            <Stack
              direction="row"
              spacing={2}
              flex={1}
              maxWidth={250}
              sx={{ display: { xs: "none", sm: "flex" } }}
            >
              {navigation.map((item, index) => (
                <Button
                  key={item.name}
                  fullWidth
                  size="medium"
                  onClick={() => navigate(item.href)}
                  sx={{
                    backgroundColor:
                      index === current
                        ? theme.palette.action.selected
                        : theme.palette.action.selectedOpacity,
                    color: theme.palette.primary.light,
                  }}
                >
                  {item.name}
                </Button>
              ))}
            </Stack>
          )}
        </Box>
        <Box sx={{ position: { xs: "absolute", sm: "static" }, top: 0, bottom: 0, right: 0, display: "flex", alignItems: "center", pr: 1 }}>
          <SwitchThemeButton />
          {user.isLogged && (
            <IconButton onClick={() => navigate("/chat-friends")}>
              <MessageSharp />
            </IconButton>
          )}
          {/* Profile dropdown */}
          {user.isLogged && (
            <Box>
              <IconButton
                onClick={handleProfileMenuClick}
                sx={{
                  position: "relative",
                  display: "flex",
                  borderRadius: "50%",
                  bgcolor: "grey.800",
                  fontSize: "0.875rem",
                  "&:focus": { outline: "none", boxShadow: "0 0 0 2px #1f2937, 0 0 0 4px white" },
                }}
              >
                <Avatar
                  alt=""
                  src={user.photo}
                  sx={{ width: 32, height: 32 }}
                />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={profileMenuOpen}
                onClose={handleProfileMenuClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                slotProps={{
                  paper: {
                    sx: {
                      mt: 1,
                      minWidth: 192,
                    },
                  },
                }}
              >
                <MenuItem
                  onClick={handleProfileMenuClose}
                  component="a"
                  href={`/profile/${user._id}`}
                >
                  Your Profile
                </MenuItem>
                <MenuItem
                  onClick={handleProfileMenuClose}
                  component="a"
                  href="/settings"
                >
                  Settings
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    handleProfileMenuClose();
                    setUser({});
                  }}
                  component="a"
                  href="/"
                >
                  Sign out
                </MenuItem>
              </Menu>
            </Box>
          )}
        </Box>
      </Toolbar>
      {/* Mobile menu drawer */}
      <Drawer
        anchor="left"
        open={mobileMenuOpen}
        onClose={toggleMobileMenu}
        sx={{
          display: { xs: "block", sm: "none" },
        }}
      >
        <Box sx={{ width: 250, mt: "50px" }} role="presentation">
          <List sx={{ "& > *:not(:first-of-type)": { mt: 0.5 }, px: 1, pt: 1, pb: 1.5 }}>
            {navigation.map((item, index) => (
              <ListItem key={item.name} disablePadding>
                <ListItemButton
                  component="a"
                  href={item.href}
                  onClick={toggleMobileMenu}
                  aria-current={index === current ? "page" : undefined}
                  sx={{
                    backgroundColor:
                      index === current
                        ? theme.palette.action.selected
                        : theme.palette.action.selectedOpacity,
                    color:
                      index === current
                        ? theme.palette.primary.light
                        : theme.palette.primary.light,
                  }}
                >
                  {item.name}
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </AppBar>
  );
};
