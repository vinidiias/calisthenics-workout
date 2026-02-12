const Message = require("../Models/Message");

module.exports = {
  async create(req, res) {
    const { conversationId, senderId, receiverId, content, type } = req.body;
    try {
      const message = await Message.create({
        conversationId,
        senderId,
        receiverId,
        content,
        type: type || "text",
      });

      return res.status(201).json({ data: message, errorMessage: null });
    } catch (err) {
      return res.status(500).json({ data: null, errorMessage: err.message });
    }
  },
  async getConversationMessages(req, res) {
    const { conversationId } = req.query;

    try {
      const messages = await Message.find({ conversationId })
        .populate("senderId", "name photo")
        .sort({ timestamp: 1 });

      return res.status(200).json({ data: messages, errorMessage: null });
    } catch (err) {
      return res.status(500).json({ data: null, errorMessage: err.message });
    }
  },
  async markAsRead(req, res) {
    const { conversationId, userId } = req.body;

    try {
      await Message.updateMany(
        {
          conversationId,
          receiverId: userId,
          read: false,
        },
        { read: true },
      );

      return res.status(200).json({ data: null, errorMessage: null });
    } catch (err) {
      return res.status(500).json({ data: null, errorMessage: err.message });
    }
  },
  async getUnreadCount(req, res) {
    const { auth: userId } = req.headers;

    try {
      const count = await Message.countDocuments({
        receiverId: userId,
        read: false,
      });

      return res.status(200).json({ data: { count }, errorMessage: null });
    } catch (err) {
      return res.status(500).json({ data: null, errorMessage: err.message });
    }
  },
};
