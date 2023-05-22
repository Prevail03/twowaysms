const sql = require('mssql');
const handleRegister = require('./handleRegister');
const handleDelete = require('./handleDelete');
const handleAccountCheck = require('./handleAccountCheck');
const handlePasswordReset = require('./handlePasswordReset');
const reset =require('../reset')

function handleIncomingMessage(textMessage, sender, textId, phoneNumber, config, sms, register, account, LinkID) {
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
                // ... Handle existing user in two_way_sms_tb logic ...
                //user exists check which procces and step cc
                console.log('User Exists');
                const status = checkResults.recordset[0].status;
                const messagingStep = checkResults.recordset[0].messagingStep;
                const textIDAT = checkResults.recordset[0].text_id_AT; ///text Id from Africas Talking
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
                 // Does not exist in two_way_sms_tb
            } else {
                // insert to two_way_sms_tb 
               
                const checkIfExistsQuerySysUsers = "SELECT TOP 1 * FROM sys_users_tb WHERE user_mobile = @phoneNumber OR user_phone = @phoneNumber";
                const checkIfExistsRequestSysUsers = new sql.Request(connection);
                checkIfExistsRequestSysUsers.input('phoneNumber', sql.VarChar, phoneNumber);
                checkIfExistsRequestSysUsers.query(checkIfExistsQuerySysUsers, function(checkErrSysUsers, checkResultsSysUsers) {
                    if (checkErrSysUsers) {
                        console.error('Error executing checkIfExistsQuerySysUsers: ' + checkErrSysUsers.stack);
                        connection.close();
                        return;
                    }
                    // Record exists in sys_users_tb
                    if (checkResultsSysUsers.recordset.length > 0) {                       
                        console.log('Record exists in sys_users_tb');
                        sms.sendPremium(register.menuMessage(sender,LinkID));
                        // ... Handle existing record logic ...
                        const status = "currentCustomer";
                        const phoneNumber = sender;
                        const messagingStep= "2";
                        const insertQuery = "INSERT INTO two_way_sms_tb (text, text_id_AT, status, messagingStep,phoneNumber, isActive) VALUES (@text, @text_id_AT,@status, @messagingStep, @phoneNumber, @isActive)";
                        const insertRequest = new sql.Request(connection);
                        insertRequest.input('text', sql.VarChar, textMessage);
                        insertRequest.input('text_id_AT', sql.VarChar, textId);
                        insertRequest.input('status', sql.VarChar, status);
                        insertRequest.input('messagingStep', sql.VarChar, messagingStep);
                        insertRequest.input('phoneNumber', sql.VarChar, phoneNumber);
                        insertRequest.input('isActive', sql.Bit, 1);
                        insertRequest.query(insertQuery, function(insertErr, insertResults) {
                            if (insertErr) {
                                console.error('Error executing insertQuery: ' + insertErr.stack);
                                sql.close();
                                return;
                            }
                            console.log(" New User inserted successfully");
                        });
                    // Record does not exist in sys_users_tb == a new conversion
                    } else {
                        
                        sms.sendPremium(register.menuMessage(sender,LinkID));
                        console.log('Start Registration Process');
                        // ... Handle registration process logic ...
                        const status = "isRegistering";
                        const phoneNumber = sender;
                        const messagingStep= "2";
                        const insertQuery = "INSERT INTO two_way_sms_tb (text, text_id_AT, status, messagingStep,phoneNumber, isActive) VALUES (@text, @text_id_AT,@status, @messagingStep, @phoneNumber, @isActive)";
                        const insertRequest = new sql.Request(connection);
                        insertRequest.input('text', sql.VarChar, textMessage);
                        insertRequest.input('text_id_AT', sql.VarChar, textId);
                        insertRequest.input('status', sql.VarChar, status);
                        insertRequest.input('messagingStep', sql.VarChar, messagingStep);
                        insertRequest.input('phoneNumber', sql.VarChar, phoneNumber);
                        insertRequest.input('isActive', sql.Bit, 1);
                        insertRequest.query(insertQuery, function(insertErr, insertResults) {
                            if (insertErr) {
                                console.error('Error executing insertQuery: ' + insertErr.stack);
                                sql.close();
                                return;
                            }
                            console.log(" New User inserted successfully");
                        });
                    }
                    connection.close();
                });
            }
        });
    });
}

module.exports = handleIncomingMessage;