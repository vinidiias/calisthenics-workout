import api from ".";

export const createWorkout = async ({ workout, auth }) => {
  const { data } = await api.post("/workouts", workout, {
    headers: { auth: auth },
  });

  return data.data;
};

export async function patchWorkout({ workoutId, workout, auth }) {
  const { data } = await api.patch(`/workouts/${workoutId}`, workout, {
    headers: { auth },
  });

  return data.data;
}

export async function subscribeToWorkout({ auth, workoutId }) {
  const { data } = await api.post(
    `/workouts/${workoutId}/subscriptions`,
    {},
    { headers: { auth } },
  );

  return data.data;
};

export async function unsubscribeToWorkout({ auth, workoutId }) {
  const { data } = await api.delete(`/workouts/${workoutId}/subscriptions`, {
    headers: { auth },
  });


  return data.data;
};

export async function createWorkoutComment({ workoutId, user_id, comment }) {
  const { data } = await api.post(`/workouts/${workoutId}/comments`, {
    user_id,
    comment,
  });

  return data.data;
}

export async function patchLikeWorkout({ user_id, workout_id }) {
    try {
      const response = await api.patch(`/workouts/${workout_id}/likes`, { user_id });

      return response.data;
    } catch(error) {
        console.error(error);
        return { data: null, errorMessage: error }
    }
}