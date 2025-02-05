import { Box } from '@mui/material';
import tailwind from '../src/output.css'
import Navbar from './layouts/navbar';
import Example from './layouts/navbar';
import Login from './pages/login';

function App() {
  return (
    <Box
      className="flex flex-col h-[100%]"
    >
      <Navbar />
      <Login />
    </Box>
  );
}

export default App;
