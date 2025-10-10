# Calisthenics Workout - Socket Server

Real-time WebSocket server for the Calisthenics Workout application using Socket.IO and Express.

## Features

- Real-time bidirectional communication
- Room-based messaging for group interactions
- CORS configured for production and local development
- Health check endpoint for monitoring
- Environment variable configuration

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## Installation

Install dependencies:

```bash
npm install
```

## Environment Variables

Create a `.env` file in the root directory (already configured):

```env
PORT=4000
```

## Available Scripts

### `npm start`
Starts the server in production mode.

### `npm run dev`
Starts the server in development mode with auto-reload (requires nodemon).

## API Endpoints

### Health Check
- **GET** `/health`
- Returns server status and timestamp
- Response: `{ status: 'ok', timestamp: '2024-01-01T00:00:00.000Z' }`

## Socket Events

### Client → Server

| Event | Payload | Description |
|-------|---------|-------------|
| `message` | `any` | Send a message to all other connected clients |
| `join-room` | `string` (roomId) | Join a specific room |
| `leave-room` | `string` (roomId) | Leave a specific room |
| `room-message` | `{ roomId: string, message: any }` | Send message to a specific room |

### Server → Client

| Event | Payload | Description |
|-------|---------|-------------|
| `message` | `any` | Broadcast message from another client |
| `user-joined` | `string` (socketId) | User joined the room |
| `user-left` | `string` (socketId) | User left the room |
| `room-message` | `{ socketId: string, message: any, timestamp: string }` | Message from room |

## CORS Configuration

Allowed origins:
- `https://calisthenics-workout-knqn.vercel.app` (Production)
- `http://localhost:5173` (Local development)

## Running the Server

Development mode with auto-reload:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will start on port 4000 (or the PORT specified in `.env`).

## Project Structure

```
socket/
├── index.js          # Main server file
├── package.json      # Project dependencies and scripts
├── .env             # Environment variables
├── .gitignore       # Git ignore rules
└── README.md        # This file
```

## Connection Example

### JavaScript Client

```javascript
import io from 'socket.io-client';

const socket = io('http://localhost:4000');

socket.on('connect', () => {
  console.log('Connected:', socket.id);
});

// Join a room
socket.emit('join-room', 'workout-room-123');

// Send message to room
socket.emit('room-message', {
  roomId: 'workout-room-123',
  message: 'Hello everyone!'
});

// Listen for room messages
socket.on('room-message', (data) => {
  console.log('Message:', data);
});
```

## License

ISC
