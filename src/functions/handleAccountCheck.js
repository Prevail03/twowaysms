const sql = require('mssql');
var Client = require('node-rest-client').Client;
const httpProxy = require('http-proxy');
const { updateUserNameFail, updateUserNameSuccess, updatePassword, updateDescription } = require('./Database/accountDB');

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
            updatePassword(phoneNumberPassword, textPassword, textIDATPassword, sender, config, textIDAT, sms, account);
            break;



        case 5:
            //perdiodname
            const phoneNumberperiodName = sender;
            const textperiodName = text;
            const textIDATperiodName = textIDAT;
            sql.connect(config, function (err) {
                if (err) {
                    console.error('Error connecting to the database: ' + err.stack);
                    return;
                }
                console.log('Connected to the database');

                const request = new sql.Request();
                const updateAccounts = `UPDATE two_way_sms_tb SET status = 'isCheckingAccount', messagingStep= '5', periodname = @textperiodName WHERE phoneNumber = @phoneNumberperiodName AND text_id_AT = @textIDATperiodName AND time = (SELECT MAX(time) FROM two_way_sms_tb WHERE phoneNumber = @phoneNumberperiodName)`;
                request.input('phoneNumberperiodName', sql.NVarChar, phoneNumberperiodName);
                request.input('textIDATperiodName', sql.NVarChar, textIDATperiodName);
                request.input('textperiodName', sql.NVarChar, textperiodName);
                request.query(updateAccounts, function (err, results) {
                    if (err) {
                        console.error('Error executing query: ' + err.stack);
                        sql.close();
                        return;
                    }
                    console.log('periodName UPDATE successful');
                    const statusperiodName = "isCheckingAccount";
                    const phoneNumberperiodName = sender;
                    const textIDATperiodName1 = textIDAT;
                    // Bind the values to the parameters
                    const request = new sql.Request();
                    request.input('statusperiodName', sql.NVarChar(50), statusperiodName);
                    request.input('phoneNumberperiodName', sql.NVarChar(50), phoneNumberperiodName);
                    request.input('textIDATperiodName1', sql.NVarChar(50), textIDATperiodName1);
                    request.query("SELECT TOP 1 * FROM two_way_sms_tb WHERE phoneNumber = @phoneNumberperiodName AND status = @statusperiodName AND isActive = 1 AND text_id_AT = @textIDATperiodName1 order by time DESC", function (err, periodNameResults) {
                        if (err) {
                            console.error('Error executing query: ' + err.stack);
                            return;
                        }

                        if (periodNameResults.recordset.length > 0) {
                            const periodname = periodNameResults.recordset[0].periodname;
                            var fetchPeriodsIDClient = new Client();
                            // set content-type header and data as json in args parameter
                            var args = {
                                data: { periodname: periodname },
                                headers: { "Content-Type": "application/json" }
                            };

                            fetchPeriodsIDClient.get("https://api.octagonafrica.com/v1/accounts/pension/twoway/periodsid", args, function (data, response) {
                                if ([200].includes(response.statusCode)) {
                                    const periodID = data.data;
                                    console.log(periodID);
                                    console.log(response.statusCode);
                                    const phoneNumberperiodID = sender;
                                    const textperiodID = periodID;
                                    const textIDATperiodID = textIDAT;
                                    sql.connect(config, function (err) {
                                        if (err) {
                                            console.error('Error connecting to the database: ' + err.stack);
                                            return;
                                        }
                                        console.log('Connected to the database');

                                        const request = new sql.Request();
                                        const updateAccounts = `UPDATE two_way_sms_tb SET status = 'isCheckingAccount', messagingStep= '5', periodID = @textperiodID WHERE phoneNumber = @phoneNumberperiodID AND text_id_AT = @textIDATperiodID AND time = (SELECT MAX(time) FROM two_way_sms_tb WHERE phoneNumber = @phoneNumberperiodID)`;
                                        request.input('phoneNumberperiodID', sql.NVarChar, phoneNumberperiodID);
                                        request.input('textIDATperiodID', sql.NVarChar, textIDATperiodID);
                                        request.input('textperiodID', sql.NVarChar, textperiodID);
                                        request.query(updateAccounts, function (err, results) {
                                            if (err) {
                                                console.error('Error executing query: ' + err.stack);
                                                sql.close();
                                                return;
                                            }
                                            console.log('periodID UPDATE successful');
                                            const statusperiodID = "isCheckingAccount";
                                            const phoneNumberperiodID = sender;
                                            const textIDATperiodID1 = textIDAT;
                                            // Bind the values to the parameters
                                            const request = new sql.Request();
                                            request.input('statusperiodID', sql.NVarChar(50), statusperiodID);
                                            request.input('phoneNumberperiodID', sql.NVarChar(50), phoneNumberperiodID);
                                            request.input('textIDATperiodID1', sql.NVarChar(50), textIDATperiodID1);
                                            request.query("SELECT TOP 1 * FROM two_way_sms_tb WHERE phoneNumber = @phoneNumberperiodID AND status = @statusperiodID AND isActive = 1 AND text_id_AT = @textIDATperiodID1 order by time DESC", function (err, periodIDResults) {
                                                if (err) {
                                                    console.error('Error executing query: ' + err.stack);
                                                    return;
                                                }

                                                if (periodIDResults.recordset.length > 0) {
                                                    const periodID = periodIDResults.recordset[0].periodID;
                                                    const userID = periodNameResults.recordset[0].user_id;
                                                    var fetchMemberStatements = new Client();
                                                    // set content-type header and data as json in args parameter
                                                    var args = {
                                                        data: { user_id: userID, period_id: periodID },
                                                        headers: { "Content-Type": "application/json" }
                                                    };
                                                    fetchMemberStatements.get("https://api.octagonafrica.com/v1/accounts/member_statement", args, function (data, response) {
                                                        if ([200].includes(response.statusCode)) {
                                                          console.log(response.statusCode);
                                                            const statementsData = data.data;
                                                            const name = statementsData.name;
                                                            const email = statementsData.user_email;
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
                                                }
                                                sql.close();
                                              });
                                            });
                                          });

                                                } else if ([400].includes(response.statusCode)) {
                                                    console.log(response.statusCode);
                                                    const statuserror404 = "FetchPeriodsIDFailed";
                                                    const messagingSteperror404 = "0";
                                                    const phoneNumbererror404 = sender;
                                                    const textIDATerror404 = textIDAT;
                                                    const updateDelete = `UPDATE two_way_sms_tb SET status = @statuserror404, messagingStep = @messagingSteperror404  WHERE phoneNumber = @phoneNumbererror404 AND text_id_AT =@textIDATerror404 AND time = (
                                            SELECT MAX(time) FROM two_way_sms_tb WHERE phoneNumber = @phoneNumbererror404 )`;
                                                    request.input('statuserror404', sql.VarChar, statuserror404);
                                                    request.input('messagingSteperror404', sql.VarChar, messagingSteperror404);
                                                    request.input('phoneNumbererror404', sql.NVarChar, phoneNumbererror404);
                                                    request.input('textIDATerror404', sql.NVarChar, textIDATerror404);
                                                    request.query(updateDelete, function (err, results) {
                                                        if (err) {
                                                            console.error('Error executing query: ' + err.stack);
                                                            return;
                                                        }
                                                        console.log(' Reset Password Attempt unsuccessful');
                                                        sql.close();
                                                    });
                                                } else if ([500].includes(response.statusCode)) {
                                                    console.log(response.statusCode);
                                                    console.log(response.statusCode);
                                                    const statuserror500 = "FetchPeriodsIDFailed";
                                                    const messagingSteperror500 = "0";
                                                    const phoneNumbererror500 = sender;
                                                    const textIDATerror500 = textIDAT;
                                                    const updateDelete = `UPDATE two_way_sms_tb SET status = @statuserror500, messagingStep = @messagingSteperror500  WHERE phoneNumber = @phoneNumbererror500 AND text_id_AT =@textIDATerror500 AND time = (
                                             SELECT MAX(time) FROM two_way_sms_tb WHERE phoneNumber = @phoneNumbererror500 )`;
                                                    request.input('statuserror500', sql.VarChar, statuserror500);
                                                    request.input('messagingSteperror500', sql.VarChar, messagingSteperror500);
                                                    request.input('phoneNumbererror500', sql.NVarChar, phoneNumbererror500);
                                                    request.input('textIDATerror500', sql.NVarChar, textIDATerror500);
                                                    request.query(updateDelete, function (err, results) {
                                                        if (err) {
                                                            console.error('Error executing query: ' + err.stack);
                                                            return;
                                                        }
                                                        console.log(' Reset Password Attempt unsuccessful');
                                                        sql.close();
                                                    });
                                                } else {
                                                    console.log(response.statusCode);
                                                }
                                            });
                                        }
                        sql.close();
                                    });
                                });
                        });


                    break;
        default:
            // do sthg
            sms.send(account.wrongResponse(sender));
            break;
    }
}

module.exports = handleAccountCheck;