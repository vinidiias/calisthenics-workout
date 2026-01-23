import { UserContext } from "../contexts/UserContext";
import { FormProvider, useForm } from "react-hook-form";
import { useContext, useEffect, useState } from "react";
// MATERIAL UI
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid2,
  TextField,
  Typography,
} from "@mui/material";
// API
import api from "../services";
// TANSTACK QUERY
import { useMutation, useQueryClient } from "@tanstack/react-query";
// SERVICES
import { createImage } from "../services/imageApi";

const updateUser = async ({ updatedData, id }) => {
  const { data } = await api.patch(`/user/${id}`, updatedData, {
    headers: { auth: id },
  });

  return data;
};

export const UpdatePersonalData = ({ open, handleClose, data, fields }) => {
  const { user, setUser } = useContext(UserContext);
  const formMethods = useForm();
  const [preview, setPreview] = useState(null);
  const file = formMethods.watch("newPhoto");

  const queryClient = useQueryClient();

  useEffect(() => {
    if (file && file.length > 0) {
      const newFile = file[0];
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result); // Gera a pré-visualização
      reader.readAsDataURL(newFile);
    } // Lê o arquivo
  }, [file]);

  useEffect(() => {
    if (data) {
      formMethods.reset(data);
    }
  }, [data, formMethods]);

  const { mutateAsync: updateUserFn, isPending: isPedingUser } = useMutation({
    mutationFn: updateUser,
    onSuccess: (updatedData) => {
      queryClient.setQueriesData(["user"], (oldData) => {
        return { ...oldData, ...updatedData };
      });
      setUser((prevState) => ({
        ...prevState,
        ...updatedData,
      }));
      handleClose();
    },
  });

  const { mutateAsync: updateImageFn, isPending: isPendingImage } = useMutation(
    {
      mutationFn: createImage,
      onSuccess: (updatedData) => {
        updateUserFn({ updatedData: updatedData, id: user._id });
      },
    },
  );

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs">
      <DialogTitle>Update Informations</DialogTitle>
      <DialogContent dividers>
        <FormProvider {...formMethods}>
          <form
            onSubmit={formMethods.handleSubmit((data) =>
              file
                ? updateImageFn({ ...data, photo: file })
                : updateUserFn({ updatedData: data, id: user._id }),
            )}
          >
            <Grid2 container gap={2}>
              {fields &&
                fields.map((field) => (
                  <Grid2 key={field.label} size={12}>
                    <Box
                      sx={{ display: "flex", flexDirection: "column", gap: 1 }}
                    >
                      <Typography variant="body1">{field.label}</Typography>
                      {!file || field.type !== "file" ? (
                        <TextField
                          fullWidth
                          size="small"
                          type={field.type}
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
                          >
                            Delete
                          </Button>
                        </div>
                      )}
                    </Box>
                  </Grid2>
                ))}
              <Grid2 size={12}>
                <Button
                  fullWidth
                  variant="contained"
                  type="submit"
                  size="small"
                  loading={isPedingUser || isPendingImage}
                >
                  Save
                </Button>
              </Grid2>
            </Grid2>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};
