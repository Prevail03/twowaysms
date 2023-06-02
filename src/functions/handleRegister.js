const sql = require('mssql');
const { InvalidNationalID, updateNationalID, updateEmail, failedIDNumber,updateFirstName, updateLastname, updatePassword } = require('./Database/registerDB');

let user = {};
let registrationStep = 0;
function handleRegister(textMessage, sender, messagingStep, sms, register, config, phoneNumber, textIDAT, LinkID) {

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
                const statusEmail = "isRegistering";
                const phoneNumberEmail = phoneNumber;
                const messagingStepEmail = "3";
                const textIDNumber = textMessage;
                const textIDATEmail = textIDAT;
                sql.connect(config, function(err, connection) {
                    if (err) {
                        console.error('Error connecting to database: ' + err.stack);
                        return;
                    }
                    console.log('Connected to database');
        
                    const checkIfExistsQuery = "SELECT TOP 1 * FROM sys_users_tb WHERE user_national_id = @textIDNumber";
                    const checkIfExistsRequest = new sql.Request(connection);
                    checkIfExistsRequest.input('textIDNumber', sql.VarChar, textIDNumber);
                    checkIfExistsRequest.query(checkIfExistsQuery, function(checkErr, checkResults) {
                        if (checkErr) {
                        console.error('Error executing checkIfExistsQuery: ' + checkErr.stack);
                        connection.close();
                        return;
                        }
                        if (checkResults.recordset.length > 0) {
                            console.log("Existing user. Login");
                            sms.sendPremium(register.menuMessage(sender, LinkID));
                                // ... Handle existing record logic ..
                                const status="existingCustomer";
                                const messagingStep = "0";
                                const phoneNumber = sender;
                                const isActive = 0;
                                const request = new sql.Request();
                                const updateRegister1 = `UPDATE two_way_sms_tb SET status = @status, isActive=@isActive, messagingStep = @messagingStep WHERE phoneNumber = @phoneNumber AND time = (
                                SELECT MAX(time) FROM two_way_sms_tb WHERE phoneNumber = @phoneNumber )`;
                                request.input('status', sql.VarChar, status);
                                request.input('messagingStep', sql.VarChar, messagingStep);
                                request.input('phoneNumber', sql.VarChar, phoneNumber);
                                request.input('isActive', sql.Bit, isActive);
                                request.query(updateRegister1, function (err, results) {
                                if (err) {
                                    console.error('Error executing query: ' + err.stack);
                                    return;
                                }
                                console.log('Menu Sent');
                                });
                        }else{
                           sms.sendPremium(register.enterEmail(sender,LinkID));
                           updateNationalID(statusEmail,phoneNumberEmail,messagingStepEmail,textIDNumber,textIDATEmail,config);
                        }

                        });

                    });   
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
            const statusPassword = "isRegistering";
            const phoneNumberPassword = phoneNumber;
            const messagingStepPassword = "4";
            const textEmail = textMessage;
            const textIDATPass = textIDAT;
            sql.connect(config, function(err, connection) {
                if (err) {
                    console.error('Error connecting to database: ' + err.stack);
                    return;
                }
                console.log('Connected to database');
                const checkIfExistsQuery = "SELECT TOP 1 * FROM sys_users_tb WHERE user_email = @textEmail";
                const checkIfExistsRequest = new sql.Request(connection);
                checkIfExistsRequest.input('textEmail', sql.VarChar, textEmail);
                checkIfExistsRequest.query(checkIfExistsQuery, function(checkErr, checkResults) {
                    if (checkErr) {
                    console.error('Error executing checkIfExistsQuery: ' + checkErr.stack);
                    connection.close();
                    return;
                    }
                    if (checkResults.recordset.length > 0) {
                        console.log("Existing user. Login");
                        sms.sendPremium(register.menuMessage(sender, LinkID));
                            // ... Handle existing record logic ..
                            const status="existingCustomer";
                            const messagingStep = "0";
                            const phoneNumber = sender;
                            const isActive = 0;
                            const request = new sql.Request();
                            const updateRegister1 = `UPDATE two_way_sms_tb SET status = @status, isActive=@isActive, messagingStep = @messagingStep WHERE phoneNumber = @phoneNumber AND time = (
                            SELECT MAX(time) FROM two_way_sms_tb WHERE phoneNumber = @phoneNumber )`;
                            request.input('status', sql.VarChar, status);
                            request.input('messagingStep', sql.VarChar, messagingStep);
                            request.input('phoneNumber', sql.VarChar, phoneNumber);
                            request.input('isActive', sql.Bit, isActive);
                            request.query(updateRegister1, function (err, results) {
                            if (err) {
                                console.error('Error executing query: ' + err.stack);
                                return;
                            }
                            console.log('Menu Sent');
                            });
                    }else{
                       sms.sendPremium(register.enterPassword(sender,LinkID));    
                       updateEmail(statusPassword,phoneNumberPassword,messagingStepPassword,textEmail,textIDATPass,config);
                    }

                    });

            });
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
            // 1. Return firstname
            // 2. Combine fname and lastname
            // 3. Check if the combination exists
            // 4. Call the functions
            sql.connect(config, function (err, connection) {
                if (err) {
                    console.error('Error connecting to the database: ' + err.stack);
                    return;
                }
                console.log('Connected to the database');
                // 1. Return firstname
                const checkIfExistsQuery = "SELECT TOP 1 * FROM two_way_sms_tb WHERE phoneNumber = @phoneNumberEnd AND status = 'isRegistering' AND isActive = 0 AND text_id_AT = @textIDEnding ORDER BY time DESC";
                const checkIfExistsRequest = new sql.Request(connection);
                checkIfExistsRequest.input('phoneNumberEnd', sql.VarChar, phoneNumberEnd);
                checkIfExistsRequest.input('textIDEnding', sql.VarChar, textIDEnding);
                checkIfExistsRequest.query(checkIfExistsQuery, function (checkErr, checkResults) {
                    if (checkErr) {
                    console.error('Error executing checkIfExistsQuery: ' + checkErr.stack);
                    connection.close();
                    return;
                    }
                    if (checkResults.recordset.length > 0) {
                    const firstname = checkResults.recordset[0].firstname;
                    // 2. Combine fname and lastname
                    let username = firstname + '.' + textLname;
                    username = username.toLowerCase();
                    console.log(username);
                    // 3. Check if the combination exists
                    const checkUsernameExistsQuery = "SELECT TOP 1 * FROM sys_users_tb WHERE user_username = @username";
                    const checkUsernameExistsRequest = new sql.Request(connection);
                    checkUsernameExistsRequest.input('username', sql.VarChar, username);
                    checkUsernameExistsRequest.query(checkUsernameExistsQuery, function (checkUsernameErr, checkUsernameResults) {
                        if (checkUsernameErr) {
                        console.error('Error executing checkUsernameExistsQuery: ' + checkUsernameErr.stack);
                        connection.close();
                        return;
                        }
                        if (checkUsernameResults.recordset.length > 0) {
                        console.log("Existing user. Login");
                        sms.sendPremium(register.menuMessage(sender, LinkID));
                        // Handle existing record logic
                        const status = "existingCustomer";
                        const messagingStep = "0";
                        const phoneNumber = sender;
                        const isActive = 0;
                        const updateRegister1 = `UPDATE two_way_sms_tb SET status = @status, isActive = @isActive, messagingStep = @messagingStep WHERE phoneNumber = @phoneNumber AND time = (
                            SELECT MAX(time) FROM two_way_sms_tb WHERE phoneNumber = @phoneNumber
                        )`;
                        const request = new sql.Request();
                        request.input('status', sql.VarChar, status);
                        request.input('messagingStep', sql.VarChar, messagingStep);
                        request.input('phoneNumber', sql.VarChar, phoneNumber);
                        request.input('isActive', sql.Bit, isActive);
                        request.query(updateRegister1, function (err, results) {
                            if (err) {
                            console.error('Error executing updateRegister1 query: ' + err.stack);
                            connection.close();
                            return;
                            }
                            console.log('Menu Sent');
                            connection.close();
                        });
                        } else {
                        // 4. Call the functions
                        console.log('Invoke Login API');
                        updateLastname(statusEnd, messagingStepEnd, phoneNumberEnd, textLname, textIDEnding, config, phoneNumber, textIDAT, sms, LinkID);
                        connection.close();
                        }
                    });
                    } else {
                    connection.close();
                    }
                });
            });
            break;
        default:
            console.log('Unknown registration step:');
            break;
    }
}
module.exports = handleRegister;