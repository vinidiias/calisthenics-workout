import { Box, Button, Divider, Input, OutlinedInput, Paper, TextField, Typography } from "@mui/material"
import { useQuery } from "@tanstack/react-query"
import { useContext } from "react"
import { UserContext } from "../../contexts/UserContext"
import api from "../../services"
import EditIcon from '@mui/icons-material/Edit';

const getUser = async({ id }) => {
    const { data } = await api.get(`/user/${id}`)
    console.log(data)
    return data
  }

export const Settings = () => {
    const { user } = useContext(UserContext)
    console.log(user)
    const { data, error, isLoading } = useQuery({
        queryKey: ["user"],
        queryFn: () => getUser({ id: user._id })
    })

    console.log(data)

    return (
      <div className="flex flex-col gap-3 flex-1 p-4 bg-gray-50">
        <Typography fontSize="1.2em">My Profile</Typography>
        <Paper sx={{ padding: 2, paddingX: 5 }}>
          <div className="flex gap-10">
            <img
              src={data?.photo}
              alt=""
              className=" h-25 w-25 br-10 object-cover rounded-[100px]"
            />
            <div className="flex flex-col gap-1">
              <Typography fontWeight="medium">{data?.name}</Typography>
              <Typography>{data?.email || "Foz do Iguaçu, Brazil"}</Typography>
              <Typography>
                {data?.address || "Foz do Iguaçu, Brazil"}
              </Typography>
            </div>
          </div>
        </Paper>
        <Paper>
          <div className="p-3">
            <div className="flex justify-between items-center mb-3">
                <Typography fontSize='1.2em' fontWeight='regular'>Personal Information</Typography>
              <Button variant="contained" endIcon={<EditIcon />}>
                Edit
              </Button>
            </div>
            <Divider sx={{ marginBottom: 2}}/>
            <div>
                <div>
                    <Typography fontWeight='medium'>Name</Typography>
                    <TextField size="small" value={data?.name} />
                </div>
            </div>
          </div>
        </Paper>
      </div>
    );
}