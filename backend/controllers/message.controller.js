import Conversation from "../db_models/conversation.model.js";
import Message from "../db_models/message.model.js";



export const sendMessage = async (req, res) => {
    try {
        const { message } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        console.log("Sender ID:", senderId);    // Debugging
        console.log("Receiver ID:", receiverId);

        // Find existing conversation
        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] },
        });

        // If no conversation, create a new one
        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, receiverId],
            });
        }

        // Create a new message
        const newMessage = new Message({
            senderId,
            receiverId,
            message,
        });

        // Push the message ID to the conversation's messages array
        if (newMessage) {
            conversation.messages.push(newMessage._id);
        }

        // Save conversation and new message in parallel
        await Promise.all([conversation.save(), newMessage.save()]);

        // If conversation isn't found after saving (it should be found if created)
        if (!conversation) return res.status(200).json([]);

        res.status(201).json(newMessage);
    } catch (error) {
        console.error('Error in sendMessage controller:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};


export const getMessages = async (req, res) => {
    try {
        
        const {id:userTOChatId}= req.params;
        const senderId = req.user._id;
        const conversation = await Conversation.findOne({
            participants: {$all: [senderId, userTOChatId]},

        }).populate("messages")   //initailly the conversation model stored the message id's in the array so gurll i used the populate method to make it an array containg the messages instead of the message id's

        res.status(200).json(conversation.messages);

    } catch (error) {
        console.error('error in getmessage controller ',error.message);
        res.status(500).json({ error: 'internal server error' });
        
        
    }
}