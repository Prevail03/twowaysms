const sql = require('mssql');
var Client = require('node-rest-client').Client;const validateId = require('../validateId');
const handleRegister = require('./handleRegister');
const handleDelete = require('./handleDelete');
const handleAccountCheck = require('./handleAccountCheck');
const handlePasswordReset = require('./handlePasswordReset');
const reset =require('../reset')

function handleIncomingMessage(textMessage, sender, textId, phoneNumber, config, sms , register, account,LinkID) {
    sql.connect(config, function(err, connection) {
        if (err) {
            console.error('Error connecting to database: ' + err.stack);
            return;
        }
        console.log('Connected to database');

        const checkIfExistsQuery = "SELECT TOP 1 * FROM two_way_sms_tb WHERE phoneNumber = @phoneNumber AND isActive = 1";
        const checkIfExistsRequest = new sql.Request(connection);
        checkIfExistsRequest.input('phoneNumber', sql.VarChar, phoneNumber);
        checkIfExistsRequest.query(checkIfExistsQuery, function(checkErr, checkResults) {
            if (checkErr) {
                console.error('Error executing checkIfExistsQuery: ' + checkErr.stack);
                connection.close();
                return;
            }
            if (checkResults.recordset.length > 0) {
                // Existing user of two-way SMS
                console.log('Existing user of two-way SMS');
            //user exists check which procces and step cc
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
                // ... Handle existing user logic ...
            } else {
                // Does not exist in two_way_sms_tb
                const checkIfExistsQuerySysUsers = "SELECT TOP 1 * FROM sys_users_tb WHERE user_mobile = @phoneNumber OR user_phone = @phoneNumber";
                const checkIfExistsRequestSysUsers = new sql.Request(connection);
                checkIfExistsRequestSysUsers.input('phoneNumber', sql.VarChar, phoneNumber);
                checkIfExistsRequestSysUsers.query(checkIfExistsQuerySysUsers, function(checkErrSysUsers, checkResultsSysUsers) {
                    if (checkErrSysUsers) {
                        console.error('Error executing checkIfExistsQuerySysUsers: ' + checkErrSysUsers.stack);
                        connection.close();
                        return;
                    }
                    if (checkResultsSysUsers.recordset.length > 0) {
                        // Record exists in sys_users_tb
                        console.log('Record exists in sys_users_tb');
                        // ... Handle existing record logic ...
                        sms.sendPremium(register.menuMessage(sender,LinkID));   
                    } else {
                        // Record does not exist in sys_users_tb
                        console.log('Start Registration Process');
                        // ... Handle registration process logic ...
                        sms.sendPremium(register.newCustomer(sender,LinkID));
                        console.log("Start Registration Proccess");
                        const status = "isRegistering";
                        const phoneNumber = sender;
                        const messagingStep= "2";
                        sql.connect(config, function(err) {
                            const request = new sql.Request(connection);
                            const updateRegister1 = `UPDATE two_way_sms_tb SET status = @status, messagingStep = @messagingStep WHERE phoneNumber = @phoneNumber AND time = (
                                SELECT MAX(time) FROM two_way_sms_tb WHERE phoneNumber = @phoneNumber )`;
                            request.input('status', sql.VarChar, status);
                            request.input('messagingStep', sql.VarChar, messagingStep);
                            request.input('phoneNumber', sql.VarChar, phoneNumber);
                            request.query(updateRegister1, function(err, results) {
                                if (err) {
                                    console.error('Error executing query: ' + err.stack);
                                    return;
                                }
                                console.log('Register UPDATE successful');
                            });
                        });
                    }
                    connection.close();
                });
            }
        });
    });
}
module.exports = handleIncomingMessage;