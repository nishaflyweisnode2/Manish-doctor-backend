const express = require("express");
const router = express.Router();
const chatController = require("../Controllers/chatController");


const { verifyToken, verifyTokenwithAuthorization, verifyTokenwithAdmin } = require("../Middlewares/verifyToken");





router.post("/doctor/send", verifyToken, chatController.sendMessage);
router.get("/doctor/conversation/:user1/:user2", verifyToken, chatController.getConversation);
router.put('/update-message/:messageId', verifyToken, chatController.updateMessage);
router.delete('/delete-message/:messageId', verifyToken, chatController.deleteMessage);
router.put('/mark-as-read/:messageId', verifyToken, chatController.markAsRead);
router.get('/unread-messages-count/:userId', verifyToken, chatController.getUnreadMessagesCount);



module.exports = router;
