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
                    console.log('Query results:', results);
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
                            console.log(username);
                            console.log(password);
                            var accountsClient = new Client();
                            // set content-type header and data as json in args parameter
                            var args = {
                                data: { username: username, password: password },
                                headers: { "Content-Type": "application/json" }
                            };
                            console.log(args);
                            accountsClient.post("https://api.octagonafrica.com/v1/login", args, function (data, response) {
                                if ([200].includes(response.statusCode)) {
                                    // success code
                                    sms.send(account.confirmLogin(sender));
                                    var accountIDClient = new Client();
                                    var args = {
                                        data: { identifier: username },
                                        headers: { "Content-Type": "application/json" }
                                    };
                                    console.log(args);
                                    accountIDClient.get("https://api.octagonafrica.com/v1/accountsid", args, function (data, response) {
                                        if (response.statusCode === 200) {
                                            const ID = data.data;
                                            console.log(ID);
                                        } else if (response.statusCode === 400) {
                                            console.log(response.statusCode);
                                        } else {
                                            console.error(response.statusCode, data);
                                            console.log(response.statusCode);
                                        }
                                    });
                                } else if ([201].includes(response.statusCode)) {
                                    console.log(response.statusCode);
                                } else if ([400].includes(response.statusCode)) {
                                    console.log(response.statusCode);
                                    sms.send({
                                        to: sender,
                                        from: '20880',
                                        message: " Invalid Details!!. Check your details and please try again Later "
                                    });
                                } else if ([401].includes(response.statusCode)) {
                                    console.log(response.statusCode);
                                    sms.send({
                                        to: sender,
                                        from: '20880',
                                        message: " Authentication failed. Incorrect password or username. Access denied "
                                    });
                                }

                                else if ([500].includes(response.statusCode)) {
                                    console.log(response.statusCode);
                                    sms.send({
                                        to: sender,
                                        from: '20880',
                                        message: " Invalid request. Please input your National Id and password. "
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
                            accountStep = 0;
                            isCheckingAccount = false;
                            user = {};
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
        default:
            // do sthg
            sms.send(account.wrongResponse(sender));
            break;
    }
}

module.exports = handleAccountCheck;