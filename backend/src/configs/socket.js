import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: ["http://localhost:5173"],
});

export const getReceiverSocketId = (userId) => {
  return userSocketMap[userId];
};

const userSocketMap = {};

io.on("connection", (socket) => {
  console.log("User Connected", socket.id);

  // Store conntected users
  const userId = socket.handshake.query.userId;
  if (userId) userSocketMap[userId] = socket.id;
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // Handle typing event
  socket.on("typing", ({ receiverId }) => {
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("typing", { senderId: userId });
    }
  });

  // Handle stopTyping event
  socket.on("stopTyping", ({ receiverId }) => {
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("stopTyping", { senderId: userId });
    }
  });

  // Handle video call request (Caller -> Callee)
  socket.on("call-user", ({ receiverId }) => {
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("incoming-call", { callerId: userId });
    }
  });

  // Handle call answer (Callee -> Caller)
  socket.on("answer-call", ({ receiverId, accepted }) => {
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("call-answered", { 
        answererId: userId, 
        accepted
      });
    }
  });

  // Handle PeerJS ID readiness (Callee -> Caller)
  socket.on("peer-id-ready", ({ receiverId, peerId }) => {
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("peer-id-ready", { peerId });
    }
  });

  // Handle call end
  socket.on("end-call", ({ receiverId }) => {
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("call-ended", { enderId: userId });
    }
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, app, server };
