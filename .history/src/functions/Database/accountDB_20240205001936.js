const sql = require('mssql');
var Client = require('node-rest-client').Client;

function updateUserNameFail(statusUserName, phoneNumberUserName, messagingStepUserName, textUserName, textIDATUserName, config) {
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

function updateUserNameSuccess(phoneNumberUserNameS, textUsername, textIDATUserNameS, config) {
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

function updatePassword(phoneNumberPassword, textPassword, textIDATPassword, sender, config, textIDAT, sms, account, LinkID) {
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
          const password = passwordResults.recordset[0].password;
          let phoneNumber = phoneNumberPassword;
          phoneNumber = phoneNumber.replace("+", "");
          var accountsClient = new Client();
          // set content-type header and data as json in args parameter
          var args = {
            data: { phoneNumber: phoneNumber, password: password },
            headers: { "Content-Type": "application/json" }
          }
          accountsClient.post("https://api.octagonafrica.com/v1/loginwithPhone", args, function (data, response) {
            if ([200].includes(response.statusCode)) {
              // success
              console.log('Login Succesfully Completed');
              console.log(response.statusCode);
              const user_username = data.data.username;
              const user_fullname = data.data.user_full_names;
              console.log(user_username);
              // sms.send(account.confirmLogin(sender));
              var accountIDClient = new Client();
              var args = {
                data: { identifier: user_username },
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
                              const total_accounts = data.total_accounts;
                              if (total_accounts === 0) {
                                const finalMessage = "Dear Esteemed Member,\nSome of your details are missing. Please contact support at support@octagonafrica.com or call 0709 986 000 to update your details.\n1. National ID Number(Please send a copy of  front and back of your ID).";
                                sms.sendPremium({
                                  to: sender,
                                  from: '24123',
                                  message: finalMessage,
                                  bulkSMSMode: 0,
                                  keyword: 'pension',
                                  linkId: LinkID
                                });
                              } else {
                                // const totalAccounts = insurance.total_accounts;
                                const totalAccountsInsurance = insurance.total_accounts;
                                const insuranceData = insurance.data;
                                const totalAccountsPension = pension.total_accounts;
                                const pensionData = pension.data;
                                //Dear customer here are yoour accoiunt  
                                let preAccounts = "Dear " + user_fullname + ", Here are your accounts:\n";
                                let insuranceMessage = "";
                                let insuranceMessage1 = "";
                                let memberInsuranceIDs = "";
                                let memberPensionIDs = "";
                                for (let i = 0; i < totalAccountsInsurance; i++) {
                                  insuranceMessage += (i + 1) + ". " + insuranceData[i].Code + "\n";
                                  insuranceMessage1 += (i + 1) + ". " + insuranceData[i].Code + ",\n";
                                  memberInsuranceIDs += (i + 1) + ". " + insuranceData[i].ID + ",\n"
                                  console.log((i + 1) + ". Account Description:", insuranceData[i].Code, "Name: ", insuranceData[i].Description, ". Active Since: ", insuranceData[i].dateFrom);
                                }

                                let pensionMessage = "";
                                let pensionMessage1 = "";
                                for (let i = 0; i < totalAccountsPension; i++) {
                                  pensionMessage += (i + 1 + totalAccountsInsurance) + ". " + pensionData[i].Code + "\n";
                                  pensionMessage1 += (i + 1 + totalAccountsInsurance) + ". " + pensionData[i].Code + ",\n";
                                  memberPensionIDs += (i + 1 + totalAccountsInsurance) + ". " + pensionData[i].ID + ",\n";
                                  console.log((i + 1 + totalAccountsInsurance) + ". Account Description:", pensionData[i].Code, "Name: ", pensionData[i].scheme_name, ".Active Since: ", pensionData[i].dateFrom);
                                }
                                console.log(insuranceMessage1 + "\n");
                                console.log(pensionMessage1 + "\n");
                                console.log("Insurance:", memberInsuranceIDs + "\n");
                                console.log("Pension:", memberPensionIDs + "\n");

                                const statusMessage = insuranceMessage1 + "," + pensionMessage1;
                                console.log(statusMessage + "\n");
                                const memberIDS = memberInsuranceIDs + "," + memberPensionIDs;
                                console.log(memberIDS + "\n");
                                // let statusArray = statusMessage.split("\n").map((item) => item.replace(/^\d+\.\s*/, ''));
                                // console.log(statusArray);

                                // let postAccounts = "Please provide us with your membership number so that we can provide you with a member statement. ";
                                const finalMessage = preAccounts + insuranceMessage + pensionMessage;
                                //Send your sms
                                sms.sendPremium({
                                  to: sender,
                                  from: '24123',
                                  message: finalMessage,
                                  bulkSMSMode: 0,
                                  keyword: 'pension',
                                  linkId: LinkID
                                });
                                sql.connect(config, function (err) {
                                  console.log('Connected to the database');
                                  const request = new sql.Request();
                                  const statusAccountsEntry = "isCheckingAccount";
                                  // const messagingAccountsEntry = "0";
                                  const phoneNumberAccountsEntry = sender;
                                  const textIDATAccountsEntry = textIDAT;
                                  const allAccounts = statusMessage;
                                  const allMemberIDs = memberIDS;
                                  const updateAllAccounts = `UPDATE two_way_sms_tb SET status = @statusAccountsEntry, allAccounts =@allAccounts, allMemberIDs = @allMemberIDs WHERE phoneNumber = @phoneNumberAccountsEntry AND text_id_AT =@textIDATAccountsEntry AND time = (
                                           SELECT MAX(time) FROM two_way_sms_tb WHERE phoneNumber = @phoneNumberAccountsEntry )`;
                                  request.input('statusAccountsEntry', sql.VarChar, statusAccountsEntry);
                                  request.input('allMemberIDs', sql.VarChar, allMemberIDs);
                                  request.input('phoneNumberAccountsEntry', sql.NVarChar, phoneNumberAccountsEntry);
                                  request.input('textIDATAccountsEntry', sql.NVarChar, textIDATAccountsEntry);
                                  request.input('allAccounts', sql.NVarChar, allAccounts);
                                  request.query(updateAllAccounts, function (err, results) {
                                    if (err) {
                                      console.error('Error executing query: ' + err.stack);
                                      return;
                                    }
                                    console.log('Adding  accounts Attempt successful');
                                    sql.close();
                                  });
                                });
                              }
                            } else if ([400].includes(response.statusCode)) {
                              console.log(response.statusCode);
                              sms.sendPremium({
                                to: sender,
                                from: '24123',
                                message: "You do not have an account with us. Send an email  to support@octagonafrica.com",
                                bulkSMSMode: 0,
                                keyword: 'pension',
                                linkId: LinkID
                              });
                              sql.connect(config, function (err) {
                                console.log('Connected to the database');
                                const request = new sql.Request();
                                const statuserror404 = "isCheckingAccountFailed";
                                const messagingSteperror404 = "0";
                                const phoneNumbererror404 = sender;
                                const textIDATerror404 = textIDAT;
                                const updateFail = `UPDATE two_way_sms_tb SET status = @statuserror404, messagingStep = @messagingSteperror404,  isActive = '0'  WHERE phoneNumber = @phoneNumbererror404 AND text_id_AT =@textIDATerror404 AND time = (
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
                                  console.log(' Checking account failed Attempt unsuccessful');
                                  sql.close();
                                });
                              });
                            }
                            else if ([500].includes(response.statusCode)) {
                              console.log(response.statusCode);
                              sms.sendPremium({
                                to: sender,
                                from: '24123',
                                message: " Invalid request. Please input your National Id and password.",
                                bulkSMSMode: 0,
                                keyword: 'pension',
                                linkId: LinkID
                              });
                              sql.connect(config, function (err) {
                                if (err) {
                                  console.error('Error connecting to the database: ' + err.stack);
                                  return;
                                }
                                const request = new sql.Request();
                                const statuserror500 = "isCheckingAccountFailed";
                                const messagingSteperror500 = "0";
                                const phoneNumbererror500 = sender;
                                const textIDATerror500 = textIDAT;
                                const updateFail = `UPDATE two_way_sms_tb SET status = @statuserror500, messagingStep = @messagingSteperror500, isActive = '0'  WHERE phoneNumber = @phoneNumbererror500 AND text_id_AT =@textIDATerror500 AND time = (
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
                                  console.log('Checking Account Failed Attempt unsuccessful');
                                  sql.close();
                                });
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
            } else if ([401].includes(response.statusCode)) {
              console.log(response.statusCode);
              sql.connect(config, function (err) {
                if (err) {
                  console.error('Error connecting to the database: ' + err.stack);
                  return;
                }
                const phoneNumberLogin = sender;
                const checkIfExistsQuerySysUsers = "SELECT TOP 1 * FROM two_way_sms_tb WHERE phoneNumber =@phoneNumber AND isActive = 1 AND time = (SELECT MAX(time) FROM two_way_sms_tb WHERE phoneNumber =@phoneNumber)";
                const checkIfExistsRequestSysUsers = new sql.Request();
                checkIfExistsRequestSysUsers.input('phoneNumber', sql.VarChar, phoneNumberLogin);
                checkIfExistsRequestSysUsers.query(checkIfExistsQuerySysUsers, function (checkErrSysUsers, checkResultsSysUsers) {
                  if (checkErrSysUsers) {
                    console.error('Error executing checkIfExistsQuerySysUsers: ' + checkErrSysUsers.stack);
                    connection.close();
                    return;
                  }
                  if (checkResultsSysUsers.recordset.length > 0) {
                    let loginAttempts = checkResultsSysUsers.recordset[0].loginAttemptsCounter;
                    loginAttempts = parseInt(loginAttempts, 10);
                    console.log(loginAttempts);
                    if (loginAttempts <= 2) {
                      const loginAttemptNumber = loginAttempts + 1;
                      const request = new sql.Request();
                      const statuserror404 = "isCheckingAccount";
                      const messagingSteperror404 = "3";
                      const phoneNumbererror404 = sender;
                      const textIDATerror404 = textIDAT;
                      const updateFail = `UPDATE two_way_sms_tb SET status = @statuserror404, messagingStep = @messagingSteperror404 , loginAttemptsCounter= @loginAttemptNumber WHERE phoneNumber = @phoneNumbererror404 AND text_id_AT =@textIDATerror404 AND time = (
                                                SELECT MAX(time) FROM two_way_sms_tb WHERE phoneNumber = @phoneNumbererror404 )`;
                      request.input('statuserror404', sql.VarChar, statuserror404);
                      request.input('messagingSteperror404', sql.VarChar, messagingSteperror404);
                      request.input('phoneNumbererror404', sql.NVarChar, phoneNumbererror404);
                      request.input('textIDATerror404', sql.NVarChar, textIDATerror404);
                      request.input('loginAttemptNumber', sql.Int, loginAttemptNumber);
                      request.query(updateFail, function (err, results) {
                        if (err) {
                          console.error('Error executing query: ' + err.stack);
                          return;
                        }
                        console.log('Login Attempt unsuccessful');
                        sql.close();
                      });
                      sms.sendPremium({
                        to: sender,
                        from: '24123',
                        message: " Invalid credentials!! Please re-enter your password.",
                        bulkSMSMode: 0,
                        keyword: 'pension',
                        linkId: LinkID
                      });
                      console.log("Message sent");
                    } else {
                      // Lock the user out and send them to reset the password
                      const request = new sql.Request();
                      const statuserror404 = "isCheckingAccount";
                      const messagingSteperror404 = "600";
                      const phoneNumbererror404 = sender;
                      const textIDATerror404 = textIDAT;
                      const updateFail = `UPDATE two_way_sms_tb SET status = @statuserror404, messagingStep = @messagingSteperror404, isActive = 0 WHERE phoneNumber = @phoneNumbererror404 AND text_id_AT =@textIDATerror404 AND time = (
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
                        console.log('Login Attempt unsuccessful. Locked out.');
                        sql.close();
                      });
                      sms.sendPremium({
                        to: sender,
                        from: '24123',
                        message: "Invalid credentials! Incorrect username or password combination. Please reset your password or contact support at support@octagonafrica.com or call 0709 986 000",
                        bulkSMSMode: 0,
                        keyword: 'pension',
                        linkId: LinkID
                      });
                    }
                  }
                });
              });
            } else if ([500].includes(response.statusCode)) {
              console.log(response.statusCode);
              sms.sendPremium({
                to: sender,
                from: '24123',
                message: " Invalid request. Please input your National Id and password.",
                bulkSMSMode: 0,
                keyword: 'pension',
                linkId: LinkID
              });
              sql.connect(config, function (err) {
                if (err) {
                  console.error('Error connecting to the database: ' + err.stack);
                  return;
                }
                console.log('Connected to the database');
                const request = new sql.Request();
                const statuserror500 = "isCheckingAccountFailed";
                const messagingSteperror500 = "0";
                const phoneNumbererror500 = sender;
                const textIDATerror500 = textIDAT;
                const updateFail = `UPDATE two_way_sms_tb SET status = @statuserror500, messagingStep = @messagingSteperror500,  isActive = '0'  WHERE phoneNumber = @phoneNumbererror500 AND text_id_AT =@textIDATerror500 AND time = (
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

function updateDescription(phoneNumberDescription, textDescription, textIDATDescription, sender, config, textIDAT, sms, account, LinkID, memberID) {
  sql.connect(config, function (err) {
    if (err) {
      console.error('Error connecting to the database: ' + err.stack);
      return;
    }
    console.log('Connected to the database');

    const request = new sql.Request();
    const updateAccounts = `UPDATE two_way_sms_tb SET status = 'isCheckingAccount', messagingStep= '5', description = @textDescription, memberID = @memberID WHERE phoneNumber = @phoneNumberDescription AND text_id_AT = @textIDATDescription AND time = (SELECT MAX(time) FROM two_way_sms_tb WHERE phoneNumber = @phoneNumberDescription)`;
    request.input('phoneNumberDescription', sql.NVarChar, phoneNumberDescription);
    request.input('textIDATDescription', sql.NVarChar, textIDATDescription);
    request.input('memberID', sql.NVarChar, memberID);
    request.input('textDescription', sql.NVarChar, textDescription);
    request.query(updateAccounts, function (err, results) {
      if (err) {
        console.error('Error executing query: ' + err.stack);
        sql.close();
        return;
      }
      console.log('Description UPDATE successful');
      const statusDescription = "isCheckingAccount";
      const phoneNumberDescription = sender;
      const textIDATDescription1 = textIDAT;
      // Bind the values to the parameters
      const request = new sql.Request();
      request.input('statusDescription', sql.NVarChar(50), statusDescription);
      request.input('phoneNumberDescription', sql.NVarChar(50), phoneNumberDescription);
      request.input('textIDATDescription1', sql.NVarChar(50), textIDATDescription1);
      request.query("SELECT TOP 1 * FROM two_way_sms_tb WHERE phoneNumber = @phoneNumberDescription AND status = @statusDescription AND isActive = 1 AND text_id_AT = @textIDATDescription1 order by time DESC", function (err, descriptionResults) {
        if (err) {
          console.error('Error executing query: ' + err.stack);
          return;
        }

        if (descriptionResults.recordset.length > 0) {
          const description = descriptionResults.recordset[0].description;
          console.log(description);
          var fetchPeriodsClient = new Client();
          var args = {
            data: { description: description },
            headers: { "Content-Type": "application/json" }
          };
          fetchPeriodsClient.get("https://api.octagonafrica.com/v1/accounts/pension/periods/twoway", args, function (data, response) {
            if ([200].includes(response.statusCode)) {
              console.log(response.statusCode);
              const periods = data.data;
              // console.log(periods);
              let finalMessage = "";
              let preMessage = "Available periods are: \n";
              for (let i = 0; i < periods.length; i++) {
                const period_name = periods[i].period_name;
                finalMessage += `${i + 1}. ${period_name}.\n`;
              }
              console.log("Available periods are: \n" + finalMessage);

              sql.connect(config, function (err) {
                console.log('Connected to the database');
                const request = new sql.Request();
                const statusPeriodsEntry = "isCheckingAccount";
                // const messagingPeriodsEntry = "0";
                const phoneNumberPeriodsEntry = sender;
                const textIDATPeriodsEntry = textIDAT;
                const allPeriods = finalMessage;
                const updateAllPeriods = `UPDATE two_way_sms_tb SET status = @statusPeriodsEntry, allPeriods =@allPeriods   WHERE phoneNumber = @phoneNumberPeriodsEntry AND text_id_AT =@textIDATPeriodsEntry AND time = (
                         SELECT MAX(time) FROM two_way_sms_tb WHERE phoneNumber = @phoneNumberPeriodsEntry )`;
                request.input('statusPeriodsEntry', sql.VarChar, statusPeriodsEntry);
                // request.input('messagingPeriodsEntry', sql.VarChar, messagingPeriodsEntry);
                request.input('phoneNumberPeriodsEntry', sql.NVarChar, phoneNumberPeriodsEntry);
                request.input('textIDATPeriodsEntry', sql.NVarChar, textIDATPeriodsEntry);
                request.input('allPeriods', sql.NVarChar, allPeriods);
                request.query(updateAllPeriods, function (err, results) {
                  if (err) {
                    console.error('Error executing query: ' + err.stack);
                    return;
                  }
                  console.log('Adding periods attempt successful');
                  sql.close();
                });
              });
              sms.sendPremium({
                to: sender,
                from: '24123',
                message: preMessage + finalMessage,
                bulkSMSMode: 0,
                keyword: 'pension',
                linkId: LinkID
              });
            } else if ([400].includes(response.statusCode)) {
              console.log(response.statusCode);
              sms.sendPremium({
                to: sender,
                from: '24123',
                message: 'Invalid Details. Try again later!!!!',
                bulkSMSMode: 0,
                keyword: 'pension',
                linkId: LinkID
              });
              sql.connect(config, function (err) {
                if (err) {
                  console.error('Error connecting to the database: ' + err.stack);
                  return;
                }
                console.log('Connected to the database');
                const request = new sql.Request();
                const statuserror404 = "FetchPeriodsFailed";
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
                  console.log(' Generate Member Statement Attempt unsuccessful');
                  sql.close();
                });
              });
            } else if ([500].includes(response.statusCode)) {
              console.log(response.statusCode);
              sms.sendPremium({
                to: sender,
                from: '24123',
                message: 'Internal Server Error',
                bulkSMSMode: 0,
                keyword: 'pension',
                linkId: LinkID
              });
              sql.connect(config, function (err) {
                if (err) {
                  console.error('Error connecting to the database: ' + err.stack);
                  return;
                }
                console.log('Connected to the database');
                const request = new sql.Request();
                const statuserror500 = "FetchPeriodsFailed";
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
                  console.log(' Generate Member Statement Attempt unsuccessful');
                  sql.close();
                });
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
}
function updatePeriodName(phoneNumberperiodName, textperiodName, textIDATperiodName, sender, config, textIDAT, sms, LinkID) {
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
      console.log('Period Name UPDATE successful');
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
          const description = periodNameResults.recordset[0].description;
          console.log(description);
          var fetchPeriodsIDClient = new Client();
          // set content-type header and data as json in args parameter
          var args = {
            data: { periodname: periodname, description: description },
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
                      let memberID = periodNameResults.recordset[0].memberID;
                      memberID = memberID.replace(/^\d+\.\s*/, '');
                      memberID = memberID.replace(/\s/g, '');
                      let schemeCode = '';
                      let memberEmail = '';
                      let memberName = '';
                      sql.connect(config, function (err, connection) {
                        if (err) {
                          console.error('Error connecting to database: ' + err.stack);
                          return;
                        }
                        console.log('Connected to database');

                        console.log('Member ID: ' + memberID);
                        const checkIfExistsQuerySysUsers = "SELECT TOP 1 * FROM members_tb WHERE m_id = @memberID";
                        const checkIfExistsRequestSysUsers = new sql.Request(connection);
                        checkIfExistsRequestSysUsers.input('memberID', sql.VarChar, memberID);
                        checkIfExistsRequestSysUsers.query(checkIfExistsQuerySysUsers, function (checkErrSysUsers, checkResultsSysUsers) {
                          if (checkErrSysUsers) {
                            console.error('Error executing checkIfExistsQuerySysUsers: ' + checkErrSysUsers.stack);
                            connection.close();
                            return;
                          }
                          // Record exists in sys_users_tb
                          if (checkResultsSysUsers.recordset.length > 0) {
                            console.log('Member exists');
                            memberEmail = checkResultsSysUsers.recordset[0].m_email;
                            memberName = checkResultsSysUsers.recordset[0].m_name;
                            schemeCode = checkResultsSysUsers.recordset[0].m_scheme_code;

                            // Accessing variables after setting their values
                            console.log('Member Email:', memberEmail);
                            console.log('Member Name:', memberName);
                            console.log('Scheme Code:', schemeCode);
                          }
                        });
                      });




                      console.log(memberID);
                      var fetchMemberStatements = new Client();
                      // set content-type header and data as json in args parameter
                      var args = {
                        data: { memberID: memberID, period_id: periodID },
                        headers: { "Content-Type": "application/json" }
                      };
                      console.log(args);
                      fetchMemberStatements.get("https://api.octagonafrica.com/v1/accounts/memberstatement", args, function (data, response) {
                        if ([200].includes(response.statusCode)) {
                          console.log(response.statusCode);
                          const statementsData = data.data;
                          const nameFromAPI = statementsData.name;
                          const emailFromAPI = statementsData.user_email;
                          const periodsNameAPI = statementsData.period_name;
                          const phoneNumberStatement = sender;
                          const textIDATStatement = textIDAT;
                          sql.connect(config, function (err) {
                            console.log('Connected to the database');
                            const request = new sql.Request();
                            const updateAccounts = `UPDATE two_way_sms_tb SET status = 'isCheckingAccountSuccess', messagingStep= '100', isActive = 100, periodname = @periodsNameAPI, name = @nameFromAPI, email = @emailFromAPI  WHERE phoneNumber = @phoneNumberStatement AND text_id_AT = @textIDATStatement AND time = (SELECT MAX(time) FROM two_way_sms_tb WHERE phoneNumber = @phoneNumberStatement)`;
                            request.input('phoneNumberStatement', sql.NVarChar, phoneNumberStatement);
                            request.input('periodsNameAPI', sql.NVarChar, periodsNameAPI);
                            request.input('emailFromAPI', sql.NVarChar, emailFromAPI);
                            request.input('nameFromAPI', sql.NVarChar, nameFromAPI);
                            request.input('textIDATStatement', sql.NVarChar, textIDATStatement);
                            request.query(updateAccounts, function (err, results) {
                              if (err) {
                                console.error('Error executing query: ' + err.stack);
                                sql.close();
                                return;
                              }
                              console.log('Member Statement details UPDATE successful');
                              const statusMemberStatement = "isCheckingAccountSuccess";
                              const phoneNumberStatement = sender;
                              const textIDATMemberStatement = textIDAT;
                              // Bind the values to the parameters
                              const request = new sql.Request();
                              request.input('statusMemberStatement', sql.NVarChar(50), statusMemberStatement);
                              request.input('phoneNumberStatement', sql.NVarChar(50), phoneNumberStatement);
                              request.input('textIDATMemberStatement', sql.NVarChar(50), textIDATMemberStatement);
                              request.query("SELECT TOP 1 * FROM two_way_sms_tb WHERE phoneNumber = @phoneNumberStatement AND status = @statusMemberStatement AND isActive = 100 AND text_id_AT = @textIDATMemberStatement order by time DESC", function (err, memberStatementResults) {
                                if (err) {
                                  console.error('Error executing query: ' + err.stack);
                                  return;
                                }

                                if (memberStatementResults.recordset.length > 0) {
                                  const name = memberStatementResults.recordset[0].name.trim();
                                  const email = memberStatementResults.recordset[0].email;
                                  const periodsName = memberStatementResults.recordset[0].periodname;
                                  console.log("Dear " + name + ".Your member statement for " + periodsName + " period has been sent to  " + email);
                                  sms.sendPremium({
                                    to: sender,
                                    from: '24123',
                                    message: "Dear " + name + ". Your member statement for " + periodsName + " period has been sent to  " + email + ". Incase of any queries contact us at support@octagonafrica.com or 0709 986 000 ",
                                    bulkSMSMode: 0,
                                    keyword: 'pension',
                                    linkId: LinkID
                                  });
                                }
                                sql.close();
                              });
                            });
                          });
                        } else if ([400].includes(response.statusCode)) {
                          console.log(response.statusCode);
                          sms.sendPremium({
                            to: sender,
                            from: '24123',
                            message: 'Invalid Details. Try again later',
                            bulkSMSMode: 0,
                            keyword: 'pension',
                            linkId: LinkID
                          });
                          sql.connect(config, function (err) {
                            console.log('Connected to the database');
                            const request = new sql.Request();
                            const statuserror404 = "FetchMemberStatementFailed";
                            const messagingSteperror404 = "0";
                            const phoneNumbererror404 = sender;
                            const textIDATerror404 = textIDAT;
                            const updateDelete = `UPDATE two_way_sms_tb SET status = @statuserror404, messagingStep = @messagingSteperror404,  isActive = '0'  WHERE phoneNumber = @phoneNumbererror404 AND text_id_AT =@textIDATerror404 AND time = (
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
                              console.log('Fetch Member Statemement Attempt unsuccessful');
                              sql.close();
                            });
                          });
                        } else if ([500].includes(response.statusCode)) {
                          console.log(response.statusCode);
                          sms.sendPremium({
                            to: sender,
                            from: '24123',
                            message: 'Internal Server Error',
                            bulkSMSMode: 0,
                            keyword: 'pension',
                            linkId: LinkID
                          });
                          sql.connect(config, function (err) {
                            console.log('Connected to the database');
                            const request = new sql.Request();
                            const statuserror500 = "FetchMemberFailed";
                            const messagingSteperror500 = "0";
                            const phoneNumbererror500 = sender;
                            const textIDATerror500 = textIDAT;
                            const updateDelete = `UPDATE two_way_sms_tb SET status = @statuserror500, messagingStep = @messagingSteperror500, isActive = '0'  WHERE phoneNumber = @phoneNumbererror500 AND text_id_AT =@textIDATerror500 AND time = (
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
                              console.log('Fetch Member statement Attempt unsuccessful');
                              sql.close();
                            });
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
            } else if ([400].includes(response.statusCode)) {
              console.log(response.statusCode);
              sms.sendPremium({
                to: sender,
                from: '24123',
                message: 'Invalid Details. Try again later',
                bulkSMSMode: 0,
                keyword: 'pension',
                linkId: LinkID
              });
              const statuserror404 = "FetchPeriodsIDFailed";
              const messagingSteperror404 = "0";
              const phoneNumbererror404 = sender;
              const textIDATerror404 = textIDAT;
              sql.connect(config, function (err) {
                console.log('Connected to the database');
                const request = new sql.Request();
                const updateDelete = `UPDATE two_way_sms_tb SET status = @statuserror404, messagingStep = @messagingSteperror404, isActive = '0' WHERE phoneNumber = @phoneNumbererror404 AND text_id_AT =@textIDATerror404 AND time = (
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
                  console.log(' FetchPeriodsID Attempt unsuccessful');
                  sql.close();
                });
              });
            } else if ([500].includes(response.statusCode)) {
              console.log(response.statusCode);
              sms.sendPremium({
                to: sender,
                from: '24123',
                message: 'Internal Server Error',
                bulkSMSMode: 0,
                keyword: 'pension',
                linkId: LinkID
              });
              sql.connect(config, function (err) {
                console.log('Connected to the database');
                const request = new sql.Request();
                const statuserror500 = "FetchPeriodsIDFailed";
                const messagingSteperror500 = "0";
                const phoneNumbererror500 = sender;
                const textIDATerror500 = textIDAT;
                const updateDelete = `UPDATE two_way_sms_tb SET status = @statuserror500, messagingStep = @messagingSteperror500, isActive = '0'  WHERE phoneNumber = @phoneNumbererror500 AND text_id_AT =@textIDATerror500 AND time = (
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
                  console.log(' Fetch Periods ID Attempt unsuccessful');
                  sql.close();
                });
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
}
module.exports = { updateUserNameFail, updateUserNameSuccess, updatePassword, updateDescription, updatePeriodName };