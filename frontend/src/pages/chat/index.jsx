import { useContext, useMemo, useState, useEffect } from "react";
// MATERIAL UI
import {
  Box,
  Container,
  Grid2,
  IconButton,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
// COMPONENTS
import { FriendListChat } from "../../components/pages/chat/FriendListChat";
import { Message } from "../../components/pages/chat/Message";
import { HeaderInformationFriend } from "../../components/pages/chat/HeaderInformationFriend";
// API
import api from "../../services";
// CONTEXT
import { UserContext } from "../../contexts/UserContext";
// SOCKET
import { socket } from "../../services/socket/index";
// ICONS
import SendIcon from "@mui/icons-material/Send";

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

  const matches = useMediaQuery(theme.breakpoints.down("md"));

  const selectedContact = useMemo(() => {
    if (!selectedConversationId) return null;

    const conv = conversation.find((c) => c.id === selectedConversationId);
    return conv?.participants.find((p) => p._id !== user._id);
  }, [selectedConversationId, conversation, user._id]);

  const selectConversation = (conversationId) => {
    setSelectedConversationId(conversationId);
    setMessages(privateChatsData[conversationId]);

    setConversations((prev) =>
      prev.map((c) => (c.id === conversationId ? { ...c, unReadCount: 0 } : c)),
    );
  };

  const sendMessage = (content) => {
    if (!selectedConversationId || !content.trim()) return;

    const receiverId = selectedContact._id;

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
          : conv,
      ),
    );

    socket.emit("chat-message", {
      conversationId: selectedConversationId,
      senderId: user._id,
      receiverId: receiverId,
      content,
      timestamp: newMessage.timestamp,
    });

    setMessageInput("");
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    sendMessage(messageInput);
  };

  const handleCloseChat = () => {
    setSelectedConversationId(null);
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
              : conv,
          ),
        );
      }

      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === conversationId
            ? { ...conv, lastMessagePreview: content }
            : conv,
        ),
      );
    };
    socket.on("receive-message", onReceiveMessage);

    return () => {
      socket.off("receive-message", onReceiveMessage);
    };
  }, [selectedConversationId, user._id, friendsFollowing]);

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
      setPrivateChatsData((prev) => ({ ...prev, [conversationId]: [] }));
    });

    setConversations(initialConversations);
    setFriendToConversationMap(initialFriendMap);
  }, [friendsFollowing, user._id, user.photo]);

  useEffect(() => {
    const loadMessages = async () => {
      if (!selectedConversationId) return;

      try {
        const response = await api.get(`/message/${selectedConversationId}`);
        const dbMessages = response.data.map((msg) => ({
          id: msg._id,
          senderId: msg.senderId._id,
          senderName: msg.senderId.name,
          content: msg.content,
          timestamp: msg.timestamp,
          type: msg.type || "text",
          read: msg.read,
        }));

        setMessages(dbMessages);
        setPrivateChatsData((prev) => ({
          ...prev,
          [selectedConversationId]: dbMessages,
        }));

        // Mark messages as read
        await api.patch("/message/read", {
          conversationId: selectedConversationId,
          userId: user._id,
        });
      } catch (error) {
        console.error("Error loading messages:", error);
      }
    };

    loadMessages();
  }, [selectedConversationId, user._id]);

  useEffect(() => {
    const getFollowers = async () => {
      const query = ["name", "photo", "biography"];
      const response = await api.get(
        `/user/${user._id}/followers/?filter=${query.join(",")}`,
      );

      if (!response) return new Error(response);

      const data = await response.data;
      setFriendsFollowing(data);
    };

    getFollowers();
  }, [user._id]);

  return (
    <Container maxWidth={false} disableGutters sx={{ flex: 1 }}>
      <Grid2 container size={12} height="100%">
        {((matches && selectedConversationId === null) || !matches) && (
          <Grid2
            size={{ xs: 12, md: 5, lg: 4 }}
            sx={{
              backgroundColor: theme.palette.background.paper,
              color: theme.palette.text.primary,
              borderRightColor: theme.palette.divider,
              borderRightWidth: 1,
            }}
          >
            <FriendListChat
              activeFriends={activeFriends}
              conversation={conversation}
              friendToConversationMap={friendToConversationMap}
              friendsFollowing={friendsFollowing}
              selectConversation={selectConversation}
            />
          </Grid2>
        )}
        {((matches && selectedConversationId !== null) || !matches) && (
          <Grid2
            container
            size={{ xs: 12, md: 7, lg: 8 }}
            direction="column"
            color={theme.palette.text.primary}
            sx={{ backgroundColor: theme.palette.background.paper }}
            py={2}
            px={5}
          >
            {selectedContact ? (
              <>
                <HeaderInformationFriend
                  selectedContact={selectedContact}
                  isActive={
                    activeFriends &&
                    Array.isArray(activeFriends) &&
                    activeFriends.includes(selectedContact._id)
                  }
                  handleClose={handleCloseChat}
                />
                <Grid2
                  container
                  flex={1}
                  size={12}
                  marginTop={2}
                  spacing={2}
                  sx={{ overflowY: "auto", flexDirection: "column" }}
                >
                  {messages && messages.length > 0 ? (
                    messages.map((msg, index) => {
                      const isMyMessage = msg.senderId === user._id;
                      return (
                        <Message
                          key={`msg - ${index}`}
                          msg={msg}
                          isMyMessage={isMyMessage}
                          selectedContact={selectedContact}
                          photo={user.photo}
                        />
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
                  <Grid2 size={12}>
                    <form onSubmit={handleSendMessage}>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <TextField
                          name="message"
                          fullWidth
                          size="small"
                          value={messageInput}
                          onChange={(e) => setMessageInput(e.target.value)}
                          placeholder="Digite uma mensagem..."
                        />
                        <IconButton onClick={handleSendMessage}>
                          <SendIcon color="primary" />
                        </IconButton>
                      </Box>
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
        )}
      </Grid2>
    </Container>
  );
};
