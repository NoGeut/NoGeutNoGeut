// controllers/chatController.js
"use strict";

const Message = require("../models/message");

module.exports = io => {
  io.on("connection", async client => {
    try {
      const messages = await Message.findAll({
        order: [['sendDay', 'DESC']],
        limit: 10
      });
      client.emit("load all messages", messages.reverse());
    } catch (error) {
      console.error(`Error fetching messages: ${error.message}`);
    }

    console.log("New connection");

    client.on("disconnect", () => {
      console.log("User disconnected");
    });

    client.on("message", async data => {
      try {
        const messageAttributes = {
          message: data.content,
          userName: data.userName,
          user: data.userId,
          roomNum: data.roomNum,
          senderNum: data.senderNum,
          receiverNum: data.receiverNum
        };

        const newMessage = await Message.create(messageAttributes);
        io.emit("message", newMessage);
      } catch (error) {
        console.log(`Error saving message: ${error.message}`);
      }
    });
  });
};

module.exports.renderChat = (req, res) => {
  res.render('chat'); // Ensure this renders the correct template
};
