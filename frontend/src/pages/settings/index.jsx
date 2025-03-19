import { Box, Button, Divider, Input, OutlinedInput, Paper, TextField, Typography } from "@mui/material"
import { useQuery } from "@tanstack/react-query"
import React, { useContext, useState } from "react"
import { UserContext } from "../../contexts/UserContext"
import api from "../../services"
import EditIcon from '@mui/icons-material/Edit';
import { UpdatePersonalData } from "../../components/ui/UpdatePersonalData"

const getUser = async({ id }) => {
    const { data } = await api.get(`/user/${id}`)
    return data
  }

export const Settings = () => {
    const { user } = useContext(UserContext)
    const [open, setOpen] = useState(false)
    const { data, error, isLoading } = useQuery({
        queryKey: ["user"],
        queryFn: () => getUser({ id: user._id })
    })


    const infos = [
      { label: "Photo", value: <img className="h-15 w-15 br-10 object-cover rounded-full" src={data?.photo} /> },
      { label: "Name", value: data?.name },
      { label: "Email", value: data?.email },
      { label: "Address", value: data?.address },
      { label: "Biography", value: data?.biography },
    ]

    return (
      <Box flexGrow={1} className="p-4 bg-gray-50 flex justify-center">
        <UpdatePersonalData open={open} handleClose={() => setOpen(false)} data={data} />
        <div className="flex flex-col gap-7 w-300">
          <Typography fontSize="1.2em">My Profile</Typography>
          <Paper sx={{ padding: 4, paddingX: 5 }}>
            <div className="flex gap-10">
              <img
                src={data?.photo}
                alt=""
                className=" h-25 w-25 object-cover rounded-full"
              />
              <div className="flex flex-col gap-1">
                <Typography fontWeight="medium">{data?.name}</Typography>
                <Typography>
                  {data?.email || "Foz do Iguaçu, Brazil"}
                </Typography>
                <Typography>
                  {data?.address || "Foz do Iguaçu, Brazil"}
                </Typography>
              </div>
            </div>
          </Paper>
          <Paper>
            <div className="p-8">
              <div className="flex justify-between mb-3">
                <Typography fontSize="1.2em" fontWeight="regular">
                  Personal Information
                </Typography>
                <Button variant="contained" type="button" size="small" endIcon={<EditIcon />} onClick={() => setOpen(true)} sx={{ backgroundColor: 'oklch(0.446 0.03 256.802)', textTransform: "none", fontSize: '.9em'}}>
                  Edit
                </Button>
              </div>
              <Divider sx={{ marginBottom: 2 }} />
              <div className="flex flex-col gap-5">
                {infos &&
                  infos.map((info) => (
                    <React.Fragment key={info.label}>
                      <div className="flex items-center">
                        <Typography width="40%" fontWeight="medium">
                          {info.label}
                        </Typography>
                        <Typography fontWeight="regular">{info.value}</Typography>
                      </div>
                      <Divider />
                    </React.Fragment>
                  ))}
              </div>
            </div>
          </Paper>
        </div>
      </Box>
    );
}