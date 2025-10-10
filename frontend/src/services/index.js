import axios from 'axios'

    //'http://localhost:5000'
    //'https://calisthenics-workout.vercel.app'

const api = axios.create({
    baseURL: 'https://calisthenics-workout.vercel.app'
})

export default api