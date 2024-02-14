const sql = require('mssql');
var Client = require('node-rest-client').Client;


function handleProductsAndServices(textMessage, sender, messagingStep, sms, config, textIDAT, LinkID, products){
  switch (parseInt(messagingStep)) {
    case 1:    
      const statusIsPension = "isProducts";
      const phoneNumberPension= sender;
      let messagingStepPension = "";
      const textMessageSent = textMessage;
      const textIDATPension = textIDAT;
      let textMessageProduct = '';
      if(textMessageSent == 1){
        textMessageProduct = 'Pension';
        messagingStepPension = 2;
      }else if(textMessageSent == 2){
        textMessageProduct = 'Pension';
        messagingStepPension = 10;
      }
      updatePensionMessagingStep(statusIsPension, phoneNumberPension, messagingStepPension, textMessage, config, textIDATPension);
      sms.sendPremium(products.theproducts(sender,LinkID));
      break;
      case 2:
      const statusIPP = "isRating";
      const phoneNumberReason = sender;
      const messagingStepReason = "3";
      const textReason = textMessage;
      const textIDATReason = textIDAT;
      updateReason(sender, statusIPP, phoneNumberReason, messagingStepReason, textReason, config, textIDATReason, rate, textIDAT, sms, LinkID);
      sms.sendPremium(rate.successmessage(sender,LinkID)); 
      break;  

  }

}
module.exports = handleProductsAndServices; 