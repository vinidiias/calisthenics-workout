import api from "../services";

export const createImage = async (dataUser) => {
  const formData = new FormData();
  formData.append("photo", dataUser.photo[0]);

  const { data } = await api.post("/file", formData);

  return { ...dataUser, photo: data };
};

export const updateImage = async (image) => {
  const formData = new FormData();
  formData.append("photo", image[0]);

  const { data } = await api.post("/file", formData);

  return { photo: data };
};
