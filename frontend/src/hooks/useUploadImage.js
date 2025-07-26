import { useState, useEffect } from "react";

export const useUploadImage = (file) => {
  const [image, setImage] = useState(null);

  useEffect(() => {
    if (!file || !(file instanceof File)) {
      setImage(null);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => setImage(reader.result);
    reader.readAsDataURL(file);

  }, [file]);

  return image;
};
