const DoctorChat = require("../Models/chatModel");
const User = require("../Models/usersAuthModel");
const { Doctor } = require("../Models/doctorModel");
const mongoose = require("mongoose");
const { StatusCodes } = require('http-status-codes');




const sendMessage = async (req, res) => {
    try {
        const { sender, receiver, content } = req.body;

        if (!mongoose.Types.ObjectId.isValid(sender) || !mongoose.Types.ObjectId.isValid(receiver)) {
            return res.status(StatusCodes.BAD_REQUEST).json({ status: StatusCodes.BAD_REQUEST, message: "Invalid sender or receiver ID" });
        }

        const senderUser = await User.findById(sender);
        const receiverUser = await User.findById(receiver);
        const senderDoctor = await Doctor.findById(sender);
        const receiverDoctor = await Doctor.findById(receiver);

        if (!(senderUser || senderDoctor)) {
            return res.status(StatusCodes.CONFLICT).json({ status: StatusCodes.CONFLICT, message: "Sender not found" });
        }

        if (!(receiverUser || receiverDoctor)) {
            return res.status(StatusCodes.CONFLICT).json({ status: StatusCodes.CONFLICT, message: "Receiver not found" });
        }

        const newMessage = await DoctorChat.create({ sender, receiver, content });
        res.status(StatusCodes.CREATED).json({
            message: "Message sent successfully",
            data: newMessage,
        });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            error: error.message,
        });
    }
};


const getConversation = async (req, res) => {
    try {
        const { user1, user2 } = req.params;
        const messages = await DoctorChat.find({
            $or: [
                { sender: user1, receiver: user2 },
                { sender: user2, receiver: user1 },
            ],
        }).sort({ createdAt: 1 }).populate([
            {
                path: 'sender',
                select: 'firstname lastname userspicture',
                model: 'User',
            },
            {
                path: 'receiver',
                select: 'doctorname doctorspicture',
                model: 'Doctor',
            },
        ]);

        res.status(StatusCodes.OK).json({
            message: "Conversation retrieved successfully",
            data: messages,
        });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            error: error.message,
        });
    }
};


const updateMessage = async (req, res) => {
    try {
        const { messageId } = req.params;
        const { content } = req.body;

        const updatedMessage = await DoctorChat.findByIdAndUpdate(
            messageId,
            { content },
            { new: true }
        );

        if (!updatedMessage) {
            return res.status(StatusCodes.NOT_FOUND).json({
                status: StatusCodes.NOT_FOUND,
                message: "Message not found",
            });
        }

        res.status(StatusCodes.OK).json({
            status: StatusCodes.OK,
            message: "Message updated successfully",
            data: updatedMessage,
        });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            error: error.message,
        });
    }
};


const deleteMessage = async (req, res) => {
    try {
        const { messageId } = req.params;

        const deletedMessage = await DoctorChat.findByIdAndDelete(messageId);

        if (!deletedMessage) {
            return res.status(StatusCodes.NOT_FOUND).json({
                status: StatusCodes.NOT_FOUND,
                message: "Message not found",
            });
        }

        res.status(StatusCodes.OK).json({
            status: StatusCodes.OK,
            message: "Message deleted successfully",
        });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            error: error.message,
        });
    }
};


const markAsRead = async (req, res) => {
    try {
        const { messageId } = req.params;

        const updatedMessage = await DoctorChat.findByIdAndUpdate(
            messageId,
            { isRead: true },
            { new: true }
        );

        if (!updatedMessage) {
            return res.status(StatusCodes.NOT_FOUND).json({
                status: StatusCodes.NOT_FOUND,
                message: "Message not found",
            });
        }

        res.status(StatusCodes.OK).json({
            status: StatusCodes.OK,
            message: "Message marked as read",
            data: updatedMessage,
        });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            error: error.message,
        });
    }
};


const getUnreadMessagesCount = async (req, res) => {
    try {
        const { userId } = req.params;

        const unreadCount = await DoctorChat.countDocuments({
            receiver: userId,
            isRead: false,
        });

        res.status(StatusCodes.OK).json({
            status: StatusCodes.OK,
            message: "Unread messages count retrieved successfully",
            data: unreadCount,
        });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            error: error.message,
        });
    }
};




module.exports = {
    sendMessage,
    getConversation,
    updateMessage,
    deleteMessage,
    markAsRead,
    getUnreadMessagesCount,
};


