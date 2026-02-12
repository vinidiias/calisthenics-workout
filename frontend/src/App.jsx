import { BrowserRouter, Route, Routes } from "react-router-dom";
// MATERIAL UI
import { CssBaseline } from "@mui/material";
// LAYOUT
import { Layout } from "./layouts";
// COMPONENTS PAGES
import Login from "./pages/login";
import Menu from "./pages/workouts";
import Register from "./pages/register";
import Profile from "./pages/profile";
import { Settings } from "./pages/settings";
import { ChatPage } from "./pages/chat";
// THEME PROVIDER
import { ThemeProvider } from "@emotion/react";
// CONTEXT
import { UserProvider } from "./contexts/UserContext";
// HOOKS
import { useThemeColor } from "./hooks/useThemeColor";
// AUTHORIZATION
import { withProtectedRole } from "./util/authorization";
import { themeMui } from "./util/theme";
import { AlertProvider } from "./contexts/AlertContext";

const MenuWithProtectWorkouts = withProtectedRole(Menu, "/");
const ProfileWithProtect = withProtectedRole(Profile, "/");
const SettingsWithProtect = withProtectedRole(Settings, "/");
const ChatPageWithProtect = withProtectedRole(ChatPage, "/");

function App() {
  const { isDark } = useThemeColor();

  const theme = themeMui(isDark);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <UserProvider>
          <AlertProvider>
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
          </AlertProvider>
        </UserProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
