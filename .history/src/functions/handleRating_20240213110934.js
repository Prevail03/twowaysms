const sql = require('mssql');
var Client = require('node-rest-client').Client;

function handleRating(textMessage, sender, messagingStep, sms, config, textIDAT, LinkID, rate, account) {
  switch (parseInt(messagingStep)) {
    case 1:
            
            const statusRateValue = "isRating";
            const phoneNumberRateValue = sender;
            const messagingRateValue = "2";
            const textUserName = textMessage;
            const textIDATUserName = textIDAT;
            updateRatingValue(statusUserName, phoneNumberUserName, messagingStepUserName, textUserName, config, textIDATUserName);
            sms.sendPremium(account.provideUserName(sender,LinkID));
            break;
  }

}