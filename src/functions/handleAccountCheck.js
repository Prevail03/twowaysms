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

            const statusAccounts = "isCheckingAccount";
            const phoneNumberAccounts = sender;
            const messagingStepAccounts = "3";
            const textAccountsUserName = text;
            const textIDATAccountsUserName = textIDAT;
            sql.connect(config, function (err) {
                const request = new sql.Request();
                const updateRegister1 = `UPDATE two_way_sms_tb SET status = @statusAccounts, messagingStep = @messagingStepAccounts, user_username =  WHERE phoneNumber = @phoneNumberAccounts AND text_id_AT = @textIDATAccountsUserName AND time = (
                SELECT MAX(time) FROM two_way_sms_tb WHERE phoneNumber = @phoneNumberAccounts )`;
                request.input('statusAccounts', sql.NVarChar, statusAccounts);
                request.input('messagingStepAccounts', sql.VarChar, messagingStepAccounts);
                request.input('phoneNumberAccounts', sql.NVarChar, phoneNumberAccounts);
                request.input('textAccountsUserName', sql.NVarChar, textAccountsUserName);
                request.input('textIDATAccountsUserName', sql.NVarChar, textIDATAccountsUserName);
                request.query(updateRegister1, function (err, results) {
                    if (err) {
                        console.error('Error executing query: ' + err.stack);
                        return;
                    }
                    console.log('UPDATE successful');
                    sql.close();
                });
            });
            //updateUserNameSuccess(statusUserNameSuccess, phoneNumberUserNameSuccess, messagingStepUserNameSuccess, textUserNameSuccess, textIDATUserNameSuccess,config);
            // sms.send(account.providePassword(sender));
            break;
        case 3:
            user.password = text;
            //send to octagon Login API
            //confirm login
            var accountsClient = new Client();
            // set content-type header and data as json in args parameter
            var args = {
                data: { username: user.username, password: user.password },
                headers: { "Content-Type": "application/json" }
            };

            accountsClient.post("https://api.octagonafrica.com/v1/login", args, function (data, response) {
                if ([200].includes(response.statusCode)) {
                    // success code
                    sms.send(account.confirmLogin(sender));

                    var accountIDClient = new Client();
                    var args = {
                        data: { identifier: user.username },
                        headers: { "Content-Type": "application/json" }
                    };
                    accountIDClient.get("https://api.octagonafrica.com/v1/accountsid", args, function (data, response) {
                        if (response.statusCode === 200) {
                            const ID = data.data;
                            console.log(ID);
                            user.IDNumber = ID;
                            var fetchClient = new Client();
                            // set content-type header and data as json in args parameter
                            var args = {
                                data: { user_id: ID },
                                headers: { "Content-Type": "application/json" }
                            };
                            fetchClient.get("https://api.octagonafrica.com/v1/accounts", args, function (data, response) {

                                if ([200].includes(response.statusCode)) {
                                    // success code
                                    console.log(response.statusCode)

                                    const insurance = data.insurance;
                                    const pension = data.pension;
                                    const trust = data.trust;
                                    // const totalAccounts = insurance.total_accounts;
                                    const totalAccountsInsurance = insurance.total_accounts;
                                    const insuranceData = insurance.data;
                                    const totalAccountsPension = pension.total_accounts;
                                    const pensionData = pension.data;
                                    //Dear custoomer here are yoour accoiunt  
                                    let preAccounts = "Dear " + user.username + ", Here are your accounts \n "
                                    let insuranceMessage = "";
                                    for (let i = 0; i < totalAccountsInsurance; i++) {
                                        insuranceMessage += " Insurance Account Description: " + insuranceData[i].Code + " Name: " + insuranceData[i].Description + " .Active Since: " + insuranceData[i].dateFrom + ".\n";
                                        console.log("Account Description:", insuranceData[i].Code, "Name: ", insuranceData[i].Description, ". Active Since: ", insuranceData[i].dateFrom);
                                    }
                                    let pensionMessage = "";
                                    for (let i = 0; i < totalAccountsPension; i++) {
                                        pensionMessage += " Pension Account Description: " + pensionData[i].Code + " Name: " + pensionData[i].scheme_name + " .Active Since: " + pensionData[i].dateFrom + ".\n";
                                        console.log("Account Description:", pensionData[i].Code, "Name: ", pensionData[i].scheme_name, ".Active Since: ", pensionData[i].dateFrom);
                                    }
                                    let postAccounts = "Please provide us with the account description so that we can provide you with a member statement "
                                    const finalMessage = preAccounts + insuranceMessage + pensionMessage + postAccounts;
                                    //Send your 
                                    sms.send({
                                        to: sender,
                                        from: '20880',
                                        message: finalMessage
                                    });
                                    accountStep = 4;

                                } else if ([400].includes(response.statusCode)) {
                                    console.log(response.statusCode);
                                } else {
                                    // error code
                                    console.log(response.statusCode);
                                }
                            });
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