import axios from 'axios'

const api = axios.create({
    baseURL: 'https://calisthenics-workout.vercel.app'
})

export default api