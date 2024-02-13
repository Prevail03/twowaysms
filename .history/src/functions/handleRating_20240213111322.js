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
            updateRatingValue(statusRateValue, phoneNumberRateValue, messagingRateValue, textRateValue, config, textIDRateValue);
            sms.sendPremium(account.provideUserName(sender,LinkID));
            break;
  }

}