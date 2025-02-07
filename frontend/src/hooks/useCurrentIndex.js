import { useLocation } from "react-router-dom";

const paths = [
    { path: '/workouts' },
    { path: '/workouts/my-workouts' },
]


export const useCurrentIndex = () => {
    const location = useLocation();
    
    const index = paths.findIndex((path) => path.path === location.pathname)

    return index !== - 1 ? index : 0
}