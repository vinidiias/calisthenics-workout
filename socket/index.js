require('dotenv').config();
const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: [
      "https://calisthenics-workout-knqn.vercel.app",
      "http://localhost:5173",
    ],
    methods: ["GET", "POST"],
  },
});

const PORT = process.env.PORT;

app.use(express.json());

// Basic health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Socket.IO connection handling
const activeUser = new Map();

io.on('connect', (socket) => {
    socket.on('authenticate', (userId) => {
      socket.userId = userId;
      socket.join(userId);
      activeUser.set(userId, socket.id);
      console.log('userId: ' + userId + ' entrou');

      io.emit('active-users', Array.from(activeUser.keys()))
    })

    socket.on('disconnect', () => {
        if(socket.userId) {
          activeUser.delete(socket.userId);
          io.emit('active-users', Array.from(activeUser.keys()))
        }
    })

    socket.on('chat-message', (msg) => {
      console.log("message: ", msg);
      // Broadcast the message to all users in the conversation
      io.emit("receive-message", {
        conversationId: msg.conversationId,
        senderId: msg.senderId,
        content: msg.content,
        timestamp: msg.timestamp,
      });
    })
})

// Start server
httpServer.listen(PORT, () => {
  console.log(`Socket server running on port ${PORT}`);
});
