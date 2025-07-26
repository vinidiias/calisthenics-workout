import api from "../services";

export const createWorkout = async ({ workout, auth }) => {
  const { data } = await api.post('/workout/create', workout, {
    headers: { auth: auth}
  })

  return data
}