import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { CircularProgress, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import api from '../../services';

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
  { name: "Image", type: "file" },
  { name: "title", label: "Title", type: "text" },
  { name: "description", label: "Description", type: "text" },
  {
    name: "location",
    label: "Location",
    type: "select",
    option: [
      { value: "vila_a", label: "Vila A" },
      { value: "vila_c", label: "Vila C" },
      { value: "cidade_nova", label: "Cidade Nova (frente a Unioeste)" },
    ],
  },
];

const fetchAddresses = async() => {
  const { data } = await api.get('/address')
  return data
}

export default function TransitionsModal({ openModal, onClose }) {

  const { data, error, isLoading } = useQuery({ queryKey: ['addresses'], queryFn: fetchAddresses });
console.log(data)
  const { register, handleSubmit } = useForm()

  const submit = (data) => {
    console.log(data)
  }


  if(isLoading) return <div>Loading...</div>
  if(error) {
    const message = axios.isAxiosError(error) && error.response ? `Error ${error.response.status} ${error.response.statusText}` : error.message
    return <div>{message}</div>
  }

  return (
    <div>
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
                  sx={{ marginBottom: 2 }}
                >
                  Create Workout
                </Typography>
                <form
                  onSubmit={handleSubmit(submit)}
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
                              defaultValue=''
                              {...register(field.name, { required: true })}
                            >
                              {data.map((option, indexOption) => (
                                <MenuItem
                                  key={indexOption}
                                  value={option.neighborhood}
                                >
                                  {option.neighborhood}
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
                    loading={isLoading}
                    color="primary"
                    type="submit"
                    variant="contained"
                  >
                    Create Workout
                  </Button>
                </form>
              </>
            )}
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}