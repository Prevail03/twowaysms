const statusResetPassword = "ResetingPassword";
            const phoneNumberResetPassword = sender;
            const messagingStepResetPassword = "3";
            const textCPassword = text;
            const textIDATPassword = textIDAT;
            // updateCurrentPassword(text, statusResetPassword, phoneNumberResetPassword, messagingStepResetPassword, textCPassword, textIDATPassword,phoneNumber, sender,reset, config, textIDAT)
            sql.connect(config, function (err) {
                const request = new sql.Request();
                const updateReset = `UPDATE two_way_sms_tb SET status = @statusResetPassword , messagingStep = @messagingStepResetPassword , password = @textCPassword WHERE phoneNumber = @phoneNumberResetPassword AND text_id_AT = @textIDATPassword AND  time = (
                    SELECT MAX(time) FROM two_way_sms_tb WHERE phoneNumber = @phoneNumberResetPassword )`;
                request.input('statusResetPassword', sql.VarChar, statusResetPassword);
                request.input('messagingStepResetPassword', sql.VarChar, messagingStepResetPassword);
                request.input('phoneNumberResetPassword', sql.NVarChar, phoneNumberResetPassword);
                request.input('textCPassword', sql.NVarChar, textCPassword);
                request.input('textIDATPassword', sql.NVarChar, textIDATPassword);
                request.query(updateReset, function (err, results) {
                  if (err) {
                    console.error('Error executing query: ' + err.stack);
                    return;
                  }
                  console.log('Current Password UPDATE successful');
                  //works Upto the above statement.
                  const statusCurrentPass = "ResetingPassword";
                  const phoneNumberCPass = sender;
                  const textIDCPass = textIDAT;
                  console.log(sender+" "+textIDAT);
                  console.log("statusCurrentPass" +statusCurrentPass+ "PhoneNumber" +phoneNumberCPass+ "TextIDAT" +textIDCPass);
                  // Bind the values to the parameters
                  request.input('statusCurrentPass', sql.NVarChar(50), statusCurrentPass);
                  request.input('phoneNumberCPass', sql.NVarChar(50), phoneNumberCPass);
                  request.input('textIDCPass', sql.VarChar(100), textIDCPass);
                  request.query("SELECT TOP 1 * FROM two_way_sms_tb WHERE phoneNumber = @phoneNumberCPass AND status = @statusCurrentPass AND isActive = 1 AND text_id_AT = @textIDCPass order by time DESC", function (err, cPassResults) {
                    if (err) {
                      console.error('Error executing query: ' + err.stack);
                      return;
                    }
                    if (cPassResults.recordset.length > 0) {
                      console.log('User exists');
                      const password = cPassResults.recordset[0].password;
                      const email = cPassResults.recordset[0].email;
                      console.log(email + " " + password);
                      var deleteClient = new Client();
                      var args = {
                        data: { username: email, password: password },
                        headers: { "Content-Type": "application/json" }
                      };
                      deleteClient.post("https://api.octagonafrica.com/v1/login", args, function (data, response) {
                        if ([200].includes(response.statusCode)) {
                          sms.send(reset.verifyPassword(sender));
                          const statusCurrentPass = "ResetingPassword";
                          const phoneNumberCPass = sender;
                          const textIDCPass = textIDAT;
                          console.log(statusCurrentPass+" " + phoneNumberCPass+" " + textIDAT);
                          // Bind the values to the parameters
                          request.input('statusCurrentPass', sql.NVarChar(50), statusCurrentPass);
                          request.input('phoneNumberCPass', sql.NVarChar(50), phoneNumberCPass);
                          request.input('textIDCPass', sql.VarChar(100), textIDCPass);
                          request.query("SELECT TOP 1 * FROM two_way_sms_tb WHERE phoneNumber = @phoneNumberCPass AND status = @statusCurrentPass AND isActive = 1 AND text_id_AT = @textIDCPass order by time DESC", function (err, cPasswordResults) {
                            if (err) {
                              console.error('Error executing query: ' + err.stack);
                              return;
                            }
                            if (cPasswordResults.recordset.length > 0) {
                              const email = cPasswordResults.recordset[0].email;
                              var deleteClient = new Client();
                              var args = {
                                data: { identifier: email },
                                headers: { "Content-Type": "application/json" }
                              };
                              deleteClient.post("https://api.octagonafrica.com/v1/password_reset", args, function (data, response) {
                                console.log(data);
                                if ([200].includes(response.statusCode)) {
                                  sms.send(reset.enterOTP(sender));
                                  console.log("OTP sent to " + email);
                                  console.log(response.statusCode);
                                } else if ([400].includes(response.statusCode)) {
                                  console.log(response.statusCode);
                                  sms.send(reset.error400(sender));
                                } else {
                                  console.log(response.statusCode);
                                }
                              });
                            }
                          });
                        } else if ([400].includes(response.statusCode)) {
                          console.log(response.statusCode);
                          sms.send(reset.error400(sender));
                          const statuserror404 = "ResetPasswordFailed";
                          const messagingSteperror404 = "2";
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
                          sms.send(reset.error500(sender));
                          const statuserror500 = "ResetPasswordFailed";
                          const messagingSteperror500 = "2";
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
                          // error code
                          console.log(response.statusCode);
                        }
                      });
                    }
                });
            
                  sql.close();
                });
              });