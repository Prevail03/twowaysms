const sql = require('mssql');
var Client = require('node-rest-client').Client;

function updatePassword(phoneNumberPassword, textPassword, textIDATPassword, sender, config, textIDAT, sms, claimStatus, LinkID) {
  sql.connect(config, function (err) {
    if (err) {
      console.error('Error connecting to the database: ' + err.stack);
      return;
    }
    console.log('Connected to the database');
    const request = new sql.Request();
    const updateAccounts = `UPDATE two_way_sms_tb SET status = 'isCheckingClaim', messagingStep= '1', password = @textPassword WHERE phoneNumber = @phoneNumberPassword AND text_id_AT = @textIDATPassword AND time = (SELECT MAX(time) FROM two_way_sms_tb WHERE phoneNumber = @phoneNumberPassword)`;
    request.input('phoneNumberPassword', sql.NVarChar, phoneNumberPassword);
    request.input('textIDATPassword', sql.NVarChar, textIDATPassword);
    request.input('textPassword', sql.NVarChar, textPassword);
    request.query(updateAccounts, function (err, results) {
      if (err) {
        console.error('Error executing query: ' + err.stack);
        sql.close();
        return;
      }
      console.log('Password Claim Status UPDATE successful');
      const statusPassword = "isCheckingClaim";
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
              const user_id = data.data.user_id;
              const user_username = data.data.username;
              const user_fullname = data.data.user_full_names;
              console.log(user_username);
              // sms.send(account.confirmLogin(sender));
              var getClaimStatus = new Client();
              var args = {
                data: { user_id: user_id },
                headers: { "Content-Type": "application/json" }
              };
              getClaimStatus.get("https://api.octagonafrica.com/v1/claims/listclaim", args, function (data, response) {
                if (response.statusCode === 200) {
                  console.log(response.statusCode);
                   
                  const claim_data = data.claim_data;

                  const preMessage = "Dear esteemed client below are your claims: \n";

                  let finalMessage = preMessage;
                  claim_data.forEach((claim, index) => {
                      finalMessage += `${index + 1}. ${claim.member_name}, Your claim stage is ${claim.claim_stage}, `;
                      if (claim.next_action) {
                          finalMessage += `the next action is ${claim.next_action}, `;
                      }
                      finalMessage += `for the scheme ${claim.schemeName} as at date ${claim.as_at_date}. The amount you are claiming is ${claim.amount}.\n`;
                  });

                  console.log(finalMessage); 
                  const phoneNumberUserID = sender;
                  // const textUserID = ID;
                  const textIDATUserID = textIDAT;
                  sql.connect(config, function (err) {
                    if (err) {
                      console.error('Error connecting to the database: ' + err.stack);
                      return;
                    }
                    console.log('Connected to the database');
                    const request = new sql.Request();
                    const updateAccounts = `UPDATE two_way_sms_tb SET status = 'isCheckingClaim', messagingStep= '2', user_id = @textUserID WHERE phoneNumber = @phoneNumberUserID AND text_id_AT = @textIDATuserID AND time = (SELECT MAX(time) FROM two_way_sms_tb WHERE phoneNumber = @phoneNumberUserID)`;
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
                      
                    });
                  });
                } else if (response.statusCode === 400) {
                  console.log(response.statusCode);
                  sms.sendPremium({
                    to: sender,
                    from: '24123',
                    message: 'Invalid Details or Missing Data. Try again later!!!!',
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
                    const statuserror404 = "ClaimStatusFailed";
                    const messagingSteperror404 = "0";
                    const phoneNumbererror404 = sender;
                    const textIDATerror404 = textIDAT;
                    const updateDelete = `UPDATE two_way_sms_tb SET status = @statuserror404, messagingStep = @messagingSteperror404, isActive = 0  WHERE phoneNumber = @phoneNumbererror404 AND text_id_AT =@textIDATerror404 AND time = (
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
                      console.log(' Get Claim Status Attempt unsuccessful');
                      sql.close();
                    });
                  });
                } else if (response.statusCode === 404) {
                  console.log(response.statusCode);
                  sms.sendPremium({
                    to: sender,
                    from: '24123',
                    message: 'Dear '+ user_fullname+ 'You do not have a pension account with us ',
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
                    const statuserror404 = "ClaimStatusFailed";
                    const messagingSteperror404 = "0";
                    const phoneNumbererror404 = sender;
                    const textIDATerror404 = textIDAT;
                    const updateDelete = `UPDATE two_way_sms_tb SET status = @statuserror404, messagingStep = @messagingSteperror404, isActive = 0  WHERE phoneNumber = @phoneNumbererror404 AND text_id_AT =@textIDATerror404 AND time = (
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
                      console.log(' Get Claim Status unsuccessful');
                      sql.close();
                    });
                  });
                
                } else if (response.statusCode === 500) {
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
                    const statuserror404 = "ClaimStatusFailed";
                    const messagingSteperror404 = "0";
                    const phoneNumbererror404 = sender;
                    const textIDATerror404 = textIDAT;
                    const updateDelete = `UPDATE two_way_sms_tb SET status = @statuserror404, messagingStep = @messagingSteperror404, isActive = 0  WHERE phoneNumber = @phoneNumbererror404 AND text_id_AT =@textIDATerror404 AND time = (
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
                      console.log('Get Claim Status unsuccessful');
                      sql.close();
                    });
                  });
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
                      const statuserror404 = "isCheckingClaim";
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
                      const statuserror404 = "isCheckingClaim";
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
                message: " Invalid request.",
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
                const statuserror500 = "isBalanceFailed";
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
function updateDescription(phoneNumberDescription, textDescription, textIDATDescription, sender, config, textIDAT, sms, claimStatus, LinkID, memberID) {
  sql.connect(config, function (err) {
    if (err) {
      console.error('Error connecting to the database: ' + err.stack);
      return;
    }
    console.log('Connected to the database');

    const request = new sql.Request();
    const updateAccounts = `UPDATE two_way_sms_tb SET status = 'isCheckingClaim', messagingStep= '2', description = @textDescription, memberID = @memberID WHERE phoneNumber = @phoneNumberDescription AND text_id_AT = @textIDATDescription AND time = (SELECT MAX(time) FROM two_way_sms_tb WHERE phoneNumber = @phoneNumberDescription)`;
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
      console.log('Description Claim UPDATE successful');
      const statusDescription = "isCheckingClaim";
      const phoneNumberDescription = sender;
      const textIDATDescription1 = textIDAT;
      // Bind the values to the parameters
      const request = new sql.Request();
      request.input('statusDescription', sql.NVarChar(50), statusDescription);
      request.input('phoneNumberDescription', sql.NVarChar(50), phoneNumberDescription);
      request.input('textIDATDescription1', sql.NVarChar(50), textIDATDescription1);
      request.query("SELECT TOP 1 m.*, t.* FROM two_way_sms_tb t JOIN members_tb m ON CAST(SUBSTRING(t.memberID, CHARINDEX('.', t.memberID) + 1, LEN(t.memberID)) AS INT) = m.m_id WHERE t.phoneNumber = @phoneNumberDescription AND t.status = @statusDescription AND t.isActive = 1 AND t.text_id_AT = @textIDATDescription1 ORDER BY t.time DESC;", function (err, descriptionResults) {
        if (err) {
          console.error('Error executing query: ' + err.stack);
          return;
        }

        if (descriptionResults.recordset.length > 0) {
              const member_name = descriptionResults.recordset[0].m_name;
              const member_number = descriptionResults.recordset[0].m_number;
              const scheme_code = descriptionResults.recordset[0].m_scheme_code;

              var getClaimStatus = new Client();
              var args = {
                data: { member_number: member_number, scheme_id: scheme_code},
                headers: { "Content-Type": "application/json" }
              };
              console.log(args);
              getClaimStatus.get("https://api.octagonafrica.com/v1/claims/getclaims", args, function (data, response) {
                if ([200].includes(response.statusCode)) {
                  console.log(response.statusCode);
                  const claimStatusClaims = data;
                  console.log(claimStatusClaims);
                  const message = data.message;
                  // const user_fullname = data.data.user_full_names;
                  sql.connect(config, function (err) {
                    console.log('Connected to the database');
                    const request = new sql.Request();
                    const statusSuccess = "ischeckingClaimSuccess";
                    // const messagingPeriodsEntry = "0";
                    const phoneNumberPeriodsEntry = sender;
                    const textIDATPeriodsEntry = textIDAT;

                    const updateAllPeriods = `UPDATE two_way_sms_tb SET status = @statusSuccess  ,messagingStep= '100', isActive = 100  WHERE phoneNumber = @phoneNumberPeriodsEntry AND text_id_AT =@textIDATPeriodsEntry AND time = (
                             SELECT MAX(time) FROM two_way_sms_tb WHERE phoneNumber = @phoneNumberPeriodsEntry )`;
                    request.input('statusSuccess', sql.VarChar, statusSuccess);
                    // request.input('messagingPeriodsEntry', sql.VarChar, messagingPeriodsEntry);
                    request.input('phoneNumberPeriodsEntry', sql.NVarChar, phoneNumberPeriodsEntry);
                    request.input('textIDATPeriodsEntry', sql.NVarChar, textIDATPeriodsEntry);
                    // request.input('allPeriods', sql.NVarChar, allPeriods);
                    request.query(updateAllPeriods, function (err, results) {
                      if (err) {
                        console.error('Error executing query: ' + err.stack);
                        return;
                      }
                      console.log('Check claims status attempt successfull');
                      sql.close();
                    });
                  });
                  sms.sendPremium({
                    to: sender,
                    from: '24123',
                    message: message,
                    bulkSMSMode: 0, 
                    keyword: 'pension',
                    linkId: LinkID
                  });
                }else if ([400].includes(response.statusCode)) {
                  console.log(response.statusCode);
                  sms.sendPremium({
                    to: sender,
                    from: '24123',
                    message: 'Dear '+ member_name +', You are yet to initiate a benefits withdrawal claim.Please use our access channels(Octagon Africa App, Member Portal and Two-Way SMS) to make your claim.',
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
                    const statuserror404 = "GetBalanceFailed";
                    const messagingSteperror404 = "0";
                    const phoneNumbererror404 = sender;
                    const textIDATerror404 = textIDAT;
                    const updateDelete = `UPDATE two_way_sms_tb SET status = @statuserror404, messagingStep = @messagingSteperror404 ,isActive = 0  WHERE phoneNumber = @phoneNumbererror404 AND text_id_AT =@textIDATerror404 AND time = (
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
                      console.log('Get Claim Status Attempt unsuccessful');
                      sql.close();
                    });
                  });
                }else{
                  console.log(response.statusCode);
                }
              });
           
          
        }
        sql.close();
      });
    });
  });
}

module.exports = { updatePassword, updateDescription };