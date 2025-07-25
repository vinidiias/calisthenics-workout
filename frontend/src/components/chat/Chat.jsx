import { Button, Container, Grid2, Typography } from "@mui/material"
import { useState } from "react"
import { socket } from "../../services/socket";
import { ChatForm } from "./ChatForm";

export const Chat = () => {
    const [fooEvents, setFooEvents] = useState([]);

    return (
      <Container maxWidth={false} py={1} sx={{ flex: 1 }}>
        <Grid2
          container
          spacing={2}
          justifyContent="center"
          alignItems="center"
          flexDirection={'column'}
          sx={{ backgroundColor: 'ButtonFace'}}
        >
          <Grid2>
            <Typography>State: {isConnected}</Typography>
          </Grid2>
          <Grid2>
            <ul>
              {fooEvents.map((msg, index) => (
                <li key={`${msg} - ${index}`}>{msg}</li>
              ))}
            </ul>
          </Grid2>
          <Grid2>
            <Button variant="contained" onClick={() => socket.connect()}>
              Connect
            </Button>
          </Grid2>
          <Grid2>
            <Button variant="outlined" onClick={() => socket.disconnect()}>
              Disconnect
            </Button>
          </Grid2>
          <Grid2>
            <ChatForm />
          </Grid2>
        </Grid2>
      </Container>
    );
}