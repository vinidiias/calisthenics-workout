require('dotenv').config();
const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const Message = require('./models/Message');

const app = express();
const httpServer = createServer(app);

const PORT = process.env.PORT || 5000;
const dbUri = process.env.DB_URI;

// Connect to MongoDB with better timeout settings
mongoose
  .connect(dbUri, {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  })
  .then(() => {
    console.log('Socket server connected to database');
  })
  .catch((err) => {
    console.error('Database connection error:', err);
    console.error('DB_URI:', dbUri ? 'configured' : 'missing');
  });

// Handle MongoDB connection events
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

mongoose.connection.on('reconnected', () => {
  console.log('MongoDB reconnected');
});

// Initialize Socket.IO with Vercel-compatible configuration
const io = new Server(httpServer, {
  cors: {
    origin: [
      "http://localhost:5173",                          // Desenvolvimento
      "https://calisthenics-workout-knqn.vercel.app"   // Produção
    ],
    methods: ["GET", "POST", "OPTIONS"],
    credentials: true 
  },
});

app.use((req, res, next) => {
  const allowedOrigins = [
    "https://calisthenics-workout-knqn.vercel.app",
    "http://localhost:5173"
  ];

  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  next();
});

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

    socket.on('chat-message', async (msg) => {
      try {
        // Check if database is connected
        if (mongoose.connection.readyState !== 1) {
          console.error('Database not connected. Message not saved.');
          // Still broadcast the message for real-time functionality
          io.emit("receive-message", {
            conversationId: msg.conversationId,
            senderId: msg.senderId,
            content: msg.content,
            timestamp: msg.timestamp || new Date(),
          });
          return;
        }

        // Save message to database
        const message = await Message.create({
          conversationId: msg.conversationId,
          senderId: msg.senderId,
          receiverId: msg.receiverId,
          content: msg.content,
          timestamp: msg.timestamp || new Date()
        });

        console.log('Message saved:', message._id)

        // Broadcast the message to all users in the conversation
        io.emit("receive-message", {
          _id: message._id,
          conversationId: msg.conversationId,
          senderId: msg.senderId,
          content: msg.content,
          timestamp: message.timestamp,
        });
      } catch(error) {
        console.error('Error saving message:', error);
        // Still broadcast the message for real-time functionality
        io.emit("receive-message", {
          conversationId: msg.conversationId,
          senderId: msg.senderId,
          content: msg.content,
          timestamp: msg.timestamp || new Date(),
        });
      }
    })
})

httpServer.listen(PORT, () => console.log(`Socket server running on port ${PORT}`));
