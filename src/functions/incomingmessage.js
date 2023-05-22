const sql = require('mssql');
var Client = require('node-rest-client').Client;const validateId = require('../validateId');
const handleRegister = require('./handleRegister');
const handleDelete = require('./handleDelete');
const handleAccountCheck = require('./handleAccountCheck');
const handlePasswordReset = require('./handlePasswordReset');
const reset =require('../reset')

let user={};
function handleIncomingMessage(textMessage, sender, textId, phoneNumber, config, sms , register, account,LinkID) {
    sql.connect(config, function(err, connection) {
        if (err) {
            console.error('Error connecting to database: ' + err.stack);
            return;
        }
        console.log('Connected to database');
        //check if its an existing user of the two way sms system
        const checkIfExistsQuery = "SELECT TOP 1 * FROM two_way_sms_tb WHERE phoneNumber = @phoneNumber AND isActive = 1";
        const checkIfExistsRequest = new sql.Request(connection);
        checkIfExistsRequest.input('phoneNumber', sql.VarChar, phoneNumber);
        checkIfExistsRequest.query(checkIfExistsQuery, function(checkErr, checkResults) {
            if (checkErr) {
                console.error('Error executing checkIfExistsQuery: ' + checkErr.stack);
                sql.close();
                return;
            }
            if (checkResults.recordset.length > 0) {
               
                console.log('Existing user of two way sms');
                //user exists check which procces and step
                console.log('User Exists');
                const status = checkResults.recordset[0].status;
                const messagingStep = checkResults.recordset[0].messagingStep;
                const textIDAT = checkResults.recordset[0].text_id_AT; ///text Id from Africas Talking
                console.log(textIDAT);
                console.log(status+" "+messagingStep);
                switch (status) {
                case 'isRegistering':
                    handleRegister(textMessage, sender, messagingStep ,sms, register, config, phoneNumber, textIDAT, LinkID);
                    break;
                case 'isDeleting':
                    handleDelete(textMessage, sender, messagingStep, config, sms, register , textIDAT, LinkID);
                    break; 
                case 'isCheckingAccount':
                    handleAccountCheck(textMessage, sender, messagingStep, sms, account, config,textIDAT, LinkID);
                    break;
                case 'ResetingPassword':
                    handlePasswordReset(textMessage, sender, messagingStep, sms, reset, config , textIDAT, LinkID);
                    break;
                default:
                    sms.sendPremium(register.defaultMessage(sender,LinkID));
                    console.log('Unknown status: ' + status);
                    break;
                }
            } // <-- Closing curly brace for if statement
            else {
                // Your logic when the record doesn't exist
                sql.connect(config, function(err, connection) {
                    if (err) {
                        console.error('Error connecting to database: ' + err.stack);
                        return;
                    }
                    const checkIfExistsQuery = "SELECT TOP 1 * FROM sys_users_tb WHERE user_mobile = @phoneNumber OR user_phone = @phoneNumber";
                    const checkIfExistsRequest = new sql.Request(connection);
                    checkIfExistsRequest.input('phoneNumber', sql.VarChar, phoneNumber);
                    checkIfExistsRequest.query(checkIfExistsQuery, function(checkErr, checkResults) {
                        if (checkErr) {
                            console.error('Error executing checkIfExistsQuery: ' + checkErr.stack);
                            sql.close();
                            return;
                        }
                        if (checkResults.recordset.length > 0) {
                            // Your logic when the record exists in sysusers
                            sms.sendPremium(register.menuMessage(sender,LinkID));
                        } // <-- Closing curly brace for if statement
                        else {
                            sms.sendPremium(register.newCustomer(sender,LinkID));
                            console.log("Start Registration Proccess");
                        }
                        sql.close();
                    }); // <-- Closing parentheses for query function
                }); // <-- Closing parentheses for sql.connect function
            }
            sql.close();
        }); // <-- Closing parentheses for query function
    }); // <-- Closing parentheses for sql.connect function
    
}
module.exports = handleIncomingMessage;