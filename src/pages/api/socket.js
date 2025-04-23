import { Server } from 'socket.io';

export default function handler(req, res) {
  // Check if socket.io server is already running
  if (!res.socket.server.io) {
    console.log('Initializing Socket.io server...');
    const io = new Server(res.socket.server, {
      path: '/api/socket', // optional: customize the socket.io path
      cors: {
        origin: '*', // adjust according to your security requirements
      },
    });

    // Attach your socket events
    io.on('connection', (socket) => {
      console.log('a user connected');
      
      socket.on('join-room', (data) => {
        const { roomId, email } = data;
        console.log('user', email, 'joined room', roomId);
        // Emit to all others in the room that a user has joined
        socket.to(roomId).emit('user-joined', { email, id: socket.id });
        socket.join(roomId);
        io.to(socket.id).emit("join-room", data);

      });

      socket.on('call-user', ({ to, offer }) => {
        io.to(to).emit('incoming-call', { from: socket.id, offer });
      });

      socket.on('call-accepted', ({ to, ans }) => {
        io.to(to).emit('call-accepted', { from: socket.id, ans });
      });

      socket.on('peer-nego-needed', ({ to, offer }) => {
        io.to(to).emit('peer-nego-needed', { from: socket.id, offer });
      });

      socket.on('peer-nego-done', ({ to, ans }) => {
        io.to(to).emit('peer-nego-final', { from: socket.id, ans });
      });
    });

    // Save the io instance to avoid reinitialization
    res.socket.server.io = io;
  } else {
    console.log('Socket.io server already running.');
  }
  res.end();
}

// Disable default body parsing (optional but sometimes needed for WebSockets)
export const config = {
  api: {
    bodyParser: false,
  },
};
