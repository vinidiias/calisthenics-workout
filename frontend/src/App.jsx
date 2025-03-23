import { Box, createTheme } from '@mui/material';
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
    <Box className="flex flex-col h-[100%] overflow-x-hidden">
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
              <Route path="/settings" element={<div className='flex flex-1'><SidebarComponent /><Settings /></div>} />
            </Routes>
            <Footer />
          </UserProvider>
        </BrowserRouter>
      </ThemeProvider>
    </Box>
  );
}

export default App;
