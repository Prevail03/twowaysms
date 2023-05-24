const { updateUserNameFail, updateUserNameSuccess, updatePassword, updateDescription,updatePeriodName } = require('./Database/accountDB');

function handleAccountCheck(textMessage, sender, messagingStep, sms, account, config, textIDAT, LinkID) {
    switch (parseInt(messagingStep)) {
        case 1:
            sms.sendPremium(account.provideUserName(sender,LinkID));
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
            sms.sendPremium(account.providePassword(sender,LinkID));
            break;
        case 3:
            const phoneNumberPassword = sender;
            const textPassword = textMessage;
            const textIDATPassword = textIDAT;
            updatePassword(phoneNumberPassword, textPassword, textIDATPassword, sender, config, textIDAT, sms, account, LinkID);
            break;
        case 4:
            const phoneNumberDescription = sender;
            const textDescription = textMessage;
            const textIDATDescription = textIDAT;
            updateDescription(phoneNumberDescription, textDescription, textIDATDescription, sender, config, textIDAT, sms, account, LinkID);
            break;

        case 5:
            //perdiodname//
            const phoneNumberperiodName = sender;
            const textperiodName = textMessage;
            const textIDATperiodName = textIDAT;
            updatePeriodName(phoneNumberperiodName, textperiodName, textIDATperiodName, sender, config, textIDAT, sms,LinkID);
            break;
        default:
            // do sthg
            sms.sendPremium(account.wrongResponse(sender, LinkID));
            break;
    }
}

module.exports = handleAccountCheck;