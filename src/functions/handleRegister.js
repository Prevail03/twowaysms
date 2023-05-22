const sql = require('mssql');
const { InvalidNationalID, updateNationalID, updateEmail, failedIDNumber,updateFirstName, updateLastname, updatePassword } = require('./Database/registerDB');

let user = {};
let registrationStep = 0;
function handleRegister(textMessage, sender, messagingStep, sms, register, config, phoneNumber, textIDAT, LinkID) {
    console.log(textIDAT);
    switch (parseInt(messagingStep)) {
        case 1:

            // Handle step 1 of registration process
            sms.sendPremium(register.enterId(sender,LinkID));
            registrationStep = 2;
            const statusID = "isRegistering";
            const phoneNumberID = phoneNumber;
            const messagingStepID = "2";
            const textID = textMessage;
            const textIDATID = textIDAT;
            failedIDNumber(statusID,phoneNumberID,messagingStepID,textID,textIDATID,config);
            break;
        case 2:
            const validateId = require('../validateId');
            // process ID number and request for county
            if (validateId(textMessage)) {
                user = user ? { ...user, id: textMessage } : { id: textMessage };
                console.log(LinkID);
                sms.sendPremium(register.enterEmail(sender,LinkID));
                const statusEmail = "isRegistering";
                const phoneNumberEmail = phoneNumber;
                const messagingStepEmail = "3";
                const textIDNumber = textMessage;
                const textIDATEmail = textIDAT;
                updateNationalID(statusEmail,phoneNumberEmail,messagingStepEmail,textIDNumber,textIDATEmail,config);
            } else {
                sms.sendPremium(register.failedId(sender,LinkID));
                const statusFail = "isRegistering";
                const phoneNumberFail = sender;
                const messagingStepFail = "1";
                InvalidNationalID(statusFail,phoneNumberFail,messagingStepFail,config);
            }
            break;
        case 3:
            //request 6 character password         
            sms.sendPremium(register.enterPassword(sender,LinkID));
            const statusPassword = "isRegistering";
            const phoneNumberPassword = phoneNumber;
            const messagingStepPassword = "4";
            const textEmail = textMessage;
            const textIDATPass = textIDAT;
            updateEmail(statusPassword,phoneNumberPassword,messagingStepPassword,textEmail,textIDATPass,config);
            break;
        case 4:
            //request for fname           
            sms.sendPremium(register.enterFirstName(sender,LinkID));
            const statusFname = "isRegistering";
            const phoneNumberFname = phoneNumber;
            const messagingStepFname = "5";
            const textPassword = textMessage;
            const textIDATFname = textIDAT;
            updatePassword(statusFname,phoneNumberFname,messagingStepFname,textPassword,textIDATFname,config);
            break;
        case 5:
            //request for lname           
            sms.sendPremium(register.enterLastName(sender, LinkID));
            registrationStep = 6;
            const statusLname = "isRegistering";
            const phoneNumberLname = phoneNumber;
            const messagingStepLname = "6";
            const textFname = textMessage;
            const textIDATLname = textIDAT;
            updateFirstName(statusLname,phoneNumberLname,messagingStepLname,textFname,textIDATLname,config);
            break;
        case 6:
            // process full name and send confirmation message
            const statusEnd = "isRegistering";
            const phoneNumberEnd = phoneNumber;
            const messagingStepEnd = "6";
            const textLname = textMessage;
            const textIDEnding = textIDAT;
            updateLastname(statusEnd, messagingStepEnd, phoneNumberEnd, textLname, textIDEnding, config, phoneNumber ,textIDAT, sms, LinkID)
            break;

        default:
            console.log('Unknown registration step:');
            break;
    }
}
module.exports = handleRegister;