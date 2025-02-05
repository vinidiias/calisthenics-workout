import { Box } from '@mui/material';
import tailwind from '../src/output.css'
import Navbar from './layouts/navbar';
import Example from './layouts/navbar';
import Login from './pages/login';
import { atom } from 'jotai';
import Footer from './layouts/footer';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Menu from './pages/menu';

export const useTheme = atom('bg-[#D0D1D5]')

function App() {

  return (
    <Box className="flex flex-col h-[100%]">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/menu" element={<Menu />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </Box>
  );
}

export default App;
