const express = require("express");
const sql = require('mssql');
const session = require('express-session');
const MemoryStore = require('memorystore')(session);
var Client = require('node-rest-client').Client;
const options = require('./env.js');
const config = require('./dbconnect.js');
const register = require('./src/register.js');
const account = require('./src/account.js');
const reset = require('./src/reset.js');
const validateId = require('./src/validateId.js');
const AfricasTalking = require('africastalking')(options);
const app = express();
const keyword = "Test4 ";
const bodyParser = require("body-parser");
const { urlencoded } = require("express");
app.use(bodyParser.json());
app.listen(3000, function() {
    console.log("Started at localhost 3000");
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
let registrationStep = 0;
let isDeleting=false;
let deletingStep=0;
let isCheckingAccount=false;
let accountStep=0;
let ResetingPassword=false;
let resetStep=0

//funtions import
const handleIncomingMessage = require('./src/functions/incomingmessage.js');
const handleRegister = require('./src/functions/handleRegister');

app.post("/webhook", (req, res) => {
    const payload = req.body;
    console.log(payload);
    const sender = payload.from;
    const textId =payload.id;
    const phoneNumber=sender;
    console.log(sender);
    const textMessage = payload.text;
    console.log(textMessage);
    const sms = AfricasTalking.SMS;
    let messageToCustomer;    
    const text = textMessage.replace(keyword, '').trim();//remove "Key Word" 
    const time = new Date();
    let status = '';
    let messagingStep = '';

    
    handleIncomingMessage(text, sender, textId, phoneNumber, time, config ,sms ,register);
    // handleRegister(text, sender, messagingStep ,sms, register, config, phoneNumber, time, validateId);
      
      function handleDelete(text, sender, messagingStep) {
        switch (parseInt(messagingStep)) {
          case 1:
            // Handle step 1 of delete process
            break;
          case 2:
            // Handle step 2 of delete process
            break;
          // ...
          default:
            console.log('Unknown delete step: ' + messagingStep);
            break;
        }
      }
      
      function handleAccountCheck(text, sender, messagingStep) {
        switch (parseInt(messagingStep)) {
          case 1:
            // Handle step 1 of account check process
            break;
          case 2:
            // Handle step 2 of account check process
            break;
          // ...
          default:
            console.log('Unknown account check step: ' + messagingStep);
            break;
        }
      }
      
      function handlePasswordReset(text, sender, messagingStep) {
        switch (parseInt(messagingStep)) {
          case 1:
            // Handle step 1 of password reset process
            break;
          case 2:
            // Handle step 2 of password reset process
            break;
          // ...
          default:
            console.log('Unknown password reset step: ' + messagingStep);
            break;
        }
      }
      
    
        res.send("Webhook received");
});   