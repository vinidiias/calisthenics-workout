import axios from 'axios'

    //'http://localhost:5000'
    //'https://calisthenics-workout.vercel.app'

const api = axios.create({
    baseURL: 'http://localhost:5000'
})

export default api