const { extendWith } = require('lodash');
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
                    const updateAccounts = `UPDATE two_way_sms_tb SET status = 'isMakingClaim', messagingStep= '2', user_username = @user_username, memberSchemeCode = @user_schemes, user_id = @textUserID WHERE phoneNumber = @phoneNumberUserID AND text_id_AT = @textIDATuserID AND time = (SELECT MAX(time) FROM two_way_sms_tb WHERE phoneNumber = @phoneNumberUserID)`;
                    request.input('phoneNumberUserID', sql.NVarChar, phoneNumberUserID);
                    request.input('textIDATUserID', sql.NVarChar, textIDATUserID);
                    request.input('textUserID', sql.NVarChar, textUserID);
                    request.input('user_schemes', sql.NVarChar, user_schemes);
                    request.input('user_username', sql.NVarChar, user_username);
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
                const statuserror500 = "isMakingClaimFailed500";
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
                  console.log(' Making Claim Attempt unsuccessful');
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

    request.query(updateAccounts, function (err) {
      if (err) {
        console.error('Error executing updateAccounts: ' + err.stack);
        sql.close();
        return;
      }

      console.log('Member Number Update successfully done');
      checkIfExistsQuery(sender, config, textIDAT, sms, account, LinkID);
    });
  });
}

function checkIfExistsQuery(sender, config, textIDAT, sms, account, LinkID) {
  sql.connect(config, function (err) {
    if (err) {
      console.error('Error connecting to the database: ' + err.stack);
      return;
    }

    console.log('Connected to the database');

    const request = new sql.Request();
    const checkIfExistsQuery = `SELECT TOP 1 * FROM two_way_sms_tb WHERE phoneNumber = @phoneNumber AND status = @status AND isActive = 1 AND text_id_AT = @textIDAT ORDER BY time DESC`;
    request.input('phoneNumber', sql.NVarChar, sender);
    request.input('status', sql.NVarChar, 'isMakingClaim');
    request.input('textIDAT', sql.NVarChar, textIDAT);

    request.query(checkIfExistsQuery, function (err, results) {
      if (err) {
        console.error('Error executing checkIfExistsQuery: ' + err.stack);
        sql.close();
        return;
      }

      if (results.recordset.length > 0) {
        const userID = results.recordset[0].user_id;
        console.log(userID);
        var fetchClient = new Client();
        // set content-type header and data as json in args parameter
        var args = {
          data: { userID: userID },
          headers: { "Content-Type": "application/json" }
        };
        fetchClient.post("https://api.octagonafrica.com/v1/claims/sendClaimsOTP", args, function (data, response) {
          if ([200].includes(response.statusCode)) {
            console.log(response.statusCode);
            sms.sendPremium({
              to: sender,
              from: '24123',
              message: 'Enter the claim benefits OTP',
              bulkSMSMode: 0,
              keyword: 'pension',
              linkId: LinkID
            });
            console.log('OTP sent to email and Phone Number');
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

          sql.close();
        });
      } else {
        console.log('No matching record found');
        sql.close();
      }
    });
  });
}

function updateOTP(statusOTP, phoneNumberOTP, messagingStepOTP, textOTP, textIDATOTP, config, sms, sender, textIDAT, LinkID){
  sql.connect(config, function (err) {
    const request = new sql.Request();
    const updateReset = `UPDATE two_way_sms_tb SET status = @statusOTP, messagingStep = @messagingStepOTP, claimsOTP = @textOTP  WHERE phoneNumber = @phoneNumberOTP AND text_id_AT = @textIDATOTP AND time = (
                SELECT MAX(time) FROM two_way_sms_tb WHERE phoneNumber = @phoneNumberOTP )`;
    request.input('statusOTP', sql.VarChar, statusOTP);
    request.input('messagingStepOTP', sql.VarChar, messagingStepOTP);
    request.input('phoneNumberOTP', sql.NVarChar, phoneNumberOTP);
    request.input('textIDATOTP', sql.NVarChar, textIDATOTP);
    request.input('textOTP', sql.NVarChar, textOTP);
    request.query(updateReset, function (err, results) {
      if (err) {
        console.error('Error executing query: ' + err.stack);
        return;
      }
      console.log('OTP UPDATE successful');
      const status = "isMakingClaim";
      const phoneNumber = phoneNumberOTP;
      const textIDAT = textIDATOTP; 
      // Bind the values to the parameters
      request.input('status', sql.NVarChar(50), status);
      request.input('phoneNumber', sql.NVarChar(50), phoneNumber);
      request.input('textIDAT', sql.VarChar(100), textIDAT);
      request.query("SELECT TOP 1 * FROM two_way_sms_tb WHERE phoneNumber = @phoneNumber AND status = @status AND isActive = 1 AND text_id_AT = @textIDAT order by time DESC", function (err, verifyClaimsOTPResults) {
        if (err) {
          console.error('Error executing query: ' + err.stack);
          return;
        }
        if (verifyClaimsOTPResults.recordset.length > 0) {
          const username = verifyClaimsOTPResults.recordset[0].user_username;
          const OTP = verifyClaimsOTPResults.recordset[0].claimsOTP;
          var verifyClaimsOTP = new Client();
          var args = {// set content-type header and data as json in args parameter
            data: { otp: OTP, username: username },
            headers: { "Content-Type": "application/json" }
          };
          verifyClaimsOTP.post("https://api.octagonafrica.com/v1/claims/verifyClaimsOTP", args, function (data, response) {
            // parsed response body as js object
            console.log(data);
            // raw response
            if ([200].includes(response.statusCode)) {
              console.log(response.statusCode);

              const statusReasons = "isMakingClaim";
              const phoneNumberReasons = phoneNumberOTP;
              const messagingStepReasons = "4"; 
              sql.connect(config, function (err) {
                if (err) {
                  console.error('Error connecting to the database: ' + err.stack);
                  return;
                }
                console.log('Connected to the database');             
                const request = new sql.Request();             
                // Select query to fetch reasons from the table
                const selectReasonsQuery = `SELECT TOP 1000 [reasonID], [reasonForExit] FROM [MYDB].[dbo].[reasons_for_exit_claims]`;
                request.query(selectReasonsQuery, function (err, results) {
                  if (err) {
                    console.error('Error executing selectReasonsQuery: ' + err.stack);
                    sql.close();
                    return;
                  }             
                  const reasons = results.recordset.map((reason, index) => `${index + 1}. ${reason.reasonForExit}`);
                  const reasonsString = reasons.join(', ');              
                  console.log('Reasons for Exit:');
                  reasons.forEach(reason => {
                    console.log(reason);
                  });              
                  // Update the "two_way_sms_tb" table with the reasons string
                  const updateReasons = `UPDATE two_way_sms_tb SET status = @statusReasons, messagingStep = @messagingStepReasons, allReasons = @reasonsString WHERE phoneNumber = @phoneNumberReasons AND time = (
                    SELECT MAX(time) FROM two_way_sms_tb WHERE phoneNumber = @phoneNumberReasons
                  )`;
                  request.input('statusReasons', sql.VarChar, statusReasons);
                  request.input('messagingStepReasons', sql.VarChar, messagingStepReasons);
                  request.input('reasonsString', sql.NVarChar, reasonsString);
                  request.input('phoneNumberReasons', sql.NVarChar, phoneNumberReasons);
                  request.query(updateReasons, function (err, results) {
                    if (err) {
                      console.error('Error executing updateReasons query: ' + err.stack);
                      sql.close();
                      return;
                    }          
                    const premessage = "Reasons for making a claim:";
                    const finalMessage = premessage + "\n" + reasons.join('\n');         
                    sms.sendPremium({
                      to: sender,
                      from: '24123',
                      message: finalMessage,
                      bulkSMSMode: 0,
                      keyword: 'pension',
                      linkId: LinkID
                    });
                    console.log('All Reasons Updated successfully');
                    sql.close();
                  });
                });
              }); 
            } else if ([400].includes(response.statusCode)) {
              console.log(response.statusCode);
              sms.sendPremium({ 
                to: sender, 
                from: '24123', 
                message: " Invalid Details!!. Check your details and please try again Later ",
                bulkSMSMode: 0,
                keyword: 'pension',
                linkId: LinkID
              });
              sql.connect(config, function (err) {
                const request = new sql.Request();
                const statuserror404 = "isMakingClaim";
                const messagingSteperror404 = "0";
                const phoneNumbererror404 = phoneNumberOTP;
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
                  console.log('Reset Password Attempt unsuccessful');
                  sql.close();
                });
              });
            }else if ([500].includes(response.statusCode)) {
              console.log(response.statusCode);
              sms.sendPremium({ 
                to: sender, 
                from: '24123', 
                message: " Invalid request. Invalid Details!!. Check your details and please try again Later ",
                bulkSMSMode: 0,
                keyword: 'pension',
                linkId: LinkID
              });
              sql.connect(config, function (err) {
                const request = new sql.Request();
                const statuserror500 = "isMakingClaim";
                const messagingSteperror500 = "0";
                const phoneNumbererror500 = phoneNumberOTP;
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
                  console.log('Reset Password Attempt unsuccessful');
                  sql.close();
                });
              });
            } else {
              // error code
              console.log(response.statusCode);
              sms.sendPremium({ 
                to: sender, 
                from: '24123', 
                message: " Invalid request. Invalid Details!!. Check your details and please try again Later ",
                bulkSMSMode: 0,
                keyword: 'pension',
                linkId: LinkID
              });
              
              sql.connect(config, function (err) {
                const request = new sql.Request();
                const statuserror500 = "isMakingClaim";
                const messagingSteperror500 = "404";
                const phoneNumbererror500 = phoneNumberOTP;
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
                  console.log('Reset Password Attempt unsuccessful');
                  sql.close();
                });
              });
            }
          });
        }

      sql.close();
    });
  });
});
}

function updateReasonForExit(statusReason ,phoneNumberReason, textReasonForExit, textIDATReason, config) {
  const messagingStepReason="5";
  sql.connect(config, function (err) {
    const request = new sql.Request();
    const updateReset = `UPDATE two_way_sms_tb SET status = @statusReason, messagingStep = @messagingStepReason, reasonforexit = @textReasonForExit  WHERE phoneNumber = @phoneNumberReason AND text_id_AT = @textIDATReason AND time = (
                SELECT MAX(time) FROM two_way_sms_tb WHERE phoneNumber = @phoneNumberReason )`;
    request.input('statusReason', sql.VarChar, statusReason);
    request.input('messagingStepReason', sql.VarChar, messagingStepReason);
    request.input('phoneNumberReason', sql.NVarChar, phoneNumberReason);
    request.input('textIDATReason', sql.NVarChar, textIDATReason);
    request.input('textReasonForExit', sql.NVarChar, textReasonForExit);
    request.query(updateReset, function (err, results) {
      if (err) {
        console.error('Error executing query: ' + err.stack);
        return;
      }
      console.log('Reason For Exit UPDATE successful');
      sql.close();
    });
  });
}

function updateDateOfExit(statusDate ,phoneNumberDate, textDate, textIDATDate, config) {
  const messagingStepReason="6";
  sql.connect(config, function (err) {
    const request = new sql.Request();
    const updateReset = `UPDATE two_way_sms_tb SET status = @statusDate, messagingStep = @messagingStepReason, dateOfExit = @textDate  WHERE phoneNumber = @phoneNumberDate AND text_id_AT = @textIDATDate AND time = (
                SELECT MAX(time) FROM two_way_sms_tb WHERE phoneNumber = @phoneNumberDate )`;
    request.input('statusDate', sql.VarChar, statusDate);
    request.input('messagingStepReason', sql.VarChar, messagingStepReason);
    request.input('phoneNumberDate', sql.NVarChar, phoneNumberDate);
    request.input('textIDATDate', sql.NVarChar, textIDATDate);
    request.input('textDate', sql.NVarChar, textDate);
    request.query(updateReset, function (err, results) {
      if (err) {
        console.error('Error executing query: ' + err.stack);
        return;
      }
      console.log('Date of Exit UPDATE successful');
      sql.close();
    });
  });
}

function updateAmount(statusAmount ,phoneNumberAmount, textAmount, textIDATAmount, config, sms, sender, textIDAT, LinkID){
  const messagingStepAmount = "6";
  sql.connect(config, function (err) {
    const request = new sql.Request();
    const updateReset = `UPDATE two_way_sms_tb SET status = @statusAmount, messagingStep = @messagingStepAmount, amount = @textAmount  WHERE phoneNumber = @phoneNumberAmount AND text_id_AT = @textIDATAmount AND time = (
                SELECT MAX(time) FROM two_way_sms_tb WHERE phoneNumber = @phoneNumberAmount )`;
    request.input('statusAmount', sql.VarChar, statusAmount);
    request.input('messagingStepAmount', sql.VarChar, messagingStepAmount);
    request.input('phoneNumberAmount', sql.NVarChar, phoneNumberAmount);
    request.input('textIDATAmount', sql.NVarChar, textIDATAmount);
    request.input('textAmount', sql.NVarChar, textAmount);
    request.query(updateReset, function (err, results) {
      if (err) {
        console.error('Error executing query: ' + err.stack);
        return;
      }
      console.log('Amount UPDATE successful');
      const status = "isMakingClaim";
      const phoneNumber = phoneNumberAmount;
      const textIDAT = textIDATAmount; 
      // Bind the values to the parameters
      request.input('status', sql.NVarChar(50), status);
      request.input('phoneNumber', sql.NVarChar(50), phoneNumber);
      request.input('textIDAT', sql.VarChar(100), textIDAT);
      request.query("SELECT TOP 1 * FROM two_way_sms_tb WHERE phoneNumber = @phoneNumber AND status = @status AND isActive = 1 AND text_id_AT = @textIDAT order by time DESC", function (err, sendClaimDataResults) {
        if (err) {
          console.error('Error executing query: ' + err.stack);
          return;
        }
        if (sendClaimDataResults.recordset.length > 0) {
          const description = sendClaimDataResults.recordset[0].description;
          const parts = description.split(":");
          const memberNumber = parts[1].trim();
          console.log("Member Details:", memberNumber);
          const memberSchemeCode = sendClaimDataResults.recordset[0].memberSchemeCode.trim();
          const reasonForExit = sendClaimDataResults.recordset[0].reasonforExit.trim();
          const amount = sendClaimDataResults.recordset[0].amount.trim();
          const dateOfExit = sendClaimDataResults.recordset[0].dateOfExit.trim();          
          var addnewclaim = new Client();
          var args = {// set content-type header and data as json in args parameter
            data: { memberNo: memberNumber, memberSchemeCode : memberSchemeCode, reasonforExit: reasonForExit, amount: amount, dateOfExit : dateOfExit },
            headers: { "Content-Type": "application/json" }
          };
          console.log(args);
          addnewclaim.post("https://api.octagonafrica.com/v1/claims/addnewclaim", args, function (data, response) {
            // parsed response body as js object
            console.log(data);
            // raw response
            if ([200].includes(response.statusCode)) {
              console.log(response.statusCode);

              const statusReasons = "isMakingClaim";
              const phoneNumberReasons = phoneNumberAmount;
              const messagingStepReasons = "100"; 
              sql.connect(config, function (err) {
                if (err) {
                  console.error('Error connecting to the database: ' + err.stack);
                  return;
                }
                console.log('Connected to the database');             
                const request = new sql.Request();                         
                // Update the "two_way_sms_tb" table with the reasons string
                const updateReasons = `UPDATE two_way_sms_tb SET status = @statusReasons, messagingStep = @messagingStepReasons ,isActive = 0 WHERE phoneNumber = @phoneNumberReasons AND time = (
                  SELECT MAX(time) FROM two_way_sms_tb WHERE phoneNumber = @phoneNumberReasons)`;
                request.input('statusReasons', sql.VarChar, statusReasons);
                request.input('messagingStepReasons', sql.VarChar, messagingStepReasons);
                request.input('phoneNumberReasons', sql.NVarChar, phoneNumberReasons);
                request.query(updateReasons, function (err, results) {
                  if (err) {
                    console.error('Error executing updateReasons query: ' + err.stack);
                    sql.close();
                    return;
                  }          
                  sms.sendPremium({
                    to: sender,
                    from: '24123',
                    message: "Hello esteemed customer, \n Your claim was successfully made. Please hold on as its proccesed. In case of any questions please feel free to reach out to us via support@octagonafrica.com",
                    bulkSMSMode: 0,
                    keyword: 'pension',
                    linkId: LinkID
                  });
                  console.log('Claim made successfully');
                  sql.close();
                });
              }); 
            } else if ([404].includes(response.statusCode)) {
              console.log(response.statusCode);
              sms.sendPremium({ 
                to: sender, 
                from: '24123', 
                message: " Invalid Details! Check your details and please try again Later ",
                bulkSMSMode: 0,
                keyword: 'pension',
                linkId: LinkID
              });
              sql.connect(config, function (err) {
                const request = new sql.Request();
                const statuserror404 = "isMakingClaim404";
                const messagingSteperror404 = "0";
                const phoneNumbererror404 = phoneNumberAmount;
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
                  console.log('Reset Password Attempt unsuccessful');
                  sql.close();
                });
              });
              
            } else if ([402].includes(response.statusCode)) {
              console.log(response.statusCode);
              sms.sendPremium({ 
                to: sender, 
                from: '24123', 
                message: "Failed to copy files from server. Please contact your scheme administrator or support at support@octagonafrica.com or call 0709 986000",
                bulkSMSMode: 0,
                keyword: 'pension',
                linkId: LinkID
              });
              sql.connect(config, function (err) {
                const request = new sql.Request();
                const statuserror404 = "isMakingClaim402";
                const messagingSteperror404 = "0";
                const phoneNumbererror404 = phoneNumberAmount;
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
                  console.log('Reset Password Attempt unsuccessful');
                  sql.close();
                });
              });
            } else if ([403].includes(response.statusCode)) {
              console.log(response.statusCode);
              sms.sendPremium({ 
                to: sender, 
                from: '24123', 
                message: "Your details have not been approved your scheme HR details please contact them. Please contact your scheme Hr or support at support@octagonafrica.com or call 0709 986000",
                bulkSMSMode: 0,
                keyword: 'pension',
                linkId: LinkID
              });
              sql.connect(config, function (err) {
                const request = new sql.Request();
                const statuserror404 = "isMakingClaim403";
                const messagingSteperror404 = "0";
                const phoneNumbererror404 = phoneNumberAmount;
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
                  console.log('Reset Password Attempt unsuccessful');
                  sql.close();
                });
              });
            } else if ([202].includes(response.statusCode)) {
              console.log(response.statusCode);
              sms.sendPremium({ 
                to: sender, 
                from: '24123', 
                message: "Dear estemeed customer,\nAn email with a link to update your details has been sent to your email. Please update your details to process your claim. In case of any questions, please feel free to reach out to us via support@octagonafrica.com or 0709 986000",
                bulkSMSMode: 0,
                keyword: 'pension',
                linkId: LinkID
              });
              sql.connect(config, function (err) {
                const request = new sql.Request();
                const statuserror404 = "isMakingClaim202";
                const messagingSteperror404 = "0";
                const phoneNumbererror404 = phoneNumberAmount;
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
                  console.log('Reset Password Attempt unsuccessful');
                  sql.close();
                });
              });
            } else if ([405].includes(response.statusCode)) {
              console.log(response.statusCode);
              sms.sendPremium({ 
                to: sender, 
                from: '24123', 
                message: "Email was not sent. Please try again later or contact us at support@octagonafrica.com or 0709986000",
                bulkSMSMode: 0,
                keyword: 'pension',
                linkId: LinkID
              });
              sql.connect(config, function (err) {
                const request = new sql.Request();
                const statuserror404 = "isMakingClaim405";
                const messagingSteperror404 = "0";
                const phoneNumbererror404 = phoneNumberAmount;
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
                  console.log('Reset Password Attempt unsuccessful');
                  sql.close();
                });
              });
            } else if ([401].includes(response.statusCode)) {
              console.log(response.statusCode);
              sms.sendPremium({ 
                to: sender, 
                from: '24123', 
                message: "Invalid response received. Please contact your administrator or support at support@octagonafrica.com or call 0709 986000",
                bulkSMSMode: 0,
                keyword: 'pension',
                linkId: LinkID
              });
              sql.connect(config, function (err) {
                const request = new sql.Request();
                const statuserror404 = "isMakingClaim401";
                const messagingSteperror404 = "0";
                const phoneNumbererror404 = phoneNumberAmount;
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
                  console.log('Reset Password Attempt unsuccessful');
                  sql.close();
                });
              });
            } else if ([406].includes(response.statusCode)) {
              console.log(response.statusCode);
              sms.sendPremium({ 
                to: sender, 
                from: '24123', 
                message: "Member Number Not Found/Invalid. Please contact your administrator or support at support@octagonafrica.com or call 0709 986000",
                bulkSMSMode: 0,
                keyword: 'pension',
                linkId: LinkID
              });
              sql.connect(config, function (err) {
                const request = new sql.Request();
                const statuserror404 = "isMakingClaim406";
                const messagingSteperror404 = "0";
                const phoneNumbererror404 = phoneNumberAmount;
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
                  console.log('Reset Password Attempt unsuccessful');
                  sql.close();
                });
              });
            } else if ([400].includes(response.statusCode)) {
              console.log(response.statusCode);
              sms.sendPremium({ 
                to: sender, 
                from: '24123', 
                message: "Claim was not Made Please try again later. Check your details and please try again Later ",
                bulkSMSMode: 0,
                keyword: 'pension',
                linkId: LinkID
              });
              sql.connect(config, function (err) {
                const request = new sql.Request();
                const statuserror404 = "isMakingClaim400";
                const messagingSteperror404 = "0";
                const phoneNumbererror404 = phoneNumberAmount;
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
                  console.log('Reset Password Attempt unsuccessful');
                  sql.close();
                });
              });
            }else if ([500].includes(response.statusCode)) {
              console.log(response.statusCode);
              sms.sendPremium({ 
                to: sender, 
                from: '24123', 
                message: " Invalid request. Invalid Details!!. Check your details and please try again Later ",
                bulkSMSMode: 0,
                keyword: 'pension',
                linkId: LinkID
              });
              sql.connect(config, function (err) {
                const request = new sql.Request();
                const statuserror500 = "isMakingClaim500";
                const messagingSteperror500 = "0";
                const phoneNumbererror500 = phoneNumberAmount;
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
                  console.log('Reset Password Attempt unsuccessful');
                  sql.close();
                });
              });
            } else {
              // error code
              console.log(response.statusCode);
              sms.sendPremium({ 
                to: sender, 
                from: '24123', 
                message: " Invalid request. Invalid Details!!. Check your details and please try again Later ",
                bulkSMSMode: 0,
                keyword: 'pension',
                linkId: LinkID
              });
              
              sql.connect(config, function (err) {
                const request = new sql.Request();
                const statuserror500 = "isMakingClaim";
                const messagingSteperror500 = "404";
                const phoneNumbererror500 = phoneNumberAmount;
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
                  console.log('Reset Password Attempt unsuccessful');
                  sql.close();
                });
              });
            }
          });
        }
      sql.close();
    });
  });
});
}
module.exports = {updatePassword, updateDescription, updateOTP, updateReasonForExit, updateDateOfExit, updateAmount};