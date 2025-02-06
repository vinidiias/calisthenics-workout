import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { useForm } from 'react-hook-form';

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
    { name: 'title', label: 'Title', type: 'text' },
    { name: 'description', label: 'Description', type: 'text' },
    { name: 'location', label: 'Location', type: 'select', option: [
        { value: 'vila_a', label: 'Vila A' },
        { value: 'vila_c', label: 'Vila C' },
        { value: 'cidade_nova', label: 'Cidade Nova (frente a Unioeste)' },
    ] },
]

export default function TransitionsModal({ openModal, onClose }) {

    const { register, handleSubmit } = useForm()

    const submit = (data) => {
        console.log(data)
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
          <Box sx={style} >
            <Typography variant="h5" component="h2" sx={{ marginBottom: 2}}>
              Create Workout
            </Typography>
           <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-4">
               {fields.map((field, index) => {
                switch (field.type) {
                    case 'text':
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
                        )
                    case 'select':
                        return (
                          <FormControl sx={{ display: "block" }}>
                            <InputLabel id="location">Location</InputLabel>
                            <Select
                              fullWidth
                              key={index}
                              label={field.label}
                              name={field.name}
                              {...register(field.name, { required: true})}
                            >
                              {field.option.map((option, indexOption) => (
                                <MenuItem key={indexOption} value={option.value}>
                                  {option.label}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        );
                }
               })}
               <Button color='primary' type='submit' variant='contained'>
                    Create Workout
               </Button>
           </form>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}