const sql = require('mssql');
const handleRegister = require('./handleRegister');
const handleDelete = require('./handleDelete');
const handleAccountCheck = require('./handleAccountCheck');
const handlePasswordReset = require('./handlePasswordReset');
const handleForgotPassword = require('./handleForgotPassword');
const reset =require('../reset')
var Client = require('node-rest-client').Client;

function handleIncomingMessage(textMessage, sender, textId, phoneNumber, config, sms, register, account,forgotPassword, LinkID) {
    if(textMessage == 98){
        console.log('Forgot Password Work Flow');
        sql.connect(config, function(err, connection) {
            if (err) {
                console.error('Error connecting to database: ' + err.stack);
                return;
            }
            console.log('Connected to database');
            let phone= phoneNumber;
            phone = phone.replace("+", "");
            console.log('Phone: ' + phone);
            const checkIfExistsQuerySysUsers = "SELECT TOP 1 * FROM sys_users_tb WHERE user_mobile LIKE '%' + @phoneNumber + '%' OR user_phone LIKE '%' + @phoneNumber + '%'";
            const checkIfExistsRequestSysUsers = new sql.Request(connection);
            checkIfExistsRequestSysUsers.input('phoneNumber', sql.VarChar, phone);
            checkIfExistsRequestSysUsers.query(checkIfExistsQuerySysUsers, function(checkErrSysUsers, checkResultsSysUsers) {
                if (checkErrSysUsers) {
                    console.error('Error executing checkIfExistsQuerySysUsers: ' + checkErrSysUsers.stack);
                    connection.close();
                    return;
                }
                // Record exists in sys_users_tb
                if (checkResultsSysUsers.recordset.length > 0) {
                    console.log('User exists');
                    const email = checkResultsSysUsers.recordset[0].user_email;
                    console.log(email);

                    var forgotPasswordClient = new Client();
                    var args = {
                        data: { identifier: email },
                        headers: { "Content-Type": "application/json" }
                    };
                    forgotPasswordClient.post("https://api.octagonafrica.com/v1/password_reset", args, function (data, response) {
                        if ([200].includes(response.statusCode)) {
                            console.log(response.statusCode);
                            console.log("OTP sent to " + email);
                            sms.sendPremium(forgotPassword.welcomeMessageForgotPassword(sender, LinkID));
                            const messagingStep = "1";
                            const status = "isForgotPassword";
                            const insertQuery = "INSERT INTO two_way_sms_tb (text, text_id_AT, messagingStep, phoneNumber, status, isActive) VALUES (@text, @text_id_AT, @messagingStep, @phoneNumber, @status, @isActive)";
                            const insertRequest = new sql.Request(connection);
                            insertRequest.input('text', sql.VarChar, textMessage);
                            insertRequest.input('text_id_AT', sql.VarChar, textId);
                            insertRequest.input('phoneNumber', sql.VarChar, phoneNumber);
                            insertRequest.input('status', sql.VarChar, status);
                            insertRequest.input('messagingStep', sql.VarChar, messagingStep);
                            insertRequest.input('isActive', sql.Bit, 1);
                            insertRequest.query(insertQuery, function(insertErr, insertResults) {
                                if (insertErr) {
                                    console.error('Error executing insertQuery: ' + insertErr.stack);
                                    connection.close();
                                    return;
                                }
                                console.log('Added new user to two way sms');
                                connection.close();
                            });
                        } else if ([400].includes(response.statusCode)) {
                            console.log(response.statusCode);
                            sms.sendPremium(reset.error400(sender, LinkID));
                        } else {
                            console.log(response.statusCode);
                        }
                    });
                    
                }else{
                    console.log('You do not have an account with us please register');
                    sms.sendPremium(forgotPassword.missingAccount(sender, LinkID));
                }   
            });
        });        
        ///main workflow 
    }else{ 
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
                    //user exists check which process and step cc
                    console.log('User Exists');
                    const status = checkResults.recordset[0].status;
                    const messagingStep = checkResults.recordset[0].messagingStep;
                    const textIDAT = checkResults.recordset[0].text_id_AT; ///text Id from Africas Talking
                    console.log(status + " " + messagingStep);
                    switch (status) {
                        case 'isRegistering':
                            handleRegister(textMessage, sender, messagingStep, sms, register, config, phoneNumber, textIDAT, LinkID);
                        break;
                        case 'isDeleting':
                            handleDelete(textMessage, sender, messagingStep, config, sms, register, textIDAT, LinkID);
                        break;
                        case 'isCheckingAccount':
                            handleAccountCheck(textMessage, sender, messagingStep, sms, account, config, textIDAT, LinkID);
                        break;
                        case 'ResetingPassword':
                            handlePasswordReset(textMessage, sender, messagingStep, sms, reset, config, textIDAT, LinkID);
                        break;
                        case 'isForgotPassword':
                            handleForgotPassword(textMessage, sender, messagingStep, sms, forgotPassword, config, textIDAT, LinkID,reset);
                        break;    
                        default:
                            sms.sendPremium(register.defaultMessage(sender, LinkID));
                            console.log('Unknown status: ' + status);
                        break;
                    }
                    // Does not exist in two_way_sms_tb
                } else {
                    //generate
                    if (textMessage == 2) {
                        console.log("Generate Member statement Workflow");
                        sms.sendPremium(account.welcomeMessageAccount(sender,LinkID));
                        const currentStatus = "existingCustomer";
                        const statusAccounts = "isCheckingAccount";
                        const phoneNumberAccounts = sender;
                        const messagingStepAccounts= "3";
                        const request = new sql.Request(connection);
                        const updateAccounts = `UPDATE two_way_sms_tb SET status = @statusAccounts,isActive=@isActive, messagingStep = @messagingStepAccounts WHERE phoneNumber = @phoneNumberAccounts AND time = (
                            SELECT MAX(time) FROM two_way_sms_tb WHERE phoneNumber = @phoneNumberAccounts and status =@currentStatus )`;
                        request.input('statusAccounts', sql.VarChar, statusAccounts);
                        request.input('currentStatus', sql.VarChar, currentStatus);
                        request.input('messagingStepAccounts', sql.VarChar, messagingStepAccounts);
                        request.input('phoneNumberAccounts', sql.VarChar, phoneNumberAccounts);
                        request.input('isActive', sql.Bit, 1);
                        request.query(updateAccounts, function(err, results) {
                        if (err) {
                            console.error('Error executing query: ' + err.stack);
                            return;
                        }
                        console.log('Accounts UPDATE successful');
                        connection.close();
                        });
                    } else if (textMessage == 9) {
                        console.log("Reset Password Workflow");
                        sms.sendPremium(reset.welcomeMessage(sender, LinkID));
                        const currentStatus = "existingCustomer";
                        const statusAccounts = "ResetingPassword";
                        const phoneNumberAccounts = sender;
                        const messagingStepAccounts= "2";
                        const request = new sql.Request(connection);
                        const updateAccounts = `UPDATE two_way_sms_tb SET status = @statusAccounts,isActive=@isActive, messagingStep = @messagingStepAccounts WHERE phoneNumber = @phoneNumberAccounts AND time = (
                            SELECT MAX(time) FROM two_way_sms_tb WHERE phoneNumber = @phoneNumberAccounts and status =@currentStatus )`;
                        request.input('statusAccounts', sql.VarChar, statusAccounts);
                        request.input('currentStatus', sql.VarChar, currentStatus);
                        request.input('messagingStepAccounts', sql.VarChar, messagingStepAccounts);
                        request.input('phoneNumberAccounts', sql.VarChar, phoneNumberAccounts);
                        request.input('isActive', sql.Bit, 1);
                        request.query(updateAccounts, function(err, results) {
                        if (err) {
                            console.error('Error executing query: ' + err.stack);
                            return;
                        }
                        console.log('Reset Password UPDATE successful');
                        connection.close();
                        });
                    }else if(textMessage == 10) {
                        console.log("Deactivate Account Workflow");
                        sms.sendPremium(reset.welcomeMessage(sender, LinkID));
                        const currentStatus = "existingCustomer";
                        const statusAccounts = "isDeleting";
                        const phoneNumberAccounts = sender;
                        const messagingStepAccounts= "2";
                        const request = new sql.Request(connection);
                        const updateAccounts = `UPDATE two_way_sms_tb SET status = @statusAccounts,isActive=@isActive, messagingStep = @messagingStepAccounts WHERE phoneNumber = @phoneNumberAccounts AND time = (
                            SELECT MAX(time) FROM two_way_sms_tb WHERE phoneNumber = @phoneNumberAccounts and status =@currentStatus )`;
                        request.input('statusAccounts', sql.VarChar, statusAccounts);
                        request.input('currentStatus', sql.VarChar, currentStatus);
                        request.input('messagingStepAccounts', sql.VarChar, messagingStepAccounts);
                        request.input('phoneNumberAccounts', sql.VarChar, phoneNumberAccounts);
                        request.input('isActive', sql.Bit, 1);
                        request.query(updateAccounts, function(err, results) {
                        if (err) {
                            console.error('Error executing query: ' + err.stack);
                            return;
                        }
                        console.log('Reset Password UPDATE successful');
                        connection.close();
                        });
                    }else if(textMessage == 8){
                        console.log("Rate us  Workflow");
                    }else if(textMessage ==7){
                        console.log("Help us  Workflow");
                    }else if(textMessage == 6) {
                        console.log("My Account  Workflow");
                    }else if(textMessage == 5) {
                        console.log("Products Workflow");
                    }else if(textMessage == 4) {
                        console.log("Claims/Withdrawals Workflow");
                    }else if(textMessage == 3) {
                        console.log("Deposit Workflow");
                    }else if(textMessage == 1) {
                        console.log("Balance Enquiry Workflow");
                    }else {
                        let phone= phoneNumber;
                        phone = phone.replace("+", "");
                        const checkIfExistsQuerySysUsers = "SELECT TOP 1 * FROM sys_users_tb WHERE user_mobile LIKE '%' + @phoneNumber + '%' OR user_phone LIKE '%' + @phoneNumber + '%'";
                        const checkIfExistsRequestSysUsers = new sql.Request(connection);
                        checkIfExistsRequestSysUsers.input('phoneNumber', sql.VarChar, phone);
                        checkIfExistsRequestSysUsers.query(checkIfExistsQuerySysUsers, function(checkErrSysUsers, checkResultsSysUsers) {
                            if (checkErrSysUsers) {
                                console.error('Error executing checkIfExistsQuerySysUsers: ' + checkErrSysUsers.stack);
                                connection.close();
                                return;
                            }
                            // Record exists in sys_users_tb
                            if (checkResultsSysUsers.recordset.length > 0) {
                                console.log('Record exists in sys_users_tb');
                                sms.sendPremium(register.menuMessage(sender, LinkID));
                                // ... Handle existing record logic ...
                                const status = "existingCustomer";
                                const insertQuery = "INSERT INTO two_way_sms_tb (text, text_id_AT, phoneNumber, status) VALUES (@text, @text_id_AT, @phoneNumber, @status)";
                                const insertRequest = new sql.Request(connection);
                                insertRequest.input('text', sql.VarChar, textMessage);
                                insertRequest.input('text_id_AT', sql.VarChar, textId);
                                insertRequest.input('phoneNumber', sql.VarChar, phoneNumber);
                                insertRequest.input('status', sql.VarChar, status);
                                insertRequest.query(insertQuery, function(insertErr, insertResults) {
                                    if (insertErr) {
                                        console.error('Error executing insertQuery: ' + insertErr.stack);
                                        connection.close();
                                        return;
                                    }
                                    console.log('Registered current users');
                                    connection.close();
                                });
                                // Record does not exist in sys_users_tb == a new conversion
                                } else {
                                    sms.sendPremium(register.newCustomer(sender, LinkID));
                                    console.log('Start Registration Process');
                                    // ... Handle registration process logic ... //
                                    const status = "isRegistering";
                                    const messagingStep = "2";
                                    const insertQuery = "INSERT INTO two_way_sms_tb (text, text_id_AT, status, messagingStep, phoneNumber, isActive) VALUES (@text, @text_id_AT, @status, @messagingStep, @phoneNumber, @isActive)";
                                    const insertRequest = new sql.Request(connection);
                                    insertRequest.input('text', sql.VarChar, textMessage);
                                    insertRequest.input('text_id_AT', sql.VarChar, textId);
                                    insertRequest.input('status', sql.VarChar, status);
                                    insertRequest.input('messagingStep', sql.VarChar, messagingStep);
                                    insertRequest.input('phoneNumber', sql.VarChar, phoneNumber);
                                    insertRequest.input('isActive', sql.Bit, 1); // Use true instead of 1 for boolean values
                                    insertRequest.query(insertQuery, function(insertErr, insertResults) {
                                        if (insertErr) {
                                            console.error('Error executing insertQuery: ' + insertErr.stack);
                                            connection.close();
                                            return;
                                        }
                                        console.log("New User inserted successfully");
                                    connection.close();
                                });
                            }
                        });
                    }
                }
            });
        });
    }    
}
module.exports = handleIncomingMessage;