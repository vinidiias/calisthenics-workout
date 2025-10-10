import { Avatar, Box, Container, Grid, Grid2, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, Paper, Stack, TextField, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useContext, useMemo, useState } from "react"
import { useEffect } from "react";
import api from "../../services";
import { Lens } from "@mui/icons-material";
import { UserContext } from "../../contexts/UserContext";
import { socket } from '../../services/socket/index';

export const ChatPage = ({ activeFriends }) => {
    const [friendsFollowing, setFriendsFollowing] = useState([]);
    const [selectedConversationId, setSelectedConversationId] = useState(null);
    const [conversation, setConversations] = useState([]);
    const [messages, setMessages] = useState([]);
    const [privateChatsData, setPrivateChatsData] = useState({});
    const [friendToConversationMap, setFriendToConversationMap] = useState({});
    const [messageInput, setMessageInput] = useState("");

    const { user } = useContext(UserContext);

    const theme = useTheme();

    const matches = useMediaQuery(theme.breakpoints.down("sm"));

    // inicializa conversa 1-1
    useEffect(() => {
      const initialConversations = [];
      const initialFriendMap = {};

      friendsFollowing.forEach((friend) => {
        const participantId = [user._id, friend._id].sort();
        const conversationId = `private-${participantId[0]}-${participantId[1]}`;

        initialConversations.push({
          id: conversationId,
          participants: [
            { _id: user._id, name: "Você", isOnline: true, photo: user.photo },
            friend,
          ],
          type: "private",
          name: friend.name,
          lastMessagePreview: "Nenhuma Mensagem",
          unReadCount: 0,
        });
        initialFriendMap[friend._id] = conversationId;
          // Inicializa o array de mensagens para essa conversa
      setPrivateChatsData(prev => ({ ...prev, [conversationId]: [] }));
    });

    setConversations(initialConversations);
    setFriendToConversationMap(initialFriendMap);

  }, [friendsFollowing, user._id, user.photo]);


    const selectConversation = (conversationId) => {
      setSelectedConversationId(conversationId);
      setMessages(privateChatsData[conversationId]);

      setConversations((prev) =>
        prev.map((c) =>
          c.id === conversationId ? { ...c, unReadCount: 0 } : c
        )
      );
    }
    
    const sendMessage = (content) => {
      if (!selectedConversationId || !content.trim()) return;

      const newMessage = {
        id: Math.random().toString(36).substring(7),
        senderId: user._id,
        senderName: user.name,
        content,
        timestamp: new Date().toISOString(),
        type: "text",
        read: true,
      };

      setMessages((prev) => [...prev, newMessage]);

      setPrivateChatsData((prev) => ({
        ...prev,
        [selectedConversationId]: [
          ...(prev[selectedConversationId] || []),
          newMessage,
        ],
      }));

      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === selectedConversationId
            ? { ...conv, lastMessagePreview: content }
            : conv
        )
      );

      socket.emit("chat-message", {
        conversationId: selectedConversationId,
        senderId: user._id,
        content,
        timestamp: newMessage.timestamp,
      });

      setMessageInput("");
    }

    const handleSendMessage = (e) => {
      e.preventDefault();
      sendMessage(messageInput);
    };
    
    useEffect(() => {
      const onReceiveMessage = (data) => {
        const { conversationId, senderId, content, timestamp } = data;

        if (senderId === user._id) return;

        const senderContact = friendsFollowing.find((f) => f._id === senderId);
        const senderName = senderContact ? senderContact.name : "Desconhecido";

        const receivedMessage = {
          id: Math.random().toString(36).substring(7),
          senderId,
          senderName,
          content,
          timestamp,
          type: "text",
          read: conversationId === selectedConversationId,
        };

        setPrivateChatsData((prev) => ({
          ...prev,
          [conversationId]: [...(prev[conversationId] || []), receivedMessage],
        }));

        if (conversationId === selectedConversationId) {
          setMessages((prev) => [...prev, receivedMessage]);
        } else {
          setConversations((prev) =>
            prev.map((conv) =>
              conv.id === conversationId
                ? { ...conv, unreadCount: (conv.unreadCount || 0) + 1 }
                : conv
            )
          );
        }

        setConversations((prev) =>
          prev.map((conv) =>
            conv.id === conversationId
              ? { ...conv, lastMessagePreview: content }
              : conv
          )
        );
      }
        socket.on('receive-message', onReceiveMessage);

        return () => {
          socket.off('receive-message', onReceiveMessage);
        };
    }, [selectedConversationId, user._id, friendsFollowing]);

    const selectedContact = useMemo(() => {
      if (!selectedConversationId) return null;

      const conv = conversation.find((c) => c.id === selectedConversationId);
      return conv?.participants.find((p) => p._id !== user._id);
    }, [selectedConversationId, conversation, user._id]);
    
    useEffect(() => {
      const getFollowers = async () => {
        const query = ['name', 'photo', 'biography'];
        const response = await api.get(`/user/${user._id}/followers/?filter=${query.join(',')}`);

        if (!response) return new Error(response);

        const data = await response.data;
        setFriendsFollowing(data);
      };

      getFollowers();
    }, [user._id]);

    return (
      <Container maxWidth={false} disableGutters sx={{ flex: 1 }}>
        <Grid2 container size={12} height="100%">
          <Grid2
            size={4}
            minWidth={500}
            sx={{
              backgroundColor: theme.palette.background.paper,
              color: theme.palette.text.primary,
              borderRightColor: theme.palette.divider,
              borderRightWidth: 1,
              display: { xs: "none", md: "inherit" }
            }}
          >
            <List
              dense
              disablePadding
              sx={{ backgroundColor: theme.palette.background.paper }}
            >
              {friendsFollowing.length > 0 &&
                friendsFollowing.map((friend, index) => {
                  const conversationId = friendToConversationMap[friend._id];
                  const conv = conversation.find(
                    (c) => c.id === conversationId
                  );

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
                          <Avatar
                            alt={`Avatar - {${index}}`}
                            src={friend.photo}
                          />
                        </ListItemAvatar>
                        <Box display={"flex"} flexDirection={"column"} flex={1}>
                          <Typography variant="subtitle1" fontWeight="normal">
                            {friend.name}
                          </Typography>
                          <Typography variant="subtitle2" fontWeight="light">
                            {conv?.lastMessagePreview ?? ""}
                          </Typography>
                        </Box>
                        {activeFriends && Array.isArray(activeFriends) && activeFriends.includes(friend._id) && (
                          <Lens color="success" sx={{ fontSize: 10 }} />
                        )}
                        {conv?.unreadCount && conv?.unreadCount > 0 && (
                          <ListItemText primary={conv.unreadCount} />
                        )}
                      </ListItemButton>
                    </ListItem>
                  );
                })}
            </List>
          </Grid2>
          <Grid2
            container
            size="grow"
            direction="column"
            color={theme.palette.text.primary}
            sx={{ backgroundColor: theme.palette.background.paper }}
            py={2}
            px={5}
          >
            {selectedContact ? (
              <>
                <Grid2 size={12}>
                  <Stack alignItems="center" justifyContent="center">
                    <Avatar src={selectedContact.photo} />
                    <Typography variant="h6">{selectedContact.name}</Typography>
                    <Stack direction="row" alignItems={"center"} gap={1}>
                      {activeFriends && Array.isArray(activeFriends) && activeFriends.includes(selectedContact._id) && (
                        <Lens color="success" sx={{ fontSize: 10 }} />
                      )}
                      <Typography>
                        {activeFriends && Array.isArray(activeFriends) && activeFriends.includes(selectedContact._id)
                          ? "online"
                          : "offline"}
                      </Typography>
                    </Stack>
                  </Stack>
                </Grid2>
                <Grid2
                  container
                  flex={1}
                  size={12}
                  marginTop={2}
                  sx={{ overflowY: "auto", flexDirection: "column" }}
                >
                  {messages && messages.length > 0 ? (
                    messages.map((msg, index) => {
                      const isMyMessage = msg.senderId === user._id;
                      return (
                        <Grid2
                          key={msg.id || index}
                          container
                          spacing={1}
                          sx={{
                            justifyContent: isMyMessage
                              ? "flex-end"
                              : "flex-start",
                            marginBottom: 1,
                          }}
                        >
                          {!isMyMessage && (
                            <Grid2>
                              <Avatar src={selectedContact.photo} />
                            </Grid2>
                          )}
                          <Grid2>
                            <Paper
                              sx={{
                                width: "max-content",
                                maxWidth: "400px",
                                padding: 1,
                                paddingY: 0.5,
                                backgroundColor: isMyMessage
                                  ? theme.palette.primary.main
                                  : theme.palette.background.default,
                                color: isMyMessage
                                  ? theme.palette.primary.contrastText
                                  : theme.palette.text.primary,
                              }}
                            >
                              <Typography>{msg.content}</Typography>
                              <Typography
                                variant="caption"
                                sx={{ fontSize: "0.65rem", opacity: 0.7 }}
                              >
                                {new Date(msg.timestamp).toLocaleTimeString(
                                  "pt-BR",
                                  {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  }
                                )}
                              </Typography>
                            </Paper>
                          </Grid2>
                          {isMyMessage && (
                            <Grid2>
                              <Avatar src={user.photo} />
                            </Grid2>
                          )}
                        </Grid2>
                      );
                    })
                  ) : (
                    <Grid2
                      size={12}
                      container
                      justifyContent="center"
                      alignItems="center"
                      flex={1}
                    >
                      <Typography textAlign="center">
                        Inicie uma conversa
                      </Typography>
                    </Grid2>
                  )}
                </Grid2>
                <Grid2 size={12} container justifyContent={"center"}>
                  <Grid2 size={10}>
                    <form onSubmit={handleSendMessage}>
                      <TextField
                        name="message"
                        fullWidth
                        size="small"
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        placeholder="Digite uma mensagem..."
                      />
                    </form>
                  </Grid2>
                </Grid2>
              </>
            ) : (
              <Grid2
                size={12}
                container
                flex={1}
                justifyContent={"center"}
                alignItems={"center"}
              >
                <Grid2>
                  <Typography>Selecione uma conversa</Typography>
                </Grid2>
              </Grid2>
            )}
          </Grid2>
        </Grid2>
      </Container>
    );
}