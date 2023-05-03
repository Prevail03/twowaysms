const express = require("express");
const sql = require('mssql');
const session = require('express-session');
const options = require('./env.js');
const config = require('./dbconnect.js');
const register = require('./src/register.js');
const account = require('./src/account.js');
const AfricasTalking = require('africastalking')(options);
const app = express();
const keyword1 = "Test4 ";
const bodyParser = require("body-parser");
const { urlencoded } = require("express");
app.use(bodyParser.json());
app.use(session({secret: 'octagonafrica'}));
app.listen(3000, function() {
    console.log("Started at localhost 3000");
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//funtions import
const handleIncomingMessage = require('./src/functions/incomingmessage.js');
app.post("/webhook", (req, res) => {
    const payload = req.body;
    const sender = payload.from;
    const textId =payload.id;
    const phoneNumber=sender;
    console.log(sender);
    const textMessage = payload.text;
    console.log(textMessage);
    const sms = AfricasTalking.SMS; 
    const text = textMessage;
    
    handleIncomingMessage(text, sender, textId, phoneNumber, config ,sms ,register, account);
    // handleRegister(text, sender, messagingStep ,sms, register, config, phoneNumber, time, validateId);   
    // handleDelete(text, sender, messagingStep, phoneNumber, config, time, sms, register)
    //  handleAccountCheck(text, sender, messagingStep, sms, account, config, phoneNumber)
    
   res.send("Webhook received");
});   