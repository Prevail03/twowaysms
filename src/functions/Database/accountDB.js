const sql = require('mssql');
var Client = require('node-rest-client').Client;

function updateUserNameFail(statusUserName, phoneNumberUserName, messagingStepUserName, textUserName, textIDATUserName,config){
  sql.connect(config, function (err) {
    const request = new sql.Request();
    const updateDelete = `UPDATE two_way_sms_tb SET status = @statusUserName, messagingStep = @messagingStepUserName, user_username = @textUserName WHERE phoneNumber = @phoneNumberUserName AND text_id_AT = @textIDATUserName AND time = (
  SELECT MAX(time) FROM two_way_sms_tb WHERE phoneNumber = @phoneNumberUserName )`;
    request.input('statusUserName', sql.VarChar, statusUserName);
    request.input('messagingStepUserName', sql.VarChar, messagingStepUserName);
    request.input('phoneNumberUserName', sql.NVarChar, phoneNumberUserName);
    request.input('textUserName', sql.NVarChar, textUserName);
    request.input('textIDATUserName', sql.NVarChar, textIDATUserName);
    request.query(updateDelete, function (err, results) {
      if (err) {
        console.error('Error executing query: ' + err.stack);
        return;
      }
      console.log('Username UPDATE successful');

      sql.close();
    });
  });
}

function updateUserNameSuccess(phoneNumberUserNameS,textUsername,textIDATUserNameS,config ){
sql.connect(config, function (err) {
    if (err) {
        console.error('Error connecting to the database: ' + err.stack);
        return;
    }
    console.log('Connected to the database');

    const request = new sql.Request();
    const updateDelete = `UPDATE two_way_sms_tb SET status = 'isCheckingAccount', messagingStep= '3', user_username = @textUsername WHERE phoneNumber = @phoneNumberUserNameS AND text_id_AT = @textIDATUserNameS AND time = (SELECT MAX(time) FROM two_way_sms_tb WHERE phoneNumber = @phoneNumberUserNameS)`;
    request.input('phoneNumberUserNameS', sql.NVarChar, phoneNumberUserNameS);
    request.input('textIDATUserNameS', sql.NVarChar, textIDATUserNameS);
    request.input('textUsername', sql.NVarChar, textUsername);
    request.query(updateDelete, function (err, results) {
        if (err) {
            console.error('Error executing query: ' + err.stack);
            sql.close();
            return;
        }
        console.log('UserName UPDATE successful');
        console.log('Query results:', results);
        sql.close();
    });
});
}

function updatePassword(phoneNumberPassword, textPassword, textIDATPassword, sender, config, textIDAT, sms, account){
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
        const textIDATPassword1 = textIDAT;
        // Bind the values to the parameters
        const request = new sql.Request();
        request.input('statusPassword', sql.NVarChar(50), statusPassword);
        request.input('phoneNumberPassword', sql.NVarChar(50), phoneNumberPassword);
        request.input('textIDATPassword1', sql.NVarChar(50), textIDATPassword1);
        request.query("SELECT TOP 1 * FROM two_way_sms_tb WHERE phoneNumber = @phoneNumberPassword AND status = @statusPassword AND isActive = 1 AND text_id_AT = @textIDATPassword1 order by time DESC", function (err, passwordResults) {
            if (err) {
                console.error('Error executing query: ' + err.stack);
                return;
            }
            if (passwordResults.recordset.length > 0) {
                console.log('Login Succesfully Completed')
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
                        sms.send(account.confirmLogin(sender));
                        var accountIDClient = new Client();
                        var args = {
                            data: { identifier: username },
                            headers: { "Content-Type": "application/json" }
                        };
                        accountIDClient.get("https://api.octagonafrica.com/v1/accountsid", args, function (data, response) {
                            if (response.statusCode === 200) {
                                console.log(response.statusCode);
                                const ID = data.data;
                                console.log(JSON.stringify(ID));
                                const phoneNumberUserID = sender;
                                const textUserID = ID;
                                const textIDATUserID = textIDAT;
                                sql.connect(config, function (err) {
                                    if (err) {
                                        console.error('Error connecting to the database: ' + err.stack);
                                        return;
                                    }
                                    console.log('Connected to the database');
                                    const request = new sql.Request();
                                    const updateAccounts = `UPDATE two_way_sms_tb SET status = 'isCheckingAccount', messagingStep= '4', user_id = @textUserID WHERE phoneNumber = @phoneNumberUserID AND text_id_AT = @textIDATuserID AND time = (SELECT MAX(time) FROM two_way_sms_tb WHERE phoneNumber = @phoneNumberUserID)`;
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
                                                var fetchClient = new Client();
                                                // set content-type header and data as json in args parameter
                                                var args = {
                                                    data: { user_id: userID },
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
                                                        let preAccounts = "Dear " + username + ", Here are your accounts \n "
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


                                                    } else if ([400].includes(response.statusCode)) {
                                                        console.log(response.statusCode);
                                                        console.log(response.statusCode);
                                                        sms.send({
                                                            to: sender,
                                                            from: '20880',
                                                            message: " Invalid Details!!. Check your details and please try again Later "
                                                        });
                                                        const statuserror404 = "isCheckingAccountFailed";
                                                        const messagingSteperror404 = "0";
                                                        const phoneNumbererror404 = sender;
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

                                                        const statuserror500 = "isCheckingAccountFailed";
                                                        const messagingSteperror500 = "0";
                                                        const phoneNumbererror500 = sender;
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
                        const statuserror404 = "isCheckingAccountFailed";
                        const messagingSteperror404 = "0";
                        const phoneNumbererror404 = sender;
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

                        const statuserror500 = "isCheckingAccountFailed";
                        const messagingSteperror500 = "0";
                        const phoneNumbererror500 = sender;
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
}
module.exports = {updateUserNameFail, updateUserNameSuccess, updatePassword};