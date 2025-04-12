import { getReceiverSocketId, io } from "../configs/socket.js";
import Message from "../models/Message.js";
import User from "../models/User.js";

export const sendMessage = async (req, res) => {
  const { receiverId, content, fileType, filePath } = req.body;
  const {
    user: { id: userId },
    file,
  } = req;

  const message = await Message.create({
    senderId: userId,
    receiverId,
    content,
    fileType: file?.mimetype,
    filePath: file?.path,
  });

  const receiverSocketId = getReceiverSocketId(receiverId);
  if (receiverSocketId) {
    io.to(receiverSocketId).emit("message", message);
  }

  res.status(201).json({ success: true, message: message });
};

export const getMessages = async (req, res) => {
  const { contactId } = req.params;
  const {
    user: { id: userId },
  } = req;

  const messages = await Message.findAll({
    where: {
      senderId: [userId, contactId],
      receiverId: [userId, contactId],
    },
    order: [["createdAt", "ASC"]],
    include: [
      {
        model: User,
        as: "sender",
        attributes: ["id", "firstName", "lastName", "image"],
      },
      {
        model: User,
        as: "receiver",
        attributes: ["id", "firstName", "lastName", "image"],
      },
    ],
  });

  res.status(200).json({ success: true, messages: messages });
};
