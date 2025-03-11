import { Box, createTheme } from '@mui/material';
import tailwind from './output.css'
import Navbar from './layouts/navbar';
import Example from './layouts/navbar';
import Login from './pages/login';
import { atom } from 'jotai';
import Footer from './layouts/footer';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Menu from './pages/menu';
import Register from './pages/register';
import Profile from './pages/profile';
import { UserProvider } from './contexts/UserContext';
import { ThemeProvider } from '@emotion/react';
import { Settings } from './pages/settings';

export const useTheme = atom('bg-gray-50')

function App() {

  const theme = createTheme({
    typography: {
      "fontFamily": `"IBM Plex Sans"`,
      "fontSize": 14,
      "fontWeightLight": 300,
      "fontWeightRegular": 400,
      "fontWeightMedium": 500
     }
  })

  return (
    <Box className="flex flex-col h-[100%]">
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <UserProvider>
            <Navbar />
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/workouts" element={<Menu isParticipe={true} title="Workouts" />} />
              <Route path="/workouts/my-workouts" element={<Menu isParticipe={false} title="My Workouts" />} />
              <Route path="/profile/:id" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
            <Footer />
          </UserProvider>
        </BrowserRouter>
      </ThemeProvider>
    </Box>
  );
}

export default App;
