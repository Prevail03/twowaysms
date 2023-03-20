const sql = require('mssql');
var Client = require('node-rest-client').Client;
const httpProxy = require('http-proxy');
const { InvalidNationalID,updateNationalID,updateEmail,failedIDNumber,updateFirstName } = require('./Database/registerDB');


let user = {};
let registrationStep = 0;
function handleRegister(text, sender, messagingStep, sms, register, config, phoneNumber, textIDAT) {
    console.log(textIDAT);
    switch (parseInt(messagingStep)) {
        case 1:

            // Handle step 1 of registration process
            sms.send(register.enterId(sender));
            registrationStep = 2;
            const statusID = "isRegistering";
            const phoneNumberID = phoneNumber;
            const messagingStepID = "2";
            const textID = text;
            const textIDATID = textIDAT;
            failedIDNumber(statusID,phoneNumberID,messagingStepID,textID,textIDATID,config);
            break;
        case 2:
            const validateId = require('../validateId');
            // process ID number and request for county
            if (validateId(text)) {
                user = user ? { ...user, id: text } : { id: text };

                sms.send(register.enterEmail(sender));
                const statusEmail = "isRegistering";
                const phoneNumberEmail = phoneNumber;
                const messagingStepEmail = "3";
                const textIDNumber = text;
                const textIDATEmail = textIDAT;
                updateNationalID(statusEmail,phoneNumberEmail,messagingStepEmail,textIDNumber,textIDATEmail,config);
            } else {
                sms.send(register.failedId(sender));
                const statusFail = "isRegistering";
                const phoneNumberFail = sender;
                const messagingStepFail = "1";
                InvalidNationalID(statusFail,phoneNumberFail,messagingStepFail,config);
            }
            break;
        case 3:
            //request 6 character password         
            sms.send(register.enterPassword(sender));
            const statusPassword = "isRegistering";
            const phoneNumberPassword = phoneNumber;
            const messagingStepPassword = "4";
            const textEmail = text;
            const textIDATPass = textIDAT;
            updateEmail(statusPassword,phoneNumberPassword,messagingStepPassword,textEmail,textIDATPass,config);
            break;
        case 4:
            //request for fname           
            sms.send(register.enterFirstName(sender));
            const statusFname = "isRegistering";
            const phoneNumberFname = phoneNumber;
            const messagingStepFname = "5";
            const textPassword = text;
            const textIDATFname = textIDAT;
            updatePassword(statusFname,phoneNumberFname,messagingStepFname,textPassword,textIDATFname,config);
            break;
        case 5:
            //request for lname           
            sms.send(register.enterLastName(sender));
            registrationStep = 6;
            const statusLname = "isRegistering";
            const phoneNumberLname = phoneNumber;
            const messagingStepLname = "6";
            const textFname = text;
            const textIDATLname = textIDAT;
            updateFirstName(statusLname,phoneNumberLname,messagingStepLname,textFname,textIDATLname,config);
            break;
        case 6:
            // process full name and send confirmation message
            const statusEnd = "isRegistering";
            const phoneNumberEnd = phoneNumber;
            const messagingStepEnd = "6";
            const textLname = text;
            const textIDEnding = textIDAT;
            updateLastname(statusEnd, messagingStepEnd, phoneNumberEnd, textLname, textIDEnding, config, phoneNumber,textIDAT)
            break;

        default:
            console.log('Unknown registration step:');
            break;
    }
}
module.exports = handleRegister;