import { Avatar, Container, Grid, Grid2, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, Paper, TextField, Typography, useTheme } from "@mui/material";
import { useState } from "react"
import { useEffect } from "react";
import api from "../../services";
import { Lens } from "@mui/icons-material";

export const ChatPage = ({ activeFriends, userId }) => {
    const [friendsFollowing, setFriendsFollowing] = useState([]);
    // const [messages, setMessages] = useState();
    const theme = useTheme();
    
    useEffect(() => {
      const getFollowers = async () => {
        const query = ['name', 'photo', 'biography'];
        const response = await api.get(`/user/${userId}/followers/?filter=${query.join(',')}`);

        if (!response) return new Error(response);

        const data = await response.data;
        setFriendsFollowing(data);
      };

      getFollowers();
    }, [userId]);

    return (
      <Container maxWidth={false} disableGutters sx={{ flex: 1 }}>
        <Grid2 container height="100%">
          <Grid2
            size={3}
            sx={{
              backgroundColor: theme.palette.background.paper,
              color: theme.palette.text.primary,
              borderRightColor: theme.palette.divider,
              borderRightWidth: 1,
            }}
          >
            <List
              dense
              disablePadding
              sx={{ backgroundColor: theme.palette.background.paper }}
            >
              {friendsFollowing.length > 0 &&
                friendsFollowing.map((friend, index) => (
                  <ListItem
                    disableGutters
                    sx={{
                      paddingLeft: 5,
                      borderBottom: 1,
                      borderColor: theme.palette.divider,
                    }}
                    key={`${friend.name} - ${index}`}
                  >
                    <ListItemButton>
                      <ListItemAvatar>
                        <Avatar
                          alt={`Avatar - {${index}}`}
                          src={friend.photo}
                        />
                      </ListItemAvatar>
                      <ListItemText
                        id={`Name - ${friend.name} - ${index}`}
                        primary={friend.name}
                      />
                      {activeFriends.includes(friend._id) && (
                        <Lens color="success" sx={{ fontSize: 10 }} />
                      )}
                    </ListItemButton>
                  </ListItem>
                ))}
            </List>
          </Grid2>
          <Grid2
            container
            size="grow"
            direction="column"
            color={theme.palette.text.primary}
            sx={{ backgroundColor: theme.palette.background.paper }}
          >
            <Grid2 container flex={1} size={12} marginTop={2}>
              <Grid2 size="grow" marginLeft={20} container spacing={2}>
                <Grid2>
                  <Avatar src={friendsFollowing[0]?.photo} />
                </Grid2>
                <Grid2>
                  <Paper
                    sx={{ width: "max-content", padding: 1, paddingY: 0.5 }}
                  >
                    <Typography>Texto</Typography>
                  </Paper>
                </Grid2>
              </Grid2>
              <Grid2
                size="grow"
                marginRight={20}
                container
                spacing={2}
                justifyContent={"end"}
              >
                <Grid2>
                  <Paper
                    sx={{ width: "max-content", padding: 1, paddingY: 0.5 }}
                  >
                    <Typography>Texto</Typography>
                  </Paper>
                </Grid2>
                <Grid2>
                  <Avatar src={friendsFollowing[0]?.photo} />
                </Grid2>
              </Grid2>
            </Grid2>
            <Grid2 size={12} container justifyContent={"center"}>
              <Grid2 size={10}>
                <TextField name="message" fullWidth size="small" />
              </Grid2>
            </Grid2>
          </Grid2>
        </Grid2>
      </Container>
    );
}