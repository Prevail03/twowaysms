const sql = require('mssql');
var Client = require('node-rest-client').Client;

function updatePassword(phoneNumberPassword, textPassword, textIDATPassword, sender, config, textIDAT, sms,  LinkID) {
  sql.connect(config, function (err) {
    if (err) {
      console.error('Error connecting to the database: ' + err.stack);
      return;
    }
    console.log('Connected to the database');
    const request = new sql.Request();
    const updateAccounts = `UPDATE two_way_sms_tb SET status = 'isMakingClaim', messagingStep= '2', password = @textPassword WHERE phoneNumber = @phoneNumberPassword AND text_id_AT = @textIDATPassword AND time = (SELECT MAX(time) FROM two_way_sms_tb WHERE phoneNumber = @phoneNumberPassword)`;
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
      const statusPassword = "isMakingClaim";
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
                  const user_schemes = data.user_schemes;
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
                    const updateAccounts = `UPDATE two_way_sms_tb SET status = 'isMakingClaim', messagingStep= '2', memberSchemeCode = @user_schemes, user_id = @textUserID WHERE phoneNumber = @phoneNumberUserID AND text_id_AT = @textIDATuserID AND time = (SELECT MAX(time) FROM two_way_sms_tb WHERE phoneNumber = @phoneNumberUserID)`;
                    request.input('phoneNumberUserID', sql.NVarChar, phoneNumberUserID);
                    request.input('textIDATUserID', sql.NVarChar, textIDATUserID);
                    request.input('textUserID', sql.NVarChar, textUserID);
                    request.input('user_schemes', sql.NVarChar, user_schemes);
                    request.query(updateAccounts, function (err, results) {
                      if (err) {
                        console.error('Error executing query: ' + err.stack);
                        sql.close();
                        return;
                      }
                      console.log('User ID UPDATE successful');
                      const statusUserIDRequest = "isMakingClaim";
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
                                for (let i = 0; i < totalAccountsInsurance; i++) {
                                  insuranceMessage += (i + 1) +". "  + insuranceData[i].Code   +"\n";
                                  insuranceMessage1 += (i + 1) +". "  + insuranceData[i].Code   +",\n";
                                  console.log((i + 1) + ". Account Description:", insuranceData[i].Code, "Name: ", insuranceData[i].Description, ". Active Since: ", insuranceData[i].dateFrom);
                                }

                                let pensionMessage = "";
                                let pensionMessage1 = "";
                                for (let i = 0; i < totalAccountsPension; i++) {
                                  pensionMessage += (i + 1 + totalAccountsInsurance) +". "  + pensionData[i].Code +"\n";
                                  pensionMessage1 += (i + 1 + totalAccountsInsurance) +". "  + pensionData[i].Code +",\n";
                                  console.log((i + 1 + totalAccountsInsurance) + ". Account Description:", pensionData[i].Code, "Name: ", pensionData[i].scheme_name, ".Active Since: ", pensionData[i].dateFrom);
                                }
                                console.log(insuranceMessage1 + "\n");
                                console.log(pensionMessage1 + "\n");

                                const statusMessage = insuranceMessage1 +","+ pensionMessage1;
                                console.log(statusMessage + "\n");
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
                                  const statusAccountsEntry = "isMakingClaim";
                                  // const messagingAccountsEntry = "0";
                                  const phoneNumberAccountsEntry = sender;
                                  const textIDATAccountsEntry = textIDAT;
                                  const allAccounts = statusMessage;
                                  const updateFail = `UPDATE two_way_sms_tb SET status = @statusAccountsEntry, allAccounts =@allAccounts   WHERE phoneNumber = @phoneNumberAccountsEntry AND text_id_AT =@textIDATAccountsEntry AND time = (
                                           SELECT MAX(time) FROM two_way_sms_tb WHERE phoneNumber = @phoneNumberAccountsEntry )`;
                                  request.input('statusAccountsEntry', sql.VarChar, statusAccountsEntry);
                                  // request.input('messagingAccountsEntry', sql.VarChar, messagingAccountsEntry);
                                  request.input('phoneNumberAccountsEntry', sql.NVarChar, phoneNumberAccountsEntry);
                                  request.input('textIDATAccountsEntry', sql.NVarChar, textIDATAccountsEntry);
                                  request.input('allAccounts', sql.NVarChar, allAccounts);
                                  request.query(updateFail, function (err, results) {
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
                                message: "You do not have an account with us or your profile is not complete. Please contact your scheme admin or contact support at support@octagonafrica.com or 0709 986 000",
                                bulkSMSMode: 0,
                                keyword: 'pension',
                                linkId: LinkID 
                              });
                              sql.connect(config, function (err) {
                                console.log('Connected to the database');
                                const request = new sql.Request();
                                const statuserror404 = "isMakingClaimFailed";
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
                                const statuserror500 = "isMakingClaimFailed";
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
                checkIfExistsRequestSysUsers.query(checkIfExistsQuerySysUsers, function(checkErrSysUsers, checkResultsSysUsers) {
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
                        const statuserror404 = "isMakingClaim";
                        const messagingSteperror404 = "1";
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
                        const statuserror404 = "isMakingClaim";
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
            }else if ([500].includes(response.statusCode)) {
              console.log(response.statusCode);
              sms.sendPremium({ 
                to: sender, 
                from: '24123', 
                message: " Invalid request. Please input a valid password.",
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

function updateDescription(phoneNumberDescription, textDescription, textIDATDescription, sender, config, textIDAT, sms, account, LinkID) {
  sql.connect(config, function (err) {
    if (err) {
      console.error('Error connecting to the database: ' + err.stack);
      return;
    }
    console.log('Connected to the database');

    const request = new sql.Request();
    const updateAccounts = `UPDATE two_way_sms_tb SET status = 'isMakingClaim', messagingStep= '3', description = @textDescription WHERE phoneNumber = @phoneNumberDescription AND text_id_AT = @textIDATDescription AND time = (SELECT MAX(time) FROM two_way_sms_tb WHERE phoneNumber = @phoneNumberDescription)`;
    request.input('phoneNumberDescription', sql.NVarChar, phoneNumberDescription);
    request.input('textIDATDescription', sql.NVarChar, textIDATDescription);
    request.input('textDescription', sql.NVarChar, textDescription);
    request.query(updateAccounts, function (err, results) {
      if (err) {
        console.error('Error executing query: ' + err.stack);
        sql.close();
        return;
      }
      console.log('Member Number Update Successfully done');

      const statusUserIDRequest = "isMakingClaim";
      const phoneNumberUserIDRequest = sender;
      const textIDATUserIDRequest = textIDAT;

        const checkIfExistsQuery = "SELECT TOP 1 * FROM two_way_sms_tb WHERE phoneNumber = @phoneNumberUserIDRequest AND status = @statusUserIDRequest AND isActive = 1 AND text_id_AT = @textIDATUserIDRequest order by time DESC";
        const checkIfExistsRequest = new sql.Request(connection);
        checkIfExistsRequest.input('statusUserIDRequest', sql.NVarChar(50), statusUserIDRequest);
        checkIfExistsRequest.input('phoneNumberUserIDRequest', sql.NVarChar(50), phoneNumberUserIDRequest);
        checkIfExistsRequest.input('textIDATUserIDRequest', sql.VarChar(100), textIDATUserIDRequest);
        checkIfExistsRequest.query(checkIfExistsQuery, function(checkErr, userIDResults) {
        if (checkErr) {
        console.error('Error executing checkIfExistsQuery: ' + checkErr.stack);
        connection.close();
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
          fetchClient.get("https://api.octagonafrica.com/v1/claims/sendClaimsOTP", args, function (data, response) {

            if ([200].includes(response.statusCode)) {
              sms.sendPremium({
                to: sender,
                from: '24123',
                message: "Enter the claim benefits OTP",
                bulkSMSMode: 0,
                keyword: 'pension',
                linkId: LinkID
              });
            } else if ([400].includes(response.statusCode)) {
              console.log(response.statusCode);
              sms.sendPremium({
                to: sender,
                from: '24123',
                message: "You do not have an account with us or your profile is not complete. Please contact your scheme admin or contact support at support@octagonafrica.com or 0709 986 000",
                bulkSMSMode: 0,
                keyword: 'pension',
                linkId: LinkID
              });
              sql.connect(config, function (err) {
                console.log('Connected to the database');
                const request = new sql.Request();
                const statuserror404 = "isMakingClaimFailed";
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
                const request = new sql.Request();
                const statuserror500 = "isMakingClaimFailed";
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
      });
      sql.close();
    });
  });
}


module.exports = {updatePassword, updateDescription};