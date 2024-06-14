const express = require("express");
const { ManageMessages } = require("../domain/messageCotroller");

const routeMessage = express.Router()
const manageMessage = new ManageMessages()
routeMessage.post('/send/messages',(req, res)=>{
    return manageMessage.sendMessageToMail(req, res)
})

module.exports = routeMessage