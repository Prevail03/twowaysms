const sql = require('mssql');
var Client = require('node-rest-client').Client;
const httpProxy = require('http-proxy');
const { updateUserNameFail, updateUserNameSuccess } = require('./Database/accountDB');

function handleAccountCheck(text, sender, messagingStep, sms, account, config, textIDAT) {
    switch (parseInt(messagingStep)) {
        case 1:
            sms.send(account.provideUserName(sender));
            const statusUserName = "isCheckingAccount";
            const phoneNumberUserName = sender;
            const messagingStepUserName = "2";
            const textUserName = text;
            const textIDATUserName = textIDAT;
            updateUserNameFail(statusUserName, phoneNumberUserName, messagingStepUserName, textUserName, config, textIDATUserName);
            break;
        case 2:
            const phoneNumberUserNameS = sender;
            const textUsername = text;
            const textIDATUserNameS = textIDAT;
            updateUserNameSuccess(phoneNumberUserNameS, textUsername, textIDATUserNameS, config)
            sms.send(account.providePassword(sender));
            break;
        case 3:
            const phoneNumberPassword = sender;
            const textPassword = text;
            const textIDATPassword = textIDAT;
            sql.connect(config, function (err) {
                if (err) {
                    console.error('Error connecting to the database: ' + err.stack);
                    return;
                }
                console.log('Connected to the database');

                const request = new sql.Request();
                const updateAccounts = `UPDATE two_way_sms_tb SET status = 'isCheckingAccount', messagingStep= '3', password = @textPassword WHERE phoneNumber = @phoneNumberPassword AND text_id_AT = @textIDATPassword AND time = (SELECT MAX(time) FROM two_way_sms_tb WHERE phoneNumber = @phoneNumberPassword)`;
                request.input('phoneNumberPassword', sql.NVarChar, phoneNumberPassword);
                request.input('textIDATPassword', sql.NVarChar, textIDATPassword);
                request.input('textPassword', sql.NVarChar, textPassword);
                request.query(updateAccounts, function (err, results) {
                    if (err) {
                        console.error('Error executing query: ' + err.stack);
                        sql.close();
                        return;
                    }
                    console.log('Password UPDATE successful');
                    const statusPassword = "isCheckingAccount";
                    const phoneNumberPassword = sender;
                    const textIDATPassword = textIDAT;
                    // Bind the values to the parameters
                    const request = new sql.Request();
                    request.input('statusPassword', sql.NVarChar(50), statusPassword);
                    request.input('phoneNumberPassword', sql.NVarChar(50), phoneNumberPassword);
                    request.input('textIDATPassword', sql.VarChar(100), textIDATPassword);
                    request.query("SELECT TOP 1 * FROM two_way_sms_tb WHERE phoneNumber = @phoneNumberPassword AND status = @statusPassword AND isActive = 1 AND text_id_AT = @textIDATPassword order by time DESC", function (err, passwordResults) {
                        if (err) {
                            console.error('Error executing query: ' + err.stack);
                            return;
                        }
                        if (passwordResults.recordset.length > 0) {
                            const username = passwordResults.recordset[0].user_username;
                            const password = passwordResults.recordset[0].password;
                            var accountsClient = new Client();
                            // set content-type header and data as json in args parameter
                            var args = {
                                data: { username: username, password: password },
                                headers: { "Content-Type": "application/json" }
                            }
                            accountsClient.post("https://api.octagonafrica.com/v1/login", args, function (data, response) {
                                if ([200].includes(response.statusCode)) {
                                    // success 
                                    console.log(response.statusCode);
                                    //sms.send(account.confirmLogin(sender));
                                    var accountIDClient = new Client();
                                    var args = {
                                        data: { identifier: username },
                                        headers: { "Content-Type": "application/json" }
                                    };
                                    console.log(args);
                                    accountIDClient.get("https://api.octagonafrica.com/v1/accountsid", args, function (data, response) {
                                        if (response.statusCode === 200) {
                                            console.log(response.statusCode);
                                            const ID = data.data;
                                            console.log(JSON.stringify(ID));
                                            const phoneNumberUserID = sender;
                                            const textUserID = JSON.stringify(ID);
                                            const textIDATUserID = textIDAT;
                                            sql.connect(config, function (err) {
                                                if (err) {
                                                    console.error('Error connecting to the database: ' + err.stack);
                                                    return;
                                                }
                                                console.log('Connected to the database');
                                                const request = new sql.Request();
                                                const updateAccounts = `UPDATE two_way_sms_tb SET status = 'isCheckingAccount', messagingStep= '3', user_id = @textUserID WHERE phoneNumber = @phoneNumberUserID AND text_id_AT = @textIDATuserID AND time = (SELECT MAX(time) FROM two_way_sms_tb WHERE phoneNumber = @phoneNumberUserID)`;
                                                request.input('phoneNumberUserID', sql.NVarChar, phoneNumberUserID);
                                                request.input('textIDATUserID', sql.NVarChar, textIDATUserID);
                                                request.input('textUserID', sql.NVarChar, textUserID);
                                                request.query(updateAccounts, function (err, results) {
                                                    if (err) {
                                                        console.error('Error executing query: ' + err.stack);
                                                        sql.close();
                                                        return;
                                                    }
                                                    console.log('User ID UPDATE successful');
                                                    console.log('Query results:', results);
                                                    const statusUserIDRequest = "isCheckingAccount";
                                                    const phoneNumberUserIDRequest = sender;
                                                    const textIDATUserIDRequest = textIDAT;
                                                    // Bind the values to the parameters
                                                    const request = new sql.Request();
                                                    request.input('statusUserIDRequest', sql.NVarChar(50), statusUserIDRequest);
                                                    request.input('phoneNumberUserIDRequest', sql.NVarChar(50), phoneNumberUserIDRequest);
                                                    request.input('textIDATUserIDRequest', sql.VarChar(100), textIDATUserIDRequest);
                                                    request.query("SELECT TOP 1 * FROM two_way_sms_tb WHERE phoneNumber = @phoneNumberUserIDRequest AND status = @statusUserIDRequest AND isActive = 1 AND text_id_AT = @textIDATUserIDRequest order by time DESC", function (err, userIDResults) {
                                                        if (err) {
                                                            console.error('Error executing query: ' + err.stack);
                                                            return;
                                                        }
                                                        if (userIDResults.recordset.length > 0) {
                                                            const userID = userIDResults.recordset[0].user_id;
                                                            console.log(userID);
                                                        }
                                                        sql.close();
                                                    });
                                                });
                                            });

                                        } else if (response.statusCode === 400) {
                                            console.log(response.statusCode);
                                        } else {
                                            console.error(response.statusCode, data);
                                            console.log(response.statusCode);
                                        }
                                    });
                                } else if ([400].includes(response.statusCode)) {
                                    console.log(response.statusCode);
                                    sms.send({
                                        to: sender,
                                        from: '20880',
                                        message: " Invalid Details!!. Check your details and please try again Later "
                                    });
                                    const statuserror404 = "ResetPasswordFailed";
                                    const messagingSteperror404 = "0";
                                    const phoneNumbererror404 = phoneNumberPassword;
                                    const textIDATerror404 = textIDAT;
                                    const updateFail = `UPDATE two_way_sms_tb SET status = @statuserror404, messagingStep = @messagingSteperror404  WHERE phoneNumber = @phoneNumbererror404 AND text_id_AT =@textIDATerror404 AND time = (
                                                     SELECT MAX(time) FROM two_way_sms_tb WHERE phoneNumber = @phoneNumbererror404 )`;
                                    request.input('statuserror404', sql.VarChar, statuserror404);
                                    request.input('messagingSteperror404', sql.VarChar, messagingSteperror404);
                                    request.input('phoneNumbererror404', sql.NVarChar, phoneNumbererror404);
                                    request.input('textIDATerror404', sql.NVarChar, textIDATerror404);
                                    request.query(updateFail, function (err, results) {
                                        if (err) {
                                            console.error('Error executing query: ' + err.stack);
                                            return;
                                        }
                                        console.log(' Reset Password Attempt unsuccessful');
                                        sql.close();
                                    });
                                }
                                else if ([500].includes(response.statusCode)) {
                                    console.log(response.statusCode);
                                    sms.send({
                                        to: sender,
                                        from: '20880',
                                        message: " Invalid request. Please input your National Id and password. "
                                    });

                                    const statuserror500 = "ResetPasswordFailed";
                                    const messagingSteperror500 = "0";
                                    const phoneNumbererror500 = phoneNumberPassword;
                                    const textIDATerror500 = textIDAT;
                                    const updateFail = `UPDATE two_way_sms_tb SET status = @statuserror500, messagingStep = @messagingSteperror500  WHERE phoneNumber = @phoneNumbererror500 AND text_id_AT =@textIDATerror500 AND time = (
                                             SELECT MAX(time) FROM two_way_sms_tb WHERE phoneNumber = @phoneNumbererror500 )`;
                                    request.input('statuserror500', sql.VarChar, statuserror500);
                                    request.input('messagingSteperror500', sql.VarChar, messagingSteperror500);
                                    request.input('phoneNumbererror500', sql.NVarChar, phoneNumbererror500);
                                    request.input('textIDATerror500', sql.NVarChar, textIDATerror500);
                                    request.query(updateFail, function (err, results) {
                                        if (err) {
                                            console.error('Error executing query: ' + err.stack);
                                            return;
                                        }
                                        console.log(' Reset Password Attempt unsuccessful');
                                        sql.close();
                                    });
                                } else {
                                    // error code
                                    console.log(response.statusCode);
                                }
                            });
                        }
                        sql.close();
                    });
                });
            });


            break;
        case 4:
            user.description = text;
            var fetchPeriodsClient = new Client();
            // set content-type header and data as json in args parameter

            var args = {
                data: { description: user.description },
                headers: { "Content-Type": "application/json" }
            };

            fetchPeriodsClient.get("https://api.octagonafrica.com/v1/accounts/pension/periods/twoway", args, function (data, response) {
                if ([200].includes(response.statusCode)) {
                    console.log(response.statusCode);
                    const periods = data.data;
                    let finalMessage = "Available periods are: \n";
                    for (let i = 0; i < periods.length; i++) {
                        const period_name = periods[i].period_name;
                        finalMessage += `${i + 1}. ${period_name}\n`;
                    }

                    sms.send({
                        to: sender,
                        from: '20880',
                        message: finalMessage
                    });
                    sms.send(account.providePeriodName(sender));
                    accountStep = 5;

                } else if ([201].includes(response.statusCode)) {
                    console.log(response.statusCode);
                } else if ([400].includes(response.statusCode)) {
                    console.log(response.statusCode);
                } else if ([401].includes(response.statusCode)) {
                    console.log(response.statusCode);
                } else if ([500].includes(response.statusCode)) {
                    console.log(response.statusCode);
                } else {
                    console.log(response.statusCode);
                }
            });
            break;

        case 5:
            user.periodname = text;
            var fetchPeriodsIDClient = new Client();
            // set content-type header and data as json in args parameter
            var args = {
                data: { periodname: user.periodname },
                headers: { "Content-Type": "application/json" }
            };

            fetchPeriodsIDClient.get("https://api.octagonafrica.com/v1/accounts/pension/twoway/periodsid", args, function (data, response) {
                if ([200].includes(response.statusCode)) {
                    const periodID = data.data;
                    console.log(periodID);

                    //send member sta
                    var fetchMemberStatements = new Client();
                    // set content-type header and data as json in args parameter
                    var args = {
                        data: { user_id: user.IDNumber, period_id: periodID },
                        headers: { "Content-Type": "application/json" }
                    };
                    fetchMemberStatements.get("https://api.octagonafrica.com/v1/accounts/member_statement", args, function (data, response) {
                        if ([200].includes(response.statusCode)) {
                            const statementsData = data.data;
                            console.log("statements Data .");
                            console.log(statementsData);
                            const name = statementsData.name;
                            const email = statementsData.user_email;
                            console.log(name);
                            console.log(email);
                            const periodsName = statementsData.period_name;
                            sms.send({
                                to: sender,
                                from: '20880',
                                message: "Dear " + name + ".\n Your member statement for " + periodsName + " period has been sent to  " + email
                            });
                        } else if ([400].includes(response.statusCode)) {
                            console.log(response.statusCode);
                        } else if ([500].includes(response.statusCode)) {
                            console.log(response.statusCode);
                        } else {
                            console.log(response.statusCode);
                        }
                    });

                } else if ([400].includes(response.statusCode)) {
                    console.log(response.statusCode);
                } else if ([500].includes(response.statusCode)) {
                    console.log(response.statusCode);
                } else {
                    console.log(response.statusCode);
                }
            });

            break;
        default:
            // do sthg
            sms.send(account.wrongResponse(sender));
            break;
    }
}

module.exports = handleAccountCheck;