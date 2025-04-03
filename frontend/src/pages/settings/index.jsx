import {
  Box,
  Button,
  Container,
  Divider,
  Grid,
  Grid2,
  Input,
  OutlinedInput,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import React, { useContext, useState } from "react";
import { UserContext } from "../../contexts/UserContext";
import api from "../../services";
import EditIcon from "@mui/icons-material/Edit";
import { UpdatePersonalData } from "../../components/ui/UpdatePersonalData";
import Footer from "../../layouts/footer";
import { useThemeColor } from "../../hooks/useThemeColor";

const getUser = async ({ id }) => {
  const { data } = await api.get(`/user/${id}`);
  return data;
};

export const Settings = () => {
  const { user } = useContext(UserContext);
  const { isDark } = useThemeColor()
  const [open, setOpen] = useState(false);
  const [fields, setFields] = useState([])
  const [filteredData, setFilteredData] = useState({})

  const { data, error, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: () => getUser({ id: user._id }),
  });

  const infos = [
    {
      label: "Photo",
      value: (
        <img
          className="h-15 w-15 br-10 object-cover rounded-full"
          src={data?.photo}
        />
      ),
      type: "file",
      name: "newPhoto",
    },
    { label: "Name", value: data?.name, type: "text", name: "name" },
    { label: "Phone", value: data?.phone, type: "tel", name: "phone" },
    { label: "Email", value: data?.email, type: "email", name: "email" },
    {
      label: "Biography",
      value: data?.biography,
      type: "text",
      name: "biography",
    },
  ];

  const address = [
    { label: "Street", value: data?.address?.street, type: 'text', name: 'address.street' },
    { label: "Number", value: data?.address?.number, type: 'text', name: 'address.number' },
    { label: "Neighborhood", value: data?.address?.neighborhood, type: 'text', name: 'address.neighborhood' },
    { label: "ZIP Code", value: data?.address?.zipCode, type: 'text', name: 'address.zipCode' },
    { label: "City", value: data?.address?.city, type: 'text', name: 'address.city' },
    { label: "State", value: data?.address?.state, type: 'text', name: 'address.state' },
  ];

  const filterData = (data, infos, address) => {
    // Criando objetos para armazenar as chaves filtradas
    const filteredInfos = {};
    const filteredAddress = {};
  
    // Filtrando os dados de 'infos'
    infos?.forEach(info => {
      if (Object.prototype.hasOwnProperty.call(data, info?.name)) {
        filteredInfos[info.name] = data[info.name];
      }
    });
  
    // Filtrando os dados de 'address'
    address.forEach(addr => {
      const key = addr.name.split('.')[1]; // Extraímos a chave após o ponto
      if (data.address && Object.prototype.hasOwnProperty.call(data.address, key)) {
        filteredAddress[key] = data.address[key];
      }
    });
  
    // Retorna os objetos filtrados
    return { filteredInfos, filteredAddress };
  };

  const handleOpen = ({ fieldsProps, dataGroupName }) => {
    const { filteredInfos, filteredAddress } = filterData(data, infos, address);
    console.log(filteredInfos, filteredAddress)
    setOpen(true)
    setFields(fieldsProps)
    setFilteredData(
      dataGroupName === "infos" ? filteredInfos : { address: filteredAddress }
    );
  }

  return (
    <Container
      disableGutters
      maxWidth="100%"
      className={`p-4 ${
        isDark ? "bg-[#202124]" : ""
      } flex justify-center w-auto`}
    >
      <UpdatePersonalData
        open={open}
        handleClose={() => setOpen(false)}
        data={filteredData ?? null}
        fields={fields}
      />
      <div className="flex flex-col gap-7 w-300 max-lg:w-full max-2xl:w-200 max-[1470px]:w-250 ">
        <Typography fontSize="1.2em" color="text.primary">
          Settings
        </Typography>
        <Paper sx={{ padding: 4, paddingX: 5 }} elevation={2}>
          <div className="flex gap-10">
            <img
              src={data?.photo}
              alt=""
              className=" h-25 w-25 object-cover rounded-full"
            />
            <div className="flex flex-col gap-1">
              <Typography fontWeight="medium">{data?.name}</Typography>
              <Typography>{data?.email || "Foz do Iguaçu, Brazil"}</Typography>
              <Typography>
                {data?.address.city || "Foz do Iguaçu, Brazil"}
              </Typography>
            </div>
          </div>
        </Paper>
        <Paper elevation={2}>
          <div className="p-8">
            <div className="flex justify-between mb-3">
              <Typography fontSize="1.2em" fontWeight="regular">
                Personal Information
              </Typography>
              <Button
                variant="contained"
                type="button"
                size="small"
                endIcon={<EditIcon />}
                onClick={() =>
                  handleOpen({ fieldsProps: infos, dataGroupName: "infos" })
                }
                sx={{
                  backgroundColor: "button.primary",
                  color: "white",
                  textTransform: "none",
                  fontSize: ".9em",
                }}
              >
                Edit
              </Button>
            </div>
            <Divider sx={{ marginBottom: 2.5 }} />
            <Grid2 container rowSpacing={2.5}>
              {infos &&
                infos.map((info) => (
                  <React.Fragment key={info.label}>
                    <Grid2 container size={12}>
                      <Grid2 size={6}>
                        <Typography width="40%" fontWeight="medium">
                          {info.label}
                        </Typography>
                      </Grid2>
                      <Grid2 size={6}>
                        <Typography fontWeight="regular">
                          {info.value}
                        </Typography>
                      </Grid2>
                    </Grid2>
                    <Divider sx={{ width: '100%' }} />
                  </React.Fragment>
                ))}
            </Grid2>
          </div>
        </Paper>
        <Paper elevation={2}>
          <div className="p-8">
            <div className="flex justify-between mb-3">
              <Typography fontSize="1.2em" fontWeight="regular">
                Address
              </Typography>
              <Button
                variant="contained"
                type="button"
                size="small"
                endIcon={<EditIcon />}
                onClick={() =>
                  handleOpen({ fieldsProps: address, dataGroupName: "address" })
                }
                sx={{
                  backgroundColor: "button.primary",
                  color: "white",
                  textTransform: "none",
                  fontSize: ".9em",
                }}
              >
                Edit
              </Button>
            </div>
            <Divider sx={{ marginBottom: 2.5 }} />
            <Grid2 container rowSpacing={2.5}>
              {address &&
                address.map((info) => (
                  <React.Fragment key={info.label}>
                    <Grid2 container size={12} key={info.label}>
                      <Grid2 size={6}>
                        <Typography fontWeight="medium">
                          {info.label}
                        </Typography>
                      </Grid2>
                      <Grid2 size={6}>
                        <Typography fontWeight="regular">
                          {info.value}
                        </Typography>
                      </Grid2>
                    </Grid2>
                    <Divider sx={{ width: "100%" }} />
                  </React.Fragment>
                ))}
              <Divider />
            </Grid2>
          </div>
        </Paper>
      </div>
    </Container>
  );
};
