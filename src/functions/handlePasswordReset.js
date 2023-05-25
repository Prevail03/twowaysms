const sql = require('mssql');
var Client = require('node-rest-client').Client;
const httpProxy = require('http-proxy');
const proxy = httpProxy.createProxyServer({});
const { updateEmail1, updateEmail2, updateCurrentPassword, updateOTP,updateNewPassword } = require('./Database/resetDB');

let user = {};
function handlePasswordReset(textMessage, sender, messagingStep, sms, reset, config, textIDAT, LinkID) {
    switch (parseInt(messagingStep)) {
        case 1:
            //request username
            sms.sendPremium(reset.enterEmail(sender,LinkID));
            resetStep = 2;
            const statusResetEmail = "ResetingPassword";
            const phoneNumberResetEmail = sender;
            const messagingStepResetEmail = "2";
            const textEmailReset = textMessage;
            const textIDATEmail = textIDAT;
            updateEmail1(statusResetEmail, phoneNumberResetEmail, messagingStepResetEmail, textEmailReset, config, textIDATEmail);
            break;

        case 2:
            //request current password 
            sms.sendPremium(reset.enterCurrentPassword(sender,LinkID));
            const statusResetCPassword = "ResetingPassword";
            const phoneNumberResetCPassword = sender;
            const messagingStepResetCPassword = "3";
            const textEmail = textMessage;
            const textIDATCPassword = textIDAT;
            updateEmail2(statusResetCPassword, phoneNumberResetCPassword, messagingStepResetCPassword, textEmail, textIDATCPassword, config);
            break;
        //send to login and reset Password
        case 3:
            //request OTP
            const statusResetPassword = "ResetingPassword";
            const phoneNumberResetPassword = sender;
            const messagingStepResetPassword = "4";
            const textCPassword = textMessage;
            const textIDATPassword = textIDAT;
            updateCurrentPassword(statusResetPassword, phoneNumberResetPassword, messagingStepResetPassword, textCPassword, textIDATPassword, config, sms, sender, reset, textIDAT,LinkID);
            break;
        case 4:
            //request new Password
            sms.sendPremium(reset.enterNewPassword(sender, LinkID));
            const statusResetNPassword = "ResetingPassword";
            const phoneNumberResetNPassword = sender;
            const messagingStepResetNPassword = "5";
            const textIDATResetNPassword = textIDAT;
            const textOTP = textMessage;
            updateOTP(statusResetNPassword, messagingStepResetNPassword, textOTP, textIDATResetNPassword, phoneNumberResetNPassword);
            break;
        case 5:
            //confirmation of password reset
            
            user.newPassword = textMessage;
            const statusResetNPasswordEnd = "ResetingPassword";
            const phoneNumberResetNPasswordEnd = sender;
            const messagingStepResetNPasswordEnd = "5";
            const textIDATResetNPasswordEnd = textIDAT;
            const textNewPassword = textMessage;
            updateNewPassword(statusResetNPasswordEnd, phoneNumberResetNPasswordEnd, messagingStepResetNPasswordEnd, textNewPassword, textIDATResetNPasswordEnd, config, sms, sender, reset, textIDAT, LinkID);
            break;
    }
}
module.exports = handlePasswordReset;