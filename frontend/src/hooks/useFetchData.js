import { useQuery } from "@tanstack/react-query"
import api from "../services"

const fetchData = async(url, auth) => {
    const { data } = await api.get(url, auth ? { headers: { auth } } : {});
    return data.data;
}

export const useFetchData = (key, url, options={}, auth) => {
    return useQuery({
      queryKey: Array.isArray(key) ? key : [key],
      queryFn: () => fetchData(url, auth),
      ...options,
    });
}