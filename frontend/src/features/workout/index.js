import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createWorkout } from "../../api/workout";

function useMutationWorkout() {
    const queryClient = useQueryClient()

    const createWorkoutMutation = useMutation({
      mutationFn: createWorkout,
      onSuccess: (newData) => {
        queryClient.setQueryData(["workouts"], (oldData) => {
          return oldData ? [...oldData, newData] : [newData];
        })
        queryClient.invalidateQueries(["workouts"]);
      },
    });

    const updateWorkout = useMutation({})

    return {
        create: createWorkoutMutation,
        update: updateWorkout
    }
}

export default useMutationWorkout