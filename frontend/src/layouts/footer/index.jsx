import FacebookIcon from '@mui/icons-material/Facebook';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';
import { Link } from 'react-router-dom';
import { useTheme } from '@mui/material';

const Footer = () => {
    const theme = useTheme();

    return (
      <footer
        style={{
          backgroundColor: theme.palette.background.default,
          color: theme.palette.text.primary,
        }}
        className="py-2 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-5"
      >
        <p>&copy; 2025. All right reserved.</p>
        <ul className="flex items-center gap-2">
          <li className="cursor-pointer  hover:scale-110  transition-all  duration-500">
            <Link
              to="https://www.facebook.com/vinicius.dias.9216778?locale=pt_BR"
              target="_blank"
            >
              <FacebookIcon />
            </Link>
          </li>
          <li className="cursor-pointer  hover:scale-110  transition-all  duration-500">
            <Link
              to="https://www.linkedin.com/in/vinicius-diass/"
              target="_blank"
            >
              <LinkedInIcon />
            </Link>
          </li>
          <li className="cursor-pointer  hover:scale-110  transition-all  duration-500">
            <Link
              to="https://www.instagram.com/viniciusdiias_/"
              target="_blank"
            >
              <InstagramIcon />
            </Link>
          </li>
        </ul>
      </footer>
    );
}

export default Footer