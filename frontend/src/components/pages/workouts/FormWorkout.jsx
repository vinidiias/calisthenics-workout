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
import { useThemeColor } from "../../../hooks/useThemeColor";
// APIS
import api from "../../../services";
// USE FORM
import { useForm } from "react-hook-form";
// TANSTACK QUERY
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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
  const { data } = await api.get("/outdoorGym");
  return data;
};

const createWorkout = async ({ workout, auth }) => {
  const { data } = await api.post("/workout/create", workout, {
    headers: { auth: auth },
  });

  return data;
};

export const FormWorkout = ({ openModal, onClose }) => {
  const { user } = React.useContext(UserContext);
  const { isDark } = useThemeColor();
  // const [errors, setErrors] = React.useState({
  //   title: null,
  //   description: null,
  //   outdoorGym: null,
  //   date: null,
  // });

  const { register, handleSubmit, reset } = useForm();

  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["outdoor_gyms"],
    queryFn: fetchOutdoorGym,
  });

  const { mutateAsync: createWorkoutFn, isPending } = useMutation({
    mutationFn: createWorkout,
    onSuccess(newData) {
      // Obtém os dados mais recentes do cache antes de atualizar
      queryClient.setQueryData(["workouts"], (oldData) => {
        return oldData ? [...oldData, newData] : [newData];
      });

      queryClient.invalidateQueries(["workouts"]);
      onClose();
    },
  });

  const handleCreateWorkout = async (data) => {
    await createWorkoutFn({
      workout: data,
      auth: user._id,
    });

    reset();
  };

  const submit = (e) => {
    e.preventDefault();
    handleSubmit(handleCreateWorkout)();
  };

  return (
    <>
      <Dialog open={openModal} onClose={onClose} maxWidth="xs">
        <DialogTitle>Create Workout</DialogTitle>
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
                          <TextField
                            variant="outlined"
                            size="medium"
                            fullWidth
                            label={field.label}
                            name={field.name}
                            id={field.name}
                            type={field.type}
                            {...register(field.name, { required: true })}
                          />
                        </Grid2>
                      );
                    case "file":
                      return (
                        <Grid2 key={index} size={12}>
                          <TextField
                            size="medium"
                            fullWidth
                            hiddenLabel
                            name={field.name}
                            id={field.name}
                            type={field.type}
                            {...register(field.name, { required: true })}
                          />
                        </Grid2>
                      );
                    case "datetime-local":
                      return (
                        <Grid2 key={index} size={12}>
                          <TextField
                            size="medium"
                            fullWidth
                            hiddenLabel
                            name={field.name}
                            id={field.name}
                            type={field.type}
                            sx={{
                              "& input[type='datetime-local']::-webkit-calendar-picker-indicator":
                                {
                                  filter: isDark ? "invert(1)" : "invert(0)", // Inverte a cor do ícone (branco em fundo escuro)
                                  cursor: "pointer",
                                },
                              "& input[type='datetime-local']": {
                                cursor: "pointer",
                              },
                            }}
                            {...register(field.name, { required: true })}
                          />
                        </Grid2>
                      );
                    case "select":
                      return (
                        <Grid2 key={index} size={12}>
                          <FormControl fullWidth>
                            {field.label && (
                              <InputLabel id={`${field.name}-label`}>
                                {field.label}
                              </InputLabel>
                            )}
                            <Select
                              size="medium"
                              labelId={`${field.name}-label`}
                              label={field.label}
                              name={field.name}
                              defaultValue={-1}
                              {...register(field.name, { required: true })}
                            >
                              <MenuItem key="select" disabled value={-1}>
                                Select...
                              </MenuItem>
                              {data &&
                                data.map((option, indexOption) => (
                                  <MenuItem
                                    key={indexOption}
                                    value={option._id}
                                  >
                                    {`${option.name} | ${option.address.neighborhood}`}
                                  </MenuItem>
                                ))}
                            </Select>
                          </FormControl>
                        </Grid2>
                      );
                    default:
                      return null;
                  }
                })}
                <Grid2 size={12} container>
                  <Button
                    fullWidth
                    loading={isPending}
                    size="large"
                    type="submit"
                    variant="contained"
                  >
                    Create Workout
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
