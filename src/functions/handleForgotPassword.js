const sql = require('mssql');
var Client = require('node-rest-client').Client;
const httpProxy = require('http-proxy');
function handleForgotPassword(textMessage, sender, messagingStep, sms, reset, config, textIDAT, LinkID) {

  switch (parseInt(messagingStep)) {
    case 1:
      //enter OTP///
    break;
    case 2:
      // new password///
    break;   
      
  }



}
module.exports = handleForgotPassword;