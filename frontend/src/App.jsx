import { Box, createTheme, Toolbar } from '@mui/material';
import Navbar from './layouts/navbar';
import Login from './pages/login';
import Footer from './layouts/footer';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Menu from './pages/menu';
import Register from './pages/register';
import Profile from './pages/profile';
import { UserProvider } from './contexts/UserContext';
import { ThemeProvider } from '@emotion/react';
import { Settings } from './pages/settings';
import { SidebarComponent } from './components/ui/SidebarComponent'
import { useThemeColor } from './hooks/useThemeColor';

function App() {
  const { isDark } = useThemeColor()

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
        main: "#90caf9", // Exemplo de cor principal no modo escuro
      },
      button : {
        primary: 'color-mix(in oklab, var(--color-blue-800) 80%, transparent)'
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
        primary: isDark ? 'rgba(29, 33, 38, 0.4)' : '#fff',
        secondary: isDark ? 'rgb(152, 164, 179)' : 'rgba(0, 0, 0, 0.8)',
        border: isDark ? "color-mix(in oklab, var(--color-gray-600) 80%, transparent)" : "color-mix(in oklab, var(--color-gray-800) 20%, transparent)"
      },
      divider: isDark ? "#424242" : "#e0e0e0", // Cor dos divisores
    },
  });

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
              <Route path="/workouts" element={<Menu isParticipe={true} title="Workouts" />} />
              <Route path="/workouts/my-workouts" element={<Menu isParticipe={false} title="My Workouts" />} />
              <Route path="/profile/:id" element={<Profile />} />
              <Route path="/settings" element={<div className='flex flex-1'><div className='max-[961px]:hidden'><SidebarComponent /></div><Settings /></div>} />
            </Routes>
            <Footer />
          </UserProvider>
        </BrowserRouter>
      </ThemeProvider>
    </Box>
  );
}

export default App;
