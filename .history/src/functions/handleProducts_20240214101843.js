const sql = require('mssql');
var Client = require('node-rest-client').Client;


function handleProductsAndServices(textMessage, sender, messagingStep, sms, config, textIDAT, LinkID, products){
  switch (parseInt(messagingStep)) {
    case 1:    
      const statusIsPension = "isRating";
      const phoneNumberPension= sender;
      let messagingStepPension = "";
      const textMessageSent = textMessage;
      const textIDATPension = textIDAT;
      let textMessageProduct = '';
      if(textmessageSent == 1){
        $product 
      }
      updatePensionMessagingStep(statusIsPension, phoneNumberPension, messagingStepPension, textMessage, config, textIDATPension);
      sms.sendPremium(products.theproducts(sender,LinkID));
      break;

  }

}
module.exports = handleProductsAndServices; 