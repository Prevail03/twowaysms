const sql = require('mssql');
var Client = require('node-rest-client').Client;


function handleProductsAndServices(textMessage, sender, messagingStep, sms, config, textIDAT, LinkID, products){
  switch (parseInt(messagingStep)) {
    case 1:    
      const statusIsPension = "isRating";
      const phoneNumberPension= sender;
      const messagingStepPension = "2";
      const textMessage = textMessage;
      const textIDATPension = textIDAT;
      updatePensionMessagingStep(statusIsPension, phoneNumberPension, messagingStepPension, textMessage, config, textIDATPension);
      sms.sendPremium(products.reasonmessage(sender,LinkID));
      break;

  }

}
module.exports = handleProductsAndServices; 