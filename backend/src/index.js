const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const { createServer } = require("node:http");
const { v4 } = require("uuid");
const { S3Client } = require("@aws-sdk/client-s3");
const multerS3 = require("multer-s3");
const { Server } = require("socket.io");
require("dotenv").config();

const s3 = new S3Client({
  region: "us-east-2",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const upload = multer({
  storage: multerS3({
    s3,
    bucket: "myphotos-outdoor-gym",
    key(req, file, callback) {
      callback(null, v4() + path.extname(file.originalname));
    },
  }),
});

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});

io.listen(4000);

const PORT = process.env.PORT;
const dbUri = process.env.DB_URI;
const router = require("./Routes/Router");

mongoose
  .connect(dbUri)
  .then((res) => {
    console.log("Connected to database");
  })
  .catch((err) => console.error(err));

const allowedOrigins = [
  "http://localhost:5173",
  "https://calisthenics-workout-knqn.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (allowedOrigins.includes(origin) || !origin) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "auth", "id"],
    credentials: true,
  })
);

app.use(express.json());

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
      socket.client()
        console.log('message: ', msg)
    })
})

app.post("/file", upload.single("photo"), (req, res) => {
  return res.status(201).send(req.file.location);
});

app.use(router);

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
