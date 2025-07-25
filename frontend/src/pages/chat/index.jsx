import { Avatar, Container, Grid, Grid2, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, TextField } from "@mui/material";
import { useState } from "react"
import { useEffect } from "react";
import api from "../../services";
import { Lens } from "@mui/icons-material";

export const ChatPage = ({ activeFriends, userId }) => {
    const [friendsFollowing, setFriendsFollowing] = useState([]);
    
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
          <Grid2 size={3}>
            <List
              dense
              disablePadding
              sx={{
                height: "100%",
                borderRight: "1px solid #E8E9EB",
                bgcolor: "snow",
              }}
            >
              {friendsFollowing.length > 0 &&
                friendsFollowing.map((friend, index) => (
                  <ListItem
                    disableGutters
                    sx={{ paddingLeft: 5 }}
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
          <Grid2 container size='grow' direction='column'>
            <Grid2 container flex={1} size={12}>
              <Grid2 size="grow" textAlign="start" marginLeft={10}>texte</Grid2>
              <Grid2 size="grow" textAlign="end" marginRight={10}>texte</Grid2>
            </Grid2>
            <Grid2 size={12}>
              <TextField name="message" />
            </Grid2>
          </Grid2>
        </Grid2>
      </Container>
    );
}