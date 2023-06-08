const express = require("express");
const sql = require('mssql');
const session = require('express-session');
const options = require('./env.js');
const config = require('./dbconnect.js');
const register = require('./src/register.js');
const account = require('./src/account.js');
const forgotPassword = require('./src/forgotPassword.js');
const AfricasTalking = require('africastalking')(options);
const app = express();
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
    // console.log(payload);
    const sender = payload.from;
    const textId = payload.id;
    const phoneNumber=sender;
    const  LinkID = payload.linkId;
    const textMessage = payload.text;
    const sms = AfricasTalking.SMS;
    console.log(payload);

  

    handleIncomingMessage(textMessage, sender, textId, phoneNumber, config ,sms ,register, account, forgotPassword, LinkID);
    res.send("Webhook received");
   //messaging step 600 ### exceeded 3 login attempts
});   