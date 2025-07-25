import { Box, createTheme, Toolbar } from "@mui/material";
import Navbar from "./layouts/navbar";
import Login from "./pages/login";
import Footer from "./layouts/footer";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Menu from "./pages/menu";
import Register from "./pages/register";
import Profile from "./pages/profile";
import { UserContext, UserProvider } from "./contexts/UserContext";
import { ThemeProvider } from "@emotion/react";
import { Settings } from "./pages/settings";
import { SidebarComponent } from "./components/ui/SidebarComponent";
import { useThemeColor } from "./hooks/useThemeColor";
import { Chat } from "./components/chat/Chat";
import { ChatPage } from "./pages/chat";
import { Component, useContext, useEffect, useState } from "react";
import { socket } from "./services/socket";

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
        console.log("Desconectado do servidor de chat.");
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

function App() {
  const { isDark } = useThemeColor();

  const theme = createTheme({
    typography: {
      fontFamily: `"IBM Plex Sans"`,
      fontSize: 14,
      fontWeightLight: 300,
      fontWeightRegular: 400,
      fontWeightMedium: 500,
    },
    palette: {
      mode: isDark ? "dark" : "light", // Defina o modo como 'dark' aqui para aplicar o tema escuro
      primary: {
        dark: isDark ? "#202124" : "#fff",
        light: isDark ? "#fff" : "#202124",
        main: "rgb(152, 164, 179)",
        contrastText: isDark ? "#000" : "#fff",
      },
      button: {
        primary: "color-mix(in oklab, var(--color-blue-800) 80%, transparent)",
      },
      secondary: {
        main: "#f48fb1", // Exemplo de cor secundária
      },
      background: {
        default: isDark ? "#202124" : "#fff", // Cor de fundo
        paper: isDark ? "#202124" : "#fff", // Cor de fundo de componentes
      },
      text: {
        primary: isDark ? "#fff" : "#121212", // Cor do texto
        secondary: isDark ? "rgb(152, 164, 179)" : "#757575", // Cor do texto secundário
      },
      input: {
        primary: isDark ? "rgba(29, 33, 38, 0.4)" : "#fff",
        secondary: isDark ? "rgb(152, 164, 179)" : "rgba(0, 0, 0, 0.8)",
        border: isDark
          ? "color-mix(in oklab, var(--color-gray-600) 80%, transparent)"
          : "color-mix(in oklab, var(--color-gray-800) 20%, transparent)",
      },
      divider: isDark ? "#4242424f" : "#97979731", // Cor dos divisores
    },
  });

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
  const ChatWithProtect = withProtectedRole(Chat, "/");
  const ChatPageWithProtect = withProtectedRole(ChatPage, "/");

  return (
    <Box className="flex flex-col h-[100%] overflow-x-hidden">
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <UserProvider>
            <Navbar />
            <Toolbar />
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/workouts"
                element={<MenuWithProtectWorkouts isParticipe={true} title="Workouts" />}
              />
              <Route
                path="/workouts/my-workouts"
                element={<MenuWithProtectWorkouts isParticipe={false} title="My Workouts" />}
              />
              <Route path="/profile/:id" element={<ProfileWithProtect />} />
              <Route path="/settings" element={<SettingsWithProtect />} />
              <Route path="/chat" element={<ChatWithProtect />} />
              <Route path="/chat-friends" element={<ChatPageWithProtect />} />
            </Routes>
            <Footer />
          </UserProvider>
        </BrowserRouter>
      </ThemeProvider>
    </Box>
  );
}

export default App;
