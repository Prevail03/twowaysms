const sql = require('mssql');
var Client = require('node-rest-client').Client;

function handleRating(textMessage, sender, messagingStep, sms, config, textIDAT, LinkID, rate, account) {
  switch (parseInt(messagingStep)) {
    case 1:
            sms.sendPremium(account.provideUserName(sender,LinkID));
            const statusUserName = "isRating";
            const phoneNumberUserName = sender;
            const messagingStepUserName = "2";
            const textUserName = textMessage;
            const textIDATUserName = textIDAT;
            updateUserNameFail(statusUserName, phoneNumberUserName, messagingStepUserName, textUserName, config, textIDATUserName);
            break;
  }

}