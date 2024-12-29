import Conversation from "../db_models/conversation.model.js";
import Message from "../db_models/message.model.js";


export const sendMessage = async (req, res) =>{
    try {
        const {message} = req.body;
        const {id : receiverId} = req.params;
        const senderId = req.user._id;

        console.log("Sender ID:", senderId);    //i added them becuz i was debugging
        console.log("Receiver ID:", receiverId);

        let conversation = await Conversation.findOne({
            participants: {$all: [senderId, receiverId]},

        })

        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, receiverId],
            });
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            message,
        })
        

        if(newMessage){
            conversation.messages.push(newMessage._id);
            
        }

        //socket.io fuctionality has to be added

        // await conversation.save();
        // await newMessage.save();
        await Promise.all(conversation.save(), newMessage.save());  //to make these run in parallel 

        if(!conversation) return res.status(200).json([]);
        
        res.status(201).json(newMessage);

    } catch (error) {
        console.error('error in sendmessage controller ',error.message);
        res.status(500).json({ error: 'internal server error' });
        
    }
}

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