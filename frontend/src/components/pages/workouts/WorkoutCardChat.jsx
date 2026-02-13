import {
  Avatar,
  AvatarGroup,
  Box,
  Divider,
  Typography,
} from "@mui/material";
import { useContext, useEffect, useRef, useState } from "react";
import { SendInput } from "../../ui/inputs/SendInput";
import { UserContext } from "../../../contexts/UserContext";
import { socket } from "../../../services/socket";
import { fetchMessages, patchMarkMessageAsRead } from "../../../services/messageApi";
import { createWorkoutComment } from "../../../services/workoutApi";
import { Message } from "../chat/Message";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useResponseNotifier } from "../../../hooks/useResponseNotifier";

export const WorkoutCardChat = ({ participants, workout_id }) => {
  const [messageInput, setMessageInput] = useState("");
  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState(null);

  const messagesEndRef = useRef(null);

  const { user } = useContext(UserContext);
  const { handleErrorResponse } = useResponseNotifier();

  const queryClient = useQueryClient();

  const { mutateAsync: handleCreateWorkoutComment } = useMutation({
    mutationFn: createWorkoutComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workouts"] })
    },
    onError: (resp) => handleErrorResponse(resp.response.data),
  });

  const sendMessage = (content) => {
    if (!conversationId || !content.trim()) return;

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

    socket.emit("chat-message", {
      conversationId: conversationId,
      senderId: user._id,
      receiverId: conversationId,
      content,
      timestamp: newMessage.timestamp,
    });

    handleCreateWorkoutComment({
      workoutId: workout_id,
      user_id: user._id,
      comment: content,
    });

    setMessageInput("");
  };

  useEffect(() => {
    const onReceiveMessage = (data) => {
      const { conversationId, senderId, content, timestamp } = data;

      if (senderId === user._id) return;

      const senderContact = participants?.find((p) => p?._id === senderId);
      const senderName = senderContact ? senderContact?.name : "Unknown";

      const receivedMessage = {
        id: Math.random().toString(36).substring(7),
        senderId,
        senderName,
        content,
        timestamp,
        type: "text",
        read: conversationId === conversationId,
      };

      setMessages((prev) => [...prev, receivedMessage]);
    };
    socket.on("receive-message", onReceiveMessage);
    return () => socket.off("receive-message", onReceiveMessage);
  }, [conversationId, user._id, participants])

  useEffect(() => {
    const loadMessage = async () => {
      if (!conversationId) return;

      try {
        const response = await fetchMessages(conversationId);
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
        patchMarkMessageAsRead(conversationId, user._id);
      } catch (error) {
        console.error("Error loading messages:", error);
      }
    };

    loadMessage();
  }, [conversationId, user._id]);

  useEffect(() => {
    if (workout_id) {
      setConversationId(workout_id);
    }
  }, [workout_id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    sendMessage(messageInput);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: 250, maxHeight: 400 }}>
      <Box sx={{ display: "flex", justifyContent: "start", px: 2, py: 1 }}>
        {participants && participants.length > 0 && (
          <AvatarGroup max={10} spacing="medium">
            {participants.map((p) => (
              <Avatar
                key={p?._id}
                src={p?.photo}
                alt={p?._id}
                sx={{ width: 25, height: 25 }}
              />
            ))}
          </AvatarGroup>
        )}
      </Box>
      <Divider />
      <Box sx={{ flexGrow: 1, p: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 1 }}>
        {messages && messages.length > 0 ? (
          messages.map((msg, index) => {
            const isMyMessage = msg.senderId === user._id;
            const senderParticipant = participants?.find((p) => p?._id === msg.senderId);
            return (
              <Message
                key={msg.id || index}
                msg={msg}
                isMyMessage={isMyMessage}
                name={msg?.senderName}
                selectedContact={senderParticipant || { photo: "", name: msg.senderName }}
                photo={user.photo}
              />
            );
          })
        ) : (
          <Box sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Typography variant="body2" color="text.secondary">
              No messages
            </Typography>
          </Box>
        )}
        <div ref={messagesEndRef} />
      </Box>
      <Box sx={{ p: 1 }}>
        <SendInput
          placeholder="Send message"
          size="small"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          onClick={handleSendMessage}
          onKeyDown={handleKeyDown}
        />
      </Box>
    </Box>
  );
};
