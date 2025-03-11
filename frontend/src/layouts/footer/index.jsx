import FacebookIcon from '@mui/icons-material/Facebook';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';

const Footer = () => {
    return (
        <footer className="bg-gray-800 text-white py-2 flex  items-center justify-center gap-5 z-1500">
            <p>&copy; 2025. All right reserved.</p>
            <ul className="flex items-center gap-2">
                <li className="text-white cursor-pointer  hover:scale-110  transition-all  duration-500"><FacebookIcon  /></li>
                <li className="text-white cursor-pointer  hover:scale-110  transition-all  duration-500"><LinkedInIcon  /></li>
                <li className="text-white cursor-pointer  hover:scale-110  transition-all  duration-500"><InstagramIcon  /></li>
            </ul>
        </footer>
    )
}

export default Footer