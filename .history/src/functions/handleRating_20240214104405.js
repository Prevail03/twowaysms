const sql = require('mssql');
var Client = require('node-rest-client').Client;

 const {updateRatingValue, updateReason} = require('./Database/ratingDB');

function handleRating(textMessage, sender, messagingStep, sms, config, textIDAT, LinkID, rate, account) {
  switch (parseInt(messagingStep)) {
    case 1:    
      const statusRateValue = "isRating";
      const phoneNumberRateValue = sender;
      const messagingRateValue = "2";
      const textRateValue = textMessage;
      const textIDATRateValue = textIDAT;
      updateRatingValue(statusRateValue, phoneNumberRateValue, messagingRateValue, textRateValue, config, textIDATRateValue);
      sms.sendPremium(rate.reasonmessage(sender,LinkID));
      break;
    case 2:
      const statusReason = "isRating";
      const phoneNumberReason = sender;
      const messagingStepReason = "3";
      const textReason = textMessage;
      const textIDATReason = textIDAT;
      updateReason(sender, statusReason, phoneNumberReason, messagingStepReason, textReason, config, textIDATReason, rate, textIDAT, sms, LinkID);
      sms.sendPremium(rate.successmessage(sender,LinkID));
      break;  
    default:
      // do sthg
      sms.sendPremium(rate.wrongResponse(sender, LinkID));
      break;
  }
}
module.exports = handleRating;