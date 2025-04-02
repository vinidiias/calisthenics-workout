import FacebookIcon from '@mui/icons-material/Facebook';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';
import { Link } from 'react-router-dom';
import { useThemeColor } from '../../hooks/useThemeColor';
import { IconLogo } from '../../components/logo/logo_org';

const Footer = () => {
    const { isDark } = useThemeColor()

    return (
      <footer style={{ backgroundColor: isDark ? "#202124" : "#fff", color: isDark ? 'rgb(152, 164, 179)' : '#121212'}} className="py-2 flex  items-center justify-center gap-5 z-1500">
        <p>&copy; 2025. All right reserved.</p>
        <ul className="flex items-center gap-2">
          <li className="cursor-pointer  hover:scale-110  transition-all  duration-500">
            <Link to='https://www.facebook.com/vinicius.dias.9216778?locale=pt_BR' target='_blank'>
                <FacebookIcon />
            </Link>
          </li>
          <li className="cursor-pointer  hover:scale-110  transition-all  duration-500">
            <Link to='https://www.linkedin.com/in/vinicius-diass/' target='_blank'>
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