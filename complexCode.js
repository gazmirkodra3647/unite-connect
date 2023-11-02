// filename: complexCode.js

/* 
This code is a complex implementation of a chatroom application. 
It includes advanced features such as user authentication, real-time messaging, notifications, and more.
*/

// Constants
const SERVER_PORT = 3000;
const MAX_USERS_LIMIT = 100;

// Dependencies
const express = require('express');
const bodyParser = require('body-parser');
const socketIO = require('socket.io');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Express App Initialization
const app = express();
app.use(bodyParser.json());

// Users Database
const users = [];
const messages = [];

// Express Routes
app.post('/register', (req, res) => {
  const { username, password } = req.body;

  // Check if username is already taken
  if (users.some(user => user.username === username)) {
    return res.status(409).json({ message: 'Username already taken' });
  }

  // Encrypt password
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }

    // Create user and store it in the database
    const user = { username, password: hashedPassword };
    users.push(user);

    res.status(201).json({ message: 'User registered successfully' });
  });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Find user in database
  const user = users.find(user => user.username === username);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Compare passwords
  bcrypt.compare(password, user.password, (err, isValid) => {
    if (err) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }

    if (!isValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate a token
    const token = jwt.sign({ username }, 'secretkey');

    res.status(200).json({ message: 'User logged in successfully', token });
  });
});

// Start Express Server
const server = app.listen(SERVER_PORT, () => {
  console.log(`Server running on port ${SERVER_PORT}`);
});

// Socket.IO Initialization
const io = socketIO(server);

// Socket.IO Connection Events
io.on('connection', socket => {
  console.log('New client connected');

  socket.on('join', ({ username }) => {
    console.log(`User '${username}' joined the chatroom`);

    // Send user list to the connected client
    socket.emit('userList', users.map(user => user.username));

    // Send chat history to the connected client
    socket.emit('chatHistory', messages);

    // Broadcast a new user joined event to all connected clients
    socket.broadcast.emit('newUser', username);
  });

  socket.on('message', ({ username, text }) => {
    console.log(`New message from '${username}': ${text}`);

    // Create a new message object
    const message = { username, text };
    messages.push(message);

    // Broadcast the new message to all connected clients
    io.emit('newMessage', message);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

/* 
  ... Additional complex and sophisticated code can be added here ...
*/