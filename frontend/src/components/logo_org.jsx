import logoCW from '../assets/logoCW.png'
import logoCWWhite from "../assets/logoCW-White.png";
import { useThemeColor } from '../hooks/useThemeColor';

export const IconLogo = () => {
    const { isDark } = useThemeColor()

    return <img src={isDark ? logoCWWhite : logoCW} className="object-fill" />;
}