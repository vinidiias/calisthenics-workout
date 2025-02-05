import FacebookIcon from '@mui/icons-material/Facebook';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';
import { Link } from '@mui/material';

const Footer = () => {
    return (
        <nav className="bg-gray-800 text-white py-4 flex flex-col items-center justify-center gap-2">
            <ul className="flex items-center gap-2">
                <li className="text-white cursor-pointer  hover:scale-110  transition-all  duration-500"><FacebookIcon  /></li>
                <li className="text-white cursor-pointer  hover:scale-110  transition-all  duration-500"><LinkedInIcon  /></li>
                <li className="text-white cursor-pointer  hover:scale-110  transition-all  duration-500"><InstagramIcon  /></li>
            </ul>
            <p>&copy;2025. All right reserved.</p>
        </nav>
    )
}

export default Footer