import { useQuery } from "@tanstack/react-query"
import api from "../services"

const fetchAddress = async(url) => {
    const { data } = await api.get(url)

    return data
}

export const useFetchAddress = (key, url, options={}) => {
    return useQuery({
        queryKey: [key],
        queryFn: () => fetchAddress(url),
        ...options
    })
}