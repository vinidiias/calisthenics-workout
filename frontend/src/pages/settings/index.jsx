import React, { useContext, useState } from "react";
//MATERIAL UI
import {
  Box,
  Button,
  Container,
  Divider,
  Grid2,
  Paper,
  Typography,
} from "@mui/material";
// COMPONENTS
import { UpdatePersonalData } from "../../components/UpdatePersonalData";
// API
import api from "../../services";
// CONTEXT
import { UserContext } from "../../contexts/UserContext";
// ICONS
import EditIcon from "@mui/icons-material/Edit";
// TANSTACK QUERY
import { useQuery } from "@tanstack/react-query";

const getUser = async ({ id }) => {
  const { data } = await api.get(`/user/${id}`);
  return data;
};

export const Settings = () => {
  const { user } = useContext(UserContext);
  const [open, setOpen] = useState(false);
  const [fields, setFields] = useState([]);
  const [filteredData, setFilteredData] = useState({});

  const { data, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: () => getUser({ id: user._id }),
  });

  const infos = [
    {
      label: "Photo",
      value: (
        <img
          style={{ height: "3.75rem", width: "3.75rem", objectFit: "cover", borderRadius: "50%" }}
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
    {
      label: "Street",
      value: data?.address?.street,
      type: "text",
      name: "address.street",
    },
    {
      label: "Number",
      value: data?.address?.number,
      type: "text",
      name: "address.number",
    },
    {
      label: "Neighborhood",
      value: data?.address?.neighborhood,
      type: "text",
      name: "address.neighborhood",
    },
    {
      label: "ZIP Code",
      value: data?.address?.zipCode,
      type: "text",
      name: "address.zipCode",
    },
    {
      label: "City",
      value: data?.address?.city,
      type: "text",
      name: "address.city",
    },
    {
      label: "State",
      value: data?.address?.state,
      type: "text",
      name: "address.state",
    },
  ];

  const filterData = (data, infos, address) => {
    const filteredInfos = {};
    const filteredAddress = {};

    // Filtrando os dados de 'infos'
    infos?.forEach((info) => {
      if (Object.prototype.hasOwnProperty.call(data, info?.name)) {
        filteredInfos[info.name] = data[info.name];
      }
    });

    // Filtrando os dados de 'address'
    address.forEach((addr) => {
      const key = addr.name.split(".")[1]; // Extraímos a chave após o ponto
      if (
        data.address &&
        Object.prototype.hasOwnProperty.call(data.address, key)
      ) {
        filteredAddress[key] = data.address[key];
      }
    });

    return { filteredInfos, filteredAddress };
  };

  const handleOpen = ({ fieldsProps, dataGroupName }) => {
    const { filteredInfos, filteredAddress } = filterData(data, infos, address);
    setOpen(true);
    setFields(fieldsProps);
    setFilteredData(
      dataGroupName === "infos" ? filteredInfos : { address: filteredAddress },
    );
  };

  return (
    <Container maxWidth={false} sx={{ p: 2 }}>
      <UpdatePersonalData
        open={open}
        handleClose={() => setOpen(false)}
        data={filteredData ?? null}
        fields={fields}
      />
      <Box sx={{ display: "flex", flexDirection: "column", gap: 3.5, width: "100%" }}>
        <Typography fontSize="1.2em" color="text.primary">
          Settings
        </Typography>
        <Paper sx={{ padding: 4, paddingX: 5 }} elevation={2}>
          <Box sx={{ display: "flex", gap: 5 }}>
            <img
              src={data?.photo}
              alt=""
              style={{ height: "6.25rem", width: "6.25rem", objectFit: "cover", borderRadius: "50%" }}
            />
            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
              <Typography fontWeight="medium">{data?.name}</Typography>
              <Typography>{data?.email || "Foz do Iguaçu, Brazil"}</Typography>
              <Typography>
                {data?.address.city || "Foz do Iguaçu, Brazil"}
              </Typography>
            </Box>
          </Box>
        </Paper>
        <Paper elevation={2}>
          <Box padding={2}>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}
            >
              <Typography fontSize="1rem">Personal Information</Typography>
              <Button
                loading={isLoading}
                variant="contained"
                type="button"
                size="small"
                endIcon={<EditIcon />}
                onClick={() =>
                  handleOpen({ fieldsProps: infos, dataGroupName: "infos" })
                }
              >
                Edit
              </Button>
            </Box>
            <Divider sx={{ marginBottom: 2.5 }} />
            <Grid2 container spacing={2}>
              {infos &&
                infos
                  .filter((infos) => infos.type !== "file")
                  .map((info, index) => (
                    <React.Fragment key={info.label}>
                      <Grid2
                        size={{ xs: 12, sm: 6 }}
                        container
                        key={info.label}
                        alignItems={"center"}
                      >
                        <Box>
                          <Typography variant="body1">{info.label}</Typography>
                          <Typography variant="body2">{info.value}</Typography>
                        </Box>
                      </Grid2>
                      {(index + 1) % 2 == 0 && index !== infos.length - 1 && (
                        <Grid2 size={12}>
                          <Divider sx={{ width: "100%" }} />
                        </Grid2>
                      )}
                    </React.Fragment>
                  ))}
            </Grid2>
          </Box>
        </Paper>
        <Paper elevation={2}>
          <Box padding={2}>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}
            >
              <Typography fontSize="1rem">Address</Typography>
              <Button
                loading={isLoading}
                variant="contained"
                type="button"
                size="small"
                endIcon={<EditIcon />}
                onClick={() =>
                  handleOpen({ fieldsProps: address, dataGroupName: "address" })
                }
              >
                Edit
              </Button>
            </Box>
            <Divider sx={{ marginBottom: 2.5 }} />
            <Grid2 container size={12} spacing={2}>
              {address &&
                address.map((info, index) => (
                  <React.Fragment key={info.label}>
                    <Grid2 size={{ xs: 12, sm: 6 }} key={info.label}>
                      <Box>
                        <Typography variant="body1">{info.label}</Typography>
                        <Typography variant="body2">{info.value}</Typography>
                      </Box>
                    </Grid2>
                    {(index + 1) % 2 == 0 && index !== address.length - 1 && (
                      <Grid2 size={12}>
                        <Divider sx={{ width: "100%" }} />
                      </Grid2>
                    )}
                  </React.Fragment>
                ))}
              <Divider />
            </Grid2>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};
