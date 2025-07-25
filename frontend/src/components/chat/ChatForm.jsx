import { Button, TextField } from "@mui/material";
import { useState } from "react"
import { socket } from "../../services/socket";
import { useContext } from "react";
import { UserContext } from "../../contexts/UserContext";

export const ChatForm = () => {
    const [value, setValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useContext(UserContext);

    function onSubmit(e) {
      e.preventDefault();

      setIsLoading(true);

      socket
        .timeout(2000)
        .emit("chat-message", { author: user.name, message: value }, () => {
          setIsLoading(false);
          setValue("");
        });
    }

    return (
      <form onSubmit={onSubmit}>
        <TextField variant="outlined" onChange={(e) => setValue(e.target.value)} value={value} />
        <Button variant="contained" type="submit" disabled={isLoading}>
          Submit
        </Button>
      </form>
    );
}