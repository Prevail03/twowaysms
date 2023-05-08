const sql = require('mssql');
var Client = require('node-rest-client').Client;
const { updateUserNameFail, updateUserNameSuccess, updatePassword, updateDescription,updatePeriodName } = require('./Database/accountDB');

function handleAccountCheck(textMessage, sender, messagingStep, sms, account, config, textIDAT) {
    switch (parseInt(messagingStep)) {
        case 1:
            sms.send(account.provideUserName(sender));
            const statusUserName = "isCheckingAccount";
            const phoneNumberUserName = sender;
            const messagingStepUserName = "2";
            const textUserName = textMessage;
            const textIDATUserName = textIDAT;
            updateUserNameFail(statusUserName, phoneNumberUserName, messagingStepUserName, textUserName, config, textIDATUserName);
            break;
        case 2:
            const phoneNumberUserNameS = sender;
            const textUsername = textMessage;
            const textIDATUserNameS = textIDAT;
            updateUserNameSuccess(phoneNumberUserNameS, textUsername, textIDATUserNameS, config)
            sms.send(account.providePassword(sender));
            break;
        case 3:
            const phoneNumberPassword = sender;
            const textPassword = textMessage;
            const textIDATPassword = textIDAT;
            updatePassword(phoneNumberPassword, textPassword, textIDATPassword, sender, config, textIDAT, sms, account);
            break;
        case 4:
            const phoneNumberDescription = sender;
            const textDescription = textMessage;
            const textIDATDescription = textIDAT;
            updateDescription(phoneNumberDescription, textDescription, textIDATDescription, sender, config, textIDAT, sms, account);
            break;

        case 5:
            //perdiodname
            const phoneNumberperiodName = sender;
            const textperiodName = textMessage;
            const textIDATperiodName = textIDAT;
            updatePeriodName(phoneNumberperiodName, textperiodName, textIDATperiodName, sender, config, textIDAT, sms);
            break;
        default:
            // do sthg
            sms.send(account.wrongResponse(sender));
            break;
    }
}

module.exports = handleAccountCheck;