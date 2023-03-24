
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
          console.log('UserName UPDATE successful');
          console.log('Query results:', results);
          const statusPassword = "ResetingPassword";
          const phoneNumberPassword = phoneNumberResetPassword;
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
                  var accountsClient = new Client();
                  // set content-type header and data as json in args parameter
                  var args = {
                      data: { username: username, password: password },
                      headers: { "Content-Type": "application/json" }
                  };
                  accountsClient.post("https://api.octagonafrica.com/v1/login", args, function (data, response) {
                      if ([200].includes(response.statusCode)) {
                          // success code
                          sms.send(account.confirmLogin(sender));
                          var accountIDClient = new Client();
                          var args = {
                              data: { identifier: username },
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
              }
              sql.close();
          });
      });
  });
