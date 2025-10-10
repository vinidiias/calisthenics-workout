import { Lens } from "@mui/icons-material";
import {
  Avatar,
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Typography,
  useTheme,
} from "@mui/material";

export const FriendListChat = ({
  friendsFollowing,
  friendToConversationMap,
  conversation,
  selectConversation,
  activeFriends,
}) => {
  const theme = useTheme();

  return (
    <List
      dense
      disablePadding
      sx={{ backgroundColor: theme.palette.background.paper }}
    >
      {friendsFollowing.length > 0 &&
        friendsFollowing.map((friend, index) => {
          const conversationId = friendToConversationMap[friend._id];
          const conv = conversation.find((c) => c.id === conversationId);

          return (
            <ListItem
              key={`${friend.name} - ${index}`}
              disableGutters
              sx={{
                paddingLeft: 5,
                borderBottom: 1,
                borderColor: theme.palette.divider,
              }}
            >
              <ListItemButton
                onClick={() => selectConversation(conversationId)}
              >
                <ListItemAvatar>
                  <Avatar alt={`Avatar - {${index}}`} src={friend.photo} />
                </ListItemAvatar>
                <Box>
                  <Typography variant="subtitle1" fontWeight="normal">
                    {friend.name}
                  </Typography>
                  <Typography variant="subtitle2" fontWeight="light">
                    {conv?.lastMessagePreview ?? ""}
                  </Typography>
                </Box>
                {conv?.unreadCount && conv?.unreadCount > 0 && (
                  <ListItemText
                    primary={
                      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "end" }}>
                        {activeFriends &&
                          Array.isArray(activeFriends) &&
                          activeFriends.includes(friend._id) && (
                            <Lens color="success" sx={{ fontSize: 10 }} />
                          )}
                        {conv.unreadCount}
                      </Box>
                    }
                  />
                )}
              </ListItemButton>
            </ListItem>
          );
        })}
    </List>
  );
};
