import { Box, Button, Modal, TextField, Typography } from "@mui/material"
import { useContext, useEffect, useState } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { useUploadImage } from '../../util/useUploadImage'
import api from "../../services";
import { UserContext } from "../../contexts/UserContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createImage } from '../../services/imageApi'

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

  const updateUser = async({ updatedData, id }) => {
    const { data } = await api.patch(`/user/${id}`, updatedData, {
      headers: { auth: id }
    })

    return data
  }

export const UpdatePersonalData = ({ open, handleClose, data, fields }) => {
    const { user, setUser } = useContext(UserContext)
    const formMethods = useForm()
    const [preview, setPreview] = useState(null);
    const file = formMethods.watch('newPhoto')

    const queryClient = useQueryClient()

    useEffect(() => {
      if(file && file.length > 0) {
        const newFile = file[0]
        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result); // Gera a pré-visualização
        reader.readAsDataURL(newFile);
       } // Lê o arquivo
    }, [file])

    useEffect(() => {
        if(data) {
            formMethods.reset(data)
        }
    }, [data, formMethods])

    const { mutateAsync: updateUserFn, isPending: isPedingUser } = useMutation({
      mutationFn: updateUser,
      onSuccess: (updatedData) => {
        console.log(updatedData)
        queryClient.setQueriesData(['user'], (oldData) => {
          return { ...oldData, ...updatedData }
        })
        setUser(prevState => ({
          ...prevState,
          ...updatedData
        }))
        handleClose()
      }
    })

    const { mutateAsync: updateImageFn, isPending: isPendingImage } = useMutation({
      mutationFn: createImage,
      onSuccess: (updatedData) => {
        updateUserFn({ updatedData: updatedData, id: user._id })
      }
    })

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
            sx={{ color: "text.primary" }}
          >
            Update Informations
          </Typography>
          <FormProvider {...formMethods}>
            <form
              onSubmit={formMethods.handleSubmit((data) =>
                file
                  ? updateImageFn({ ...data, photo: file })
                  : updateUserFn({ updatedData: data, id: user._id })
              )}
              className="flex flex-col gap-3"
            >
              {fields &&
                fields.map((field) => (
                  <div
                    key={field.label}
                    className={`${
                      formMethods.watch("newPhoto") && field.type === "file"
                        ? "flex items-center gap-0"
                        : ""
                    }`}
                  >
                    <div key={field.name} className="flex flex-col gap-1">
                      <Typography
                        fontWeight="regular"
                        sx={{ color: "text.primary" }}
                      >
                        {field.label}
                      </Typography>
                      {!file || field.type !== "file" ? (
                        <TextField
                          fullWidth
                          size="small"
                          type={field.type}
                          sx={{
                            "& .MuiInputBase-input": {
                              color: "input.secondary", // Altere para a cor desejada
                            },
                          }}
                          {...formMethods.register(field.name)}
                        />
                      ) : (
                        <div className="flex items-center gap-3">
                          {file && (
                            <img
                              src={preview}
                              className="h-15 w-15 object-cover rounded-full"
                            />
                          )}
                          <Button
                            onClick={() =>
                              formMethods.setValue("newPhoto", null)
                            }
                            color="error"
                            size="small"
                            variant="contained"
                            sx={{ textTransform: "none", backgroundColor: 'button.primary' }}
                          >
                            Delete
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              <Button
                variant="contained"
                type="submit"
                size="small"
                sx={{
                  backgroundColor: 'button.primary',
                  color: 'white',
                  textTransform: "none",
                  fontSize: ".9em",
                }}
                loading={isPedingUser || isPendingImage}
              >
                Save
              </Button>
            </form>
          </FormProvider>
        </Box>
      </Modal>
    );
}