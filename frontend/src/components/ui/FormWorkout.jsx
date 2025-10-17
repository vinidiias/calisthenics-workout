import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { CircularProgress, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { UserContext } from '../../contexts/UserContext';
import api from '../../services';
import { useThemeColor } from '../../hooks/useThemeColor';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

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
  const { data } = await api.get('/outdoorGym')
  return data
}

const createWorkout = async ({ workout, auth }) => {
  const { data } = await api.post('/workout/create', workout, {
    headers: { auth: auth}
  })

  return data
}

export const FormWorkout = ({ openModal, onClose }) => {
  const { user } = React.useContext(UserContext)
  const { isDark } = useThemeColor()

  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ["outdoor_gyms"],
    queryFn: fetchOutdoorGym,
  });

  const { mutateAsync: createWorkoutFn, isPending } = useMutation({
    mutationFn: createWorkout,
    onSuccess(newData) {
      // Obtém os dados mais recentes do cache antes de atualizar
      queryClient.setQueryData(['workouts'], (oldData) => {
        return oldData ? [...oldData, newData] : [newData];
      });
  
      // Opcional: refaz a requisição para garantir que os dados no servidor estão sincronizados
      queryClient.invalidateQueries(['workouts']);
      onClose()
    }
  });

  const handleCreateWorkout = async (data) => {
      await createWorkoutFn({
        workout: data,
        auth: user._id,
      });
  }

  const { register, handleSubmit } = useForm();

  return (
    <>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={openModal}
        onClose={onClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={openModal}>
          <Box sx={style}>
            {isLoading ? (
              <CircularProgress />
            ) : (
              <>
                <Typography
                  variant="h5"
                  component="h2"
                  sx={{ marginBottom: 2, color: 'text.primary' }}
                >
                  Create Workout
                </Typography>
                <form
                  onSubmit={handleSubmit(handleCreateWorkout)}
                  className="flex flex-col gap-4"
                >
                  {fields.map((field, index) => {
                    switch (field.type) {
                      case "text":
                        return (
                          <TextField
                            fullWidth
                            key={index}
                            label={field.label}
                            name={field.name}
                            id={field.name}
                            type={field.type}
                            sx={{['.MuiOutlinedInput-root']: {
                              color: 'input.secondary'
                            }}}
                            {...register(field.name, { required: true })}
                          />
                        );
                      case "file":
                        return (
                          <TextField
                            fullWidth
                            key={index}
                            hiddenLabel
                            name={field.name}
                            id={field.name}
                            type={field.type}
                            sx={{['.MuiOutlinedInput-root']: {
                              color: 'input.secondary'
                            }}}
                            {...register(field.name, { required: true })}
                          />
                        );
                        case "datetime-local":
                        return (
                          <TextField
                            fullWidth
                            key={index}
                            hiddenLabel
                            name={field.name}
                            id={field.name}
                            type={field.type}
                            sx={{
                            
                              ['.MuiOutlinedInput-root']: {
                                color: 'input.secondary'
                              },
                              "& input[type='datetime-local']::-webkit-calendar-picker-indicator":
                                {
                                  filter: isDark ? "invert(1)" : "invert(0)", // Inverte a cor do ícone (branco em fundo escuro)
                                  cursor: "pointer",
                                },
                            }}
                            {...register(field.name, { required: true })}
                          />
                        );
                      case "select":
                        return (
                          <FormControl sx={{ display: "block" }} key={index}>
                            <InputLabel id="location">Location</InputLabel>
                            <Select
                              fullWidth
                              label={field.label}
                              name={field.name}
                              defaultValue=""
                              {...register(field.name, { required: true })}
                            >
                              {data.map((option, indexOption) => (
                                <MenuItem key={indexOption} value={option._id}>
                                  {`${option.name} | ${option.address.neighborhood}`}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        );
                      default:
                        return null;
                    }
                  })}
                  <Button
                    loading={isPending}
                    type="submit"
                    variant="contained"
                    sx={{ textTransform: "none", fontSize: '1em', fontWeight: 'regular', backgroundColor: 'button.primary', color: 'white' }}
                  >
                    Create Workout
                  </Button>
                </form>
              </>
            )}
          </Box>
        </Fade>
      </Modal>
    </>
  );
}