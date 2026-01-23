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
      <Toolbar className="mx-auto max-w-[2000px] w-full px-2 sm:px-6 lg:px-8">
        <Box className="absolute inset-y-0 left-0 flex items-center sm:hidden">
          {user.isLogged && (
            <IconButton
              onClick={toggleMobileMenu}
              className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:ring-2 focus:ring-white focus:outline-hidden focus:ring-inset"
            >
              {mobileMenuOpen ? (
                <XMarkIcon aria-hidden="true" className="size-6" />
              ) : (
                <Bars3Icon aria-hidden="true" className="size-6" />
              )}
            </IconButton>
          )}
        </Box>
        <Box className="flex flex-1 items-center justify-center sm:justify-start gap-5">
          <Box className="hidden sm:flex shrink-0 items-center">
            <a href="/workouts" className="w-13">
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
        <Box className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static">
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
                className="relative flex rounded-full bg-gray-800 text-sm focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden"
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
          <List className="space-y-1 px-2 pt-2 pb-3">
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
