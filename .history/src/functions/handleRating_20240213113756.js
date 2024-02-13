const sql = require('mssql');
var Client = require('node-rest-client').Client;

function handleRating(textMessage, sender, messagingStep, sms, config, textIDAT, LinkID, rate, account) {
  switch (parseInt(messagingStep)) {
    case 1:
            
      const statusRateValue = "isRating";
      const phoneNumberRateValue = sender;
      const messagingRateValue = "2";
      const textRateValue = textMessage;
      const textIDATRateValue = textIDAT;
      updateRatingValue(statusRateValue, phoneNumberRateValue, messagingRateValue, textRateValue, config, textIDATRateValue);
      sms.sendPremium(rate.reason(sender,LinkID));
      break;
    case 2:
      const statusReason = "isRating";
      const phoneNumberReason = sender;
      const messagingStepReason = "2";
      const textReason = textMessage;
      const textIDATReason = textIDAT;
      updateReason(statusReason, phoneNumberReason, messagingStepReason, textReason, config, textIDATReason, rate);
      
      break;  
    default:
      // do sthg
      sms.sendPremium(account.wrongResponse(sender, LinkID));
      break;
}

}