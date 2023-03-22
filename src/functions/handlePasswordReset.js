const sql = require('mssql');
var Client = require('node-rest-client').Client;
const httpProxy = require('http-proxy');
const proxy = httpProxy.createProxyServer({});
const { updateEmail1, updateEmail2, updateCurrentPassword, updateOTP } = require('./Database/resetDB');

let user = {};
function handlePasswordReset(text, sender, messagingStep, sms, reset, config, textIDAT) {
    switch (parseInt(messagingStep)) {
        case 1:
            //request username
            sms.send(reset.enterEmail(sender));
            resetStep = 2;
            const statusResetEmail = "ResetingPassword";
            const phoneNumberResetEmail = sender;
            const messagingStepResetEmail = "2";
            const textEmailReset = text;
            const textIDATEmail = textIDAT;
            updateEmail1(statusResetEmail, phoneNumberResetEmail, messagingStepResetEmail, textEmailReset, config, textIDATEmail);
            break;

        case 2:
            //request current password 
            sms.send(reset.enterCurrentPassword(sender));
            const statusResetCPassword = "ResetingPassword";
            const phoneNumberResetCPassword = sender;
            const messagingStepResetCPassword = "3";
            const textEmail = text;
            const textIDATCPassword = textIDAT;
            updateEmail2(statusResetCPassword, phoneNumberResetCPassword, messagingStepResetCPassword, textEmail, textIDATCPassword, config);
            break;
        //send to login and reset Password
        case 3:
            //request OTP
            const statusResetPassword = "ResetingPassword";
            const phoneNumberResetPassword = sender;
            const messagingStepResetPassword = "4";
            const textCPassword = text;
            const textIDATPassword = textIDAT;
            updateCurrentPassword(statusResetPassword, phoneNumberResetPassword, messagingStepResetPassword, textCPassword, textIDATPassword, config, sms, sender, reset, textIDAT);
            break;
        case 4:
            //request new Password
            sms.send(reset.enterNewPassword(sender));
            const statusResetNPassword = "ResetingPassword";
            const phoneNumberResetNPassword = sender;
            const messagingStepResetNPassword = "5";
            const textIDATResetNPassword = textIDAT;
            const textOTP = text;
            updateOTP(statusResetNPassword, messagingStepResetNPassword, textOTP, textIDATResetNPassword, phoneNumberResetNPassword);
            break;
        case 5:
            //confirmation of password reset
            user.newPassword = text;
            const statusResetNPasswordEnd = "ResetingPassword";
            const phoneNumberResetNPasswordEnd = sender;
            const messagingStepResetNPasswordEnd = "5";
            const textIDATResetNPasswordEnd = textIDAT;
            const textNewPassword = text;
            updateNewPassword(statusResetNPasswordEnd, phoneNumberResetNPasswordEnd, messagingStepResetNPasswordEnd, textNewPassword, textIDATResetNPasswordEnd, config, sms, sender, reset, textIDAT);
            break;
    }
}
module.exports = handlePasswordReset;