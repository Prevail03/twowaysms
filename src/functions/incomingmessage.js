const sql = require('mssql');
var Client = require('node-rest-client').Client;
const validateId = require('../validateId');
const handleRegister = require('./handleRegister');
const handleDelete = require('./handleDelete');
const handleAccountCheck = require('./handleAccountCheck');
const handlePasswordReset = require('./handlePasswordReset');
const reset =require('../reset')

let user={};
function handleIncomingMessage(textMessage, sender, textId, phoneNumber, config, sms , register, account,LinkID) {
    // Check if user exists in database
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
                sql.close();
                return;
            }
            if (checkResults.recordset.length > 0) {
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
                    console.log('Unknown status: ' + status);
                    break;
                }
            } else {
                //new user in the system insert nad send a message to the user with respect to the keyword used.
                const insertQuery = "INSERT INTO two_way_sms_tb (text, text_id_AT, phoneNumber, isActive) VALUES (@text, @text_id_AT, @phoneNumber, @isActive)";
                console.log('Loogs');
                const insertRequest = new sql.Request(connection);
                insertRequest.input('text', sql.VarChar, textMessage);
                insertRequest.input('text_id_AT', sql.VarChar, textId);
                insertRequest.input('phoneNumber', sql.VarChar, phoneNumber);
                insertRequest.input('isActive', sql.Bit, 1);
                insertRequest.query(insertQuery, function(insertErr, insertResults) {
                if (insertErr) {
                    console.error('Error executing insertQuery: ' + insertErr.stack);
                    sql.close();
                    return;
                }
                switch (textMessage.toLowerCase()) {
                    case 'register'://register 
                        sms.sendPremium(register.newCustomer(sender,LinkID));
                        // sms.sendPremium(register.enterId(sender,LinkID));
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
                            sql.close();
                            });
                        });
                    break;
                        
                        ///other Cases
                        case 'balance':
                        messageToCustomer = ' Dear Esteemed Customer, Welcome to Octagon Services. Enter your 4 digit pin - balance ';
                        sms.send({
                            to: sender,
                            from:'24123',
                            message: messageToCustomer
                        });
                        break;
                        case 'accounts':
                            
                            const statusAccounts = "isCheckingAccount";
                            const phoneNumberAccounts = sender;
                            const messagingStepAccounts= "2";
                            sql.connect(config, function(err) {
                                const request = new sql.Request();
                                const updateAccounts = `UPDATE two_way_sms_tb SET status = @statusAccounts, messagingStep = @messagingStepAccounts WHERE phoneNumber = @phoneNumberAccounts AND time = (
                                    SELECT MAX(time) FROM two_way_sms_tb WHERE phoneNumber = @phoneNumberAccounts )`;
                                request.input('statusAccounts', sql.VarChar, statusAccounts);
                                request.input('messagingStepAccounts', sql.VarChar, messagingStepAccounts);
                                request.input('phoneNumberAccounts', sql.VarChar, phoneNumberAccounts);
                                request.query(updateAccounts, function(err, results) {
                                if (err) {
                                    console.error('Error executing query: ' + err.stack);
                                    return;
                                }
                                console.log('UPDATE successful');
                                sql.close();
                                });
                            });
                            sms.sendPremium(account.welcomeMessageAccount(sender,LinkID));
                            sms.sendPremium(account.provideUserName(sender,LinkID));
                            break;
                        case 'rate':
                            messageToCustomer = 'Dear Esteemed Customer, Welcome to Octagon Services. Enter your 4 digit pin - rate';
                            sms.send({
                                to: sender,
                                from:'24123',
                                message: messageToCustomer
                            }); 
                            break;
                        case 'delete':
                            messageToCustomer = 'Dear Esteemed Customer, Welcome to Octagon Africa.To delete your account please share the following data.';
                            sms.sendPremimum({
                                to: sender,
                                from:'24123',
                                message: messageToCustomer
                            });
                            sms.sendPremium(register.enterId(sender,LinkID));
                            const statusDeleting = "isDeleting";
                            const phoneNumberDeleting = sender;
                            const messagingStepDeleting= "2";
                            sql.connect(config, function(err) {
                                const request = new sql.Request();
                                const updateDelete = `UPDATE two_way_sms_tb SET status = @statusDeleting, messagingStep = @messagingStepDeleting WHERE phoneNumber = @phoneNumberDeleting AND time = (
                                    SELECT MAX(time) FROM two_way_sms_tb WHERE phoneNumber = @phoneNumberDeleting )`;
                                request.input('statusDeleting', sql.VarChar, statusDeleting);
                                request.input('messagingStepDeleting', sql.VarChar, messagingStepDeleting);
                                request.input('phoneNumberDeleting', sql.VarChar, phoneNumberDeleting);
                                request.query(updateDelete, function(err, results) {
                                if (err) {
                                    console.error('Error executing query: ' + err.stack);
                                    return;
                                }
                                console.log('UPDATE successful');
                                sql.close();
                                });
                            });
                            break;
                        case 'reset':
                            sms.sendPremium(reset.welcomeMessage(sender));
                            sms.sendPremium(reset.enterEmail(sender));
                            const statusReset = "ResetingPassword";
                            const phoneNumberReset = sender;
                            const messagingStepReset= "2";
                            sql.connect(config, function(err) {
                                const request = new sql.Request();
                                const updateReset = `UPDATE two_way_sms_tb SET status = @statusReset, messagingStep = @messagingStepReset WHERE phoneNumber = @phoneNumberReset AND time = (
                                    SELECT MAX(time) FROM two_way_sms_tb WHERE phoneNumber = @phoneNumberReset )`;
                                request.input('statusReset', sql.VarChar, statusReset);
                                request.input('messagingStepReset', sql.VarChar, messagingStepReset);
                                request.input('phoneNumberReset', sql.VarChar, phoneNumberReset);
                                request.query(updateReset, function(err, results) {
                                if (err) {
                                    console.error('Error executing query: ' + err.stack);
                                    return;
                                }
                                console.log('UPDATE successful');
                                sql.close();
                                });
                            });
                            break;   
                    default:
                        messageToCustomer = 'Welcome To Octagon Africa you can access our services by sending the word Register,Balance, Accounts, Reset,Delete ';
                        sms.sendPermium({
                            to: sender,
                            from:'24123',
                            message: messageToCustomer,
                            bulkSMSMode: 0,
                            keyword: 'pension',
                            linkId: LinkID
                        });
                    break;
                }
                });
            }
        });
    });
}
module.exports = handleIncomingMessage;