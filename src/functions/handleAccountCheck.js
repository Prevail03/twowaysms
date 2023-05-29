const sql = require('mssql');
var Client = require('node-rest-client').Client;
const { updateUserNameFail, updateUserNameSuccess, updatePassword, updateDescription,updatePeriodName } = require('./Database/accountDB');
const { countBy } = require('lodash');

function handleAccountCheck(textMessage, sender, messagingStep, sms, account, config, textIDAT, LinkID) {
    switch (parseInt(messagingStep)) {
        case 1:
            sms.sendPremium(account.provideUserName(sender,LinkID));
            const statusUserName = "isCheckingAccount";
            const phoneNumberUserName = sender;
            const messagingStepUserName = "2";
            const textUserName = textMessage;
            const textIDATUserName = textIDAT;
            updateUserNameFail(statusUserName, phoneNumberUserName, messagingStepUserName, textUserName, config, textIDATUserName);
            break;
        case 2:
            const phoneNumberUserNameS = sender;
            const textUsername = textMessage;
            const textIDATUserNameS = textIDAT;
            updateUserNameSuccess(phoneNumberUserNameS, textUsername, textIDATUserNameS, config)
            sms.sendPremium(account.providePassword(sender,LinkID));
            break;
        case 3:
            const phoneNumberPassword = sender;
            const textPassword = textMessage;
            const textIDATPassword = textIDAT;
            updatePassword(phoneNumberPassword, textPassword, textIDATPassword, sender, config, textIDAT, sms, account, LinkID);
            break;
        case 4:
            const phoneNumberDescription = sender;
            const accountDescription = textMessage;
            const textIDATDescription = textIDAT;
            let textDescription = "";
            sql.connect(config, function(err, connection) {
            if (err) {
                console.error('Error connecting to database: ' + err.stack);
                return;
            }
            console.log('Connected to database');

            const checkIfExistsQuery = "SELECT TOP 1 * FROM two_way_sms_tb WHERE phoneNumber = @phoneNumberDescription AND isActive = 1 AND status = 'isCheckingAccount' AND time = (SELECT MAX(time) FROM two_way_sms_tb WHERE phoneNumber = @phoneNumberDescription)";
            const checkIfExistsRequest = new sql.Request(connection);
            checkIfExistsRequest.input('phoneNumberDescription', sql.VarChar, phoneNumberDescription);
            checkIfExistsRequest.query(checkIfExistsQuery, function(checkErr, checkResults) {
                if (checkErr) {
                console.error('Error executing checkIfExistsQuery: ' + checkErr.stack);
                connection.close();
                return;
                }
                if (checkResults.recordset.length > 0) {
                    const allAccounts = checkResults.recordset[0].allAccounts;
                    const accountsArray = allAccounts.split(',')
                        .map(account => account.trim().replace(/^\d+\.\s*/, ''))
                        .filter(account => account !== '');

                    console.log("Array count:", accountsArray.length);
                    if (accountDescription >= 1 && accountDescription <= accountsArray.length) {
                        const selectedAccount = accountsArray[accountDescription - 1];
                        console.log("Selected account:", selectedAccount);
                        textDescription = selectedAccount;
                        console.log("Account Description: " + textDescription);
                        updateDescription(phoneNumberDescription, textDescription, textIDATDescription, sender, config, textIDAT, sms, account, LinkID);
                    } else {
                        console.log("Invalid account description");
                    }
                } else {
                console.log('Record does not exist');
                }
            });
            });
            break;
        case 5:
            //perdiodname//
            const phoneNumberperiodName = sender;
            const periodNumber = textMessage;
            const textIDATperiodName = textIDAT;
            let textperiodName = "";
            sql.connect(config, function(err, connection) {
            if (err) {
                console.error('Error connecting to database: ' + err.stack);
                return;
            }
            console.log('Connected to database');

            const checkIfExistsQuery = "SELECT TOP 1 * FROM two_way_sms_tb WHERE phoneNumber = @phoneNumberperiodName AND isActive = 1 AND status = 'isCheckingAccount' AND time = (SELECT MAX(time) FROM two_way_sms_tb WHERE phoneNumber = @phoneNumberperiodName)";
            const checkIfExistsRequest = new sql.Request(connection);
            checkIfExistsRequest.input('phoneNumberperiodName', sql.VarChar, phoneNumberperiodName);
            checkIfExistsRequest.query(checkIfExistsQuery, function(checkErr, checkResults) {
                if (checkErr) {
                console.error('Error executing checkIfExistsQuery: ' + checkErr.stack);
                connection.close();
                return;
                }
                if (checkResults.recordset.length > 0) {
                    console.log('Check periods');
                    const allPeriods = checkResults.recordset[0].allPeriods;
                    console.log(allPeriods);
                } else {
                console.log('Record does not exist');
                }
            });
            });




            // updatePeriodName(phoneNumberperiodName, textperiodName, textIDATperiodName, sender, config, textIDAT, sms,LinkID);
            break;
        default:
            // do sthg
            sms.sendPremium(account.wrongResponse(sender, LinkID));
            break;
    }
}

module.exports = handleAccountCheck;