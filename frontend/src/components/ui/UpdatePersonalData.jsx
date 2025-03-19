import { Box, Button, Modal, TextField, Typography } from "@mui/material"
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
  };

const fields = [
    { label: 'Name', type: 'text', name: 'name' },
    { label: 'Email', type: 'email', name: 'email' },
    { label: 'Phone', type: 'tel', name: 'phone' },
    { label: 'Address', type: 'text', name: 'address' },
    { label: 'Biography', type: 'textarea', name: 'biography' },
]

export const UpdatePersonalData = ({ open, handleClose, data }) => {
    const formMethods = useForm()
    
    useEffect(() => {
        if(data) {
            formMethods.reset(data)
        }
    }, [data, formMethods])

    return (
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box bgcolor="white" maxWidth={400} sx={{ ...style }}>
          <Typography
            variant="h3"
            fontSize="1.3em"
            textAlign="center"
            fontWeight="medium"
            marginBottom="1em"
          >
            Update Informations
          </Typography>
          <FormProvider {...formMethods}>
            <form className="flex flex-col gap-3">
              {fields &&
                fields.map((field) => (
                  <div  key={field.name} className="flex flex-col gap-1">
                    <Typography fontWeight="regular">{field.label}</Typography>
                    <TextField fullWidth size="small" type={field.type} {...formMethods.register(field.name)} />
                  </div>
                ))}
              <Button
                variant="contained"
                size="small"
                sx={{
                  backgroundColor: "oklch(0.446 0.03 256.802)",
                  textTransform: "none",
                  fontSize: ".9em",
                }}
              >
                Save
              </Button>
            </form>
          </FormProvider>
        </Box>
      </Modal>
    );
}