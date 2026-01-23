
// HOOKS
import { useThemeColor } from '../hooks/useThemeColor';
// LOGOS
import logoCW from '../assets/logoCW.png'
import logoCWWhite from "../assets/logoCW-White.png";

export const IconLogo = () => {
    const { isDark } = useThemeColor()

    return <img src={isDark ? logoCWWhite : logoCW} className="object-fill" />;
}