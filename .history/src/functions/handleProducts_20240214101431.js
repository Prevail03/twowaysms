const sql = require('mssql');
var Client = require('node-rest-client').Client;


function handleProductsAndServices(textMessage, sender, messagingStep, sms, config, textIDAT, LinkID, products){
  switch (parseInt(messagingStep)) {
    case 1:    
      const statusIsPension = "isRating";
      const phoneNumberPension= sender;
      const messagingStepPension = "2";
      const textMessage = textMessage;
      const textIDATRateValue = textIDAT;
      updateRatingValue(statusIsPension, phoneNumberPension, messagingStepPension, textMessage, config, textIDATRateValue);
      sms.sendPremium(rate.reasonmessage(sender,LinkID));
      break;

  }

}
module.exports = handleProductsAndServices; 