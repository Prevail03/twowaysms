const sql = require('mssql');
var Client = require('node-rest-client').Client;
const httpProxy = require('http-proxy');
const { updateUserNameFail, updateUserNameSuccess,updatePassword } = require('./Database/accountDB');

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
            updatePassword(phoneNumberPassword, textPassword, textIDATPassword, sender, config,textIDAT, sms, account);
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