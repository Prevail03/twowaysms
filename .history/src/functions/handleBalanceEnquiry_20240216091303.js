const sql = require('mssql');
var Client = require('node-rest-client').Client;

function handleBalanceEnquiry(textMessage, sender, messagingStep, sms, config, textIDAT, LinkID, products){
  switch (parseInt(messagingStep)) {
    case 1:
      const phoneNumberPassword = sender;
      const textPassword = textMessage;
      const textIDATPassword = textIDAT;
      updatePassword(phoneNumberPassword, textPassword, textIDATPassword, sender, config, textIDAT, sms, account, LinkID);
    break;

  }
}
module.exports = handleBalanceEnquiry;