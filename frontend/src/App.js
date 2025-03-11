import { Box } from '@mui/material';
import tailwind from './output.css'
import Navbar from './layouts/navbar';
import Example from './layouts/navbar';
import Login from './pages/login';
import { atom } from 'jotai';
import Footer from './layouts/footer';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Menu from './pages/menu';
import Register from './pages/register';
import { UserProvider } from './contexts/UserContext';

export const useTheme = atom('bg-gray-50')

function App() {

  return (
    <Box className="flex flex-col h-[100%]">
      <BrowserRouter>
        <UserProvider>
          <Navbar />
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/workouts" element={<Menu isParticipe={true} title="Workouts" />} />
            <Route path="/workouts/my-workouts" element={<Menu isParticipe={false} title="My Workouts" />} />
          </Routes>
          <Footer />
        </UserProvider>
      </BrowserRouter>
    </Box>
  );
}

export default App;
