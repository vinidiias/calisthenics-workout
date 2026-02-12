import * as React from "react";
// MATERIAL UI
import {
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid2,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Button,
} from "@mui/material";
// CONTEXTS
import { UserContext } from "../../../contexts/UserContext";
// HOOKS
import { useResponseNotifier } from "../../../hooks/useResponseNotifier";
// APIS
import api from "../../../services";
// USE FORM
import { useForm } from "react-hook-form";
// TANSTACK QUERY
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createWorkout, patchWorkout } from "../../../services/workoutApi";
import { InputSelectController } from "../../ui/inputs/Select";
import { ControllerDatePickerInput } from "../../ui/inputs/DatePickerInput";
import { ControllerInput } from "../../ui/inputs/Input";

const fields = [
  { name: "title", label: "Title", type: "text" },
  { name: "description", label: "Description", type: "text" },
  {
    name: "outdoorGym",
    label: "Outdoor Gym",
    type: "select",
  },
  {
    name: "date",
    label: "Date",
    type: "datetime-local",
  },
];

const fetchOutdoorGym = async () => {
  const { data } = await api.get("/outdoor-gyms");
  return data.data;
};

const formatDateForInput = (date) => {
  if (!date) return "";
  const d = new Date(date);
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

export const FormWorkout = ({ openModal, onClose, workout }) => {
  const [options, setOptions] = React.useState([]);
  const { user } = React.useContext(UserContext);

  const isEditing = !!workout;

  const { handleErrorResponse } = useResponseNotifier();

  const { handleSubmit, reset, control } = useForm({
    defaultValues: { title: "", description: "", outdoorGym: -1, date: "" },
  });

  const queryClient = useQueryClient();

  React.useEffect(() => {
    if (workout) {
      reset({
        title: workout.title || "",
        description: workout.description || "",
        outdoorGym: workout.outdoorGym?._id || workout.outdoorGym || "",
        date: formatDateForInput(workout.date),
      });
    }
  }, [workout, reset]);

  const { data, isLoading } = useQuery({
    queryKey: ["outdoor_gyms"],
    queryFn: fetchOutdoorGym,
  });

  const { mutateAsync: createWorkoutFn, isPending: isPendingCreate } = useMutation({
    mutationFn: createWorkout,
    onSuccess(newData) {
      queryClient.setQueryData(["workouts"], (oldData) => {
        return oldData ? [...oldData, newData] : [newData];
      });
      queryClient.invalidateQueries(["workouts"]);
      handleReset();
      onClose();
    },
    onError: (resp) => {
      handleErrorResponse(resp.response.data);
      handleReset();
    }
  });

  const { mutateAsync: editWorkoutFn, isPending: isPendingEdit } = useMutation({
    mutationFn: patchWorkout,
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["workouts"] });
      onClose();
    },
    onError: (resp) => {
      handleErrorResponse(resp.response.data);
    }
  });

  const onSubmit = async (data) => {
    if (isEditing) {
      await editWorkoutFn({
        workoutId: workout._id,
        workout: data,
        auth: user._id,
      });
    } else {
      await createWorkoutFn({
        workout: data,
        auth: user._id,
      });
    }
    reset();
  };

  const submit = (e) => {
    e.preventDefault();
    handleSubmit(onSubmit)();
  };

  const handleReset = () => {
    reset({ title: "", description: "", outdoorGym: -1, date: "" });
  }

  const handleClose = () => {
    handleReset();
    onClose();
  }

  React.useEffect(() => {
    if (data) {
      setOptions(
        data.map((op) => {
          return {
            label: `${op?.name} | ${op?.address?.neighborhood}`,
            value: op?._id,
          };
        }),
      );
    }
  }, [data]);

  return (
    <>
      <Dialog open={openModal} onClose={handleClose} maxWidth="xs">
        <DialogTitle>{isEditing ? "Edit Workout" : "Create Workout"}</DialogTitle>
        <DialogContent dividers>
          {isLoading ? (
            <CircularProgress />
          ) : (
            <form onSubmit={submit}>
              <Grid2 container size={12} spacing={2} justifyContent="center">
                {fields.map((field, index) => {
                  switch (field.type) {
                    case "text":
                      return (
                        <Grid2 key={index} size={12}>
                          <ControllerInput
                            fullWidth
                            hiddenLabel
                            control={control}
                            label={field.label}
                            size="medium"
                            name={field.name}
                            id={field.name}
                            type={field.type}
                          />
                        </Grid2>
                      );
                    case "file":
                      return (
                        <Grid2 key={index} size={12}>
                          <ControllerInput
                            control={control}
                            size="medium"
                            fullWidth
                            hiddenLabel
                            name={field.name}
                            id={field.name}
                            type={field.type}
                          />
                        </Grid2>
                      );
                    case "datetime-local":
                      return (
                        <Grid2 key={index} size={12}>
                          <ControllerDatePickerInput
                            control={control}
                            name={field.name}
                            label={field.label}
                            rules={{ required: true }}
                          />
                        </Grid2>
                      );
                    case "select":
                      return (
                        <Grid2 key={index} size={12}>
                          <InputSelectController
                            control={control}
                            name={field.name}
                            options={options}
                          />
                        </Grid2>
                      );
                    default:
                      return null;
                  }
                })}
                <Grid2 size={12} container>
                  <Button
                    fullWidth
                    loading={isPendingCreate || isPendingEdit}
                    size="large"
                    type="submit"
                    variant="contained"
                  >
                    {isEditing ? "Save" : "Create Workout"}
                  </Button>
                </Grid2>
              </Grid2>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
