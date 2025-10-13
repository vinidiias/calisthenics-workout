const Message = require('../Models/Message')

module.exports = {
    async create(req, res) {
        const { conversationId, senderId, receiverId, content, type } = req.body
        try {
            const message = await Message.create({
                conversationId,
                senderId,
                receiverId,
                content,
                type: type || 'text'
            })

            return res.status(201).send(message)
        } catch(err) {
            return res.status(500).send({ error: err.message })
        }
    },
    async getConversationMessages(req, res) {
        const { conversationId } = req.params

        try {
            const messages = await Message.find({ conversationId })
                .populate('senderId', 'name photo')
                .sort({ timestamp: 1 })

            return res.status(200).send(messages)
        } catch(err) {
            return res.status(500).send({ error: err.message })
        }
    },
    async markAsRead(req, res) {
        const { conversationId, userId } = req.body

        try {
            await Message.updateMany(
                {
                    conversationId,
                    receiverId: userId,
                    read: false
                },
                { read: true }
            )

            return res.status(200).send({ message: 'Messages marked as read' })
        } catch(err) {
            return res.status(500).send({ error: err.message })
        }
    },
    async getUnreadCount(req, res) {
        const { userId } = req.params

        try {
            const count = await Message.countDocuments({
                receiverId: userId,
                read: false
            })

            return res.status(200).send({ count })
        } catch(err) {
            return res.status(500).send({ error: err.message })
        }
    }
}
