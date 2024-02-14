const sql = require('mssql');
var Client = require('node-rest-client').Client;


function handleProductsAndServices(textMessage, sender, messagingStep, sms, config, textIDAT, LinkID, products){
  switch (parseInt(messagingStep)) {
    case 1:    
      const statusIsPension = "isRating";
      const phoneNumberPension= sender;
      const messagingRateValue = "2";
      const textRateValue = textMessage;
      const textIDATRateValue = textIDAT;
      updateRatingValue(statusIsPension, phoneNumberPension, messagingRateValue, textRateValue, config, textIDATRateValue);
      sms.sendPremium(rate.reasonmessage(sender,LinkID));
      break;

  }

}
module.exports = handleProductsAndServices; 