import { Box, createTheme, CssBaseline, Toolbar } from "@mui/material";
import Login from "./pages/login";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Menu from "./pages/workouts";
import Register from "./pages/register";
import Profile from "./pages/profile";
import { UserContext, UserProvider } from "./contexts/UserContext";
import { ThemeProvider } from "@emotion/react";
import { Settings } from "./pages/settings";
import { SidebarComponent } from "./components/SidebarComponent";
import { useThemeColor } from "./hooks/useThemeColor";
import { ChatPage } from "./pages/chat";
import { useContext, useEffect, useMemo, useState } from "react";
import { socket } from "./services/socket";
import { Layout } from "./layouts";

const withProtectedRole = (ComponentToProtect, redirectPath = "/") => {
  return function NewComponent(props) {
    const [, setIsConnected] = useState(socket.connected);
    const [friendOnline, setFriendsOnline] = useState([]);
    const [fooEvents, setFooEvents] = useState([]);

    const { user } = useContext(UserContext);

    useEffect(() => {
      if (!user.isLogged || !user._id) {
        return;
      }

      socket.emit("authenticate", user._id);
    }, [user._id, user.isLogged, user]);

    useEffect(() => {
      function onActiveUsers(activeUsers) {
        setFriendsOnline(activeUsers);
      }

      function onDisconnect() {
        setIsConnected(false);
        setFriendsOnline(new Set());
      }

      function onFooEvents(value) {
        setFooEvents((prev) => [...prev, value]);
      }

      socket.on("disconnect", onDisconnect);
      socket.on("active-users", onActiveUsers);
      socket.on("foo", onFooEvents);

      return () => {
        socket.off("active-users", onActiveUsers);
        socket.off("foo", onFooEvents);
      };
    }, [fooEvents, user._id, user.isLogged]);

    if (!user.isLogged) {
      return <Navigate to={redirectPath} />;
    }

    return <ComponentToProtect {...props} activeFriends={friendOnline} userId={user._id} />;
  }
};

function SettingsPage () {
  return (
    <Box display="flex" flex={1}>
      <div className="max-[961px]:hidden">
        <SidebarComponent />
      </div>
      <Settings />
    </Box>
  );
}

const MenuWithProtectWorkouts = withProtectedRole(Menu, "/");
const ProfileWithProtect = withProtectedRole(Profile, "/");
const SettingsWithProtect = withProtectedRole(SettingsPage, "/");
const ChatPageWithProtect = withProtectedRole(ChatPage, "/");

function App() {
  const { isDark } = useThemeColor();

  const theme = useMemo(
    () =>
      createTheme({
        typography: {
          fontFamily: `"IBM Plex Sans"`,
          fontSize: 14,
          fontWeightLight: 300,
          fontWeightRegular: 400,
          fontWeightMedium: 500,
        },
        palette: {
          mode: isDark ? "dark" : "light",
          primary: {
            dark: isDark ? "#202124" : "#fff",
            light: isDark ? "#fff" : "#202124",
            main: "rgb(152, 164, 179)",
            contrastText: isDark ? "#000" : "#fff",
          },
          button: {
            primary: isDark ? "#f2f2f2" : "#202124",
          },
          secondary: {
            main: "#f48fb1",
          },
          background: {
            default: isDark ? "#202124" : "#f2f2f2",
            paper: isDark ? "#202124" : "#f8f8f8",
          },
          text: {
            primary: isDark ? "#fff" : "#121212",
            contrastText: isDark ? "#121212" : "#fff",
          },
          input: {
            primary: isDark ? "rgba(29, 33, 38, 0.4)" : "#f2f2f2",
            secondary: isDark
              ? "rgba(152, 164, 179, 0.69)"
              : "rgba(0, 0, 0, 0.8)",
            border: isDark
              ? "color-mix(in oklab, var(--color-gray-600) 80%, transparent)"
              : "color-mix(in oklab, var(--color-gray-800) 20%, transparent)",
          },
          divider: isDark ? "#4242424f" : "#97979731",
        },
        components: {
          MuiSelect: {
            styleOverrides: {
              select: {
                color: isDark
                  ? "rgba(152, 164, 179, 0.69)"
                  : "rgba(0, 0, 0, 0.8)",
              },
            },
          },
          MuiButton: {
            defaultProps: {
              variant: "contained",
              disableElevation: true,
            },
            styleOverrides: {
              root: {
                textTransform: "none",
                fontWeight: 500,
              },
              contained: {
                background: isDark ? "#E5E5E5" : "#202124",
                color: isDark ? "#202124" : "#E5E5E5",
                "&:hover": {
                  background: isDark ? "#bbbbbbff" : "#303135ff",
                  boxShadow: "none",
                },
              },
            },
          },
          MuiTypography: {
            styleOverrides: {
              body1: {
                color: isDark ? "#f2f2f2" : "#202124",
                fontSize: ".9rem",
              },
              body2: {
                color: isDark ? "#d6d6d6ff" : "gray",
                fontSize: ".85rem",
              },
            },
          },
          MuiContainer: {
            styleOverrides: {
              root: {
                backgroundColor: isDark ? "#202124" : "#fff",
              },
              disableGutters: true,
            },
          },
          MuiTextField: {
            styleOverrides: {
              root: {
                [".MuiOutlinedInput-root"]: {
                  color: isDark ? "rgb(152, 164, 179)" : "#757575",
                },
                [".MuiFormLabel-root"]: {
                  color: isDark ? "rgb(152, 164, 179)" : "#757575",
                },
              },
            },
          },
          MuiInputLabel: {
            styleOverrides: {
              root: {
                color: isDark ? "rgb(152, 164, 179)" : "#757575",
              },
            },
          },
          MuiDialog: {
            styleOverrides: {
              root: {
                [".MuiPaper-root"]: {
                  backgroundColor: isDark ? "#000000ff" : "#f2f2f2"
                },
              },
            },
          },
          MuiCssBaseline: {
            styleOverrides: {
              "*": {
                boxSizing: "border-box",
                margin: 0,
                padding: 0,
              },
              html: {
                MozOsxFontSmoothing: "grayscale",
                WebkitFontSmoothing: "antialiased",
                display: "flex",
                flexDirection: "column",
                minHeight: "100%",
                width: "100%",
              },
              body: {
                display: "flex",
                flex: "1 1 auto",
                flexDirection: "column",
                minHeight: "100%",
                width: "100%",
              },
              "#root": {
                minHeight: "100vh",
              },
            },
          },
        },
      }),
    [isDark]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <UserProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/workouts"
                element={
                  <MenuWithProtectWorkouts
                    isParticipe={true}
                    title="Workouts"
                  />
                }
              />
              <Route
                path="/workouts/my-workouts"
                element={
                  <MenuWithProtectWorkouts
                    isParticipe={false}
                    title="My Workouts"
                  />
                }
              />
              <Route path="/profile/:id" element={<ProfileWithProtect />} />
              <Route path="/settings" element={<SettingsWithProtect />} />
              <Route path="/chat-friends" element={<ChatPageWithProtect />} />
            </Routes>
          </Layout>
        </UserProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
