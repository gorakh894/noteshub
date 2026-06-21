const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const StudyGroup = require('../models/StudyGroup');

let io;

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  // Auth middleware for socket
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication required'));
      }
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('name avatar role');
      if (!user) return next(new Error('User not found'));
      socket.user = user;
      next();
    } catch (err) {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`🔌 User connected: ${socket.user.name} (${socket.id})`);

    // Join user's personal room for notifications
    socket.join(`user:${socket.user._id}`);

    // Join a study group room
    socket.on('join_group', async (groupId) => {
      try {
        const group = await StudyGroup.findById(groupId);
        if (!group) return;

        const isMember = group.members.some(m => m.user.toString() === socket.user._id.toString());
        if (!isMember) return socket.emit('error', { message: 'Not a group member' });

        socket.join(`group:${groupId}`);
        socket.to(`group:${groupId}`).emit('user_joined', {
          user: { _id: socket.user._id, name: socket.user.name, avatar: socket.user.avatar }
        });
        socket.emit('joined_group', { groupId });
      } catch (err) {
        socket.emit('error', { message: 'Failed to join group' });
      }
    });

    // Leave group
    socket.on('leave_group', (groupId) => {
      socket.leave(`group:${groupId}`);
      socket.to(`group:${groupId}`).emit('user_left', {
        user: { _id: socket.user._id, name: socket.user.name }
      });
    });

    // Send message to group
    socket.on('group_message', async ({ groupId, content, type = 'text' }) => {
      try {
        if (!content || content.trim().length === 0) return;

        const group = await StudyGroup.findById(groupId);
        if (!group) return;

        const isMember = group.members.some(m => m.user.toString() === socket.user._id.toString());
        if (!isMember) return socket.emit('error', { message: 'Not a group member' });

        const message = {
          sender: socket.user._id,
          content: content.trim(),
          type,
          createdAt: new Date()
        };

        group.messages.push(message);
        // Keep only last 200 messages in DB
        if (group.messages.length > 200) {
          group.messages = group.messages.slice(-200);
        }
        await group.save({ validateBeforeSave: false });

        const messageToSend = {
          ...message,
          _id: group.messages[group.messages.length - 1]._id,
          sender: {
            _id: socket.user._id,
            name: socket.user.name,
            avatar: socket.user.avatar
          }
        };

        io.to(`group:${groupId}`).emit('new_message', { groupId, message: messageToSend });
      } catch (err) {
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Typing indicator
    socket.on('typing', ({ groupId }) => {
      socket.to(`group:${groupId}`).emit('user_typing', {
        user: { _id: socket.user._id, name: socket.user.name }
      });
    });

    socket.on('stop_typing', ({ groupId }) => {
      socket.to(`group:${groupId}`).emit('user_stop_typing', { userId: socket.user._id });
    });

    socket.on('disconnect', () => {
      console.log(`🔌 User disconnected: ${socket.user.name}`);
    });
  });

  return io;
};

const getIO = () => {
  if (!io) throw new Error('Socket.IO not initialized');
  return io;
};

// Send notification via socket
const sendNotification = (userId, notification) => {
  if (io) {
    io.to(`user:${userId}`).emit('notification', notification);
  }
};

module.exports = { initSocket, getIO, sendNotification };
