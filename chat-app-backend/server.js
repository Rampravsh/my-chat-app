const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Express app setup
const app = express();
dotenv.config();
connectDB();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const messageRoutes = require('./routes/messageRoutes');

app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/message', messageRoutes);

const PORT = process.env.PORT || 5000;

// Create an HTTP server and pass the app
const server = app.listen(
  PORT,
  console.log(`Server running on port ${PORT}`)
);

// Socket.IO Setup
const io = require('socket.io')(server, {
  pingTimeout: 60000, // 60 seconds
  cors: {
    origin: 'http://localhost:5173', // Frontend URL
  },
});

// Socket.IO Connection Event
io.on('connection', (socket) => {
  console.log('Connected to socket.io');

  // Setup a user's socket
  socket.on('setup', (userData) => {
    socket.join(userData._id);
    socket.emit('connected');
  });

  // Join a chat room
  socket.on('join chat', (room) => {
    socket.join(room);
    
  });

  // Send a new message
  socket.on('new message', (newMessageReceived) => {
    var chat = newMessageReceived.chat;
    if (!chat.users) return console.log('Chat.users not defined');

    chat.users.forEach((user) => {
      if (user._id === newMessageReceived.sender._id) return;
      socket.in(user._id).emit('message received', newMessageReceived);
    });
  });

  // Disconnect event
  socket.off('setup', () => {
    console.log('USER DISCONNECTED');
    socket.leave(userData._id);
  });
});