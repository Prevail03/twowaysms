const sql = require('mssql');
var Client = require('node-rest-client').Client;

function updateEmail1(statusResetEmail, phoneNumberResetEmail, messagingStepResetEmail, textEmailReset, config, textIDATEmail) {
  sql.connect(config, function (err) {
    const request = new sql.Request();
    const updateDelete = `UPDATE two_way_sms_tb SET status = @statusResetEmail, messagingStep = @messagingStepResetEmail email = @textEmailReset WHERE phoneNumber = @phoneNumberResetEmail AND text_id_AT =@textIDATEmail text AND time = (
  SELECT MAX(time) FROM two_way_sms_tb WHERE phoneNumber = @phoneNumberResetEmail )`;
    request.input('statusResetEmail', sql.VarChar, statusResetEmail);
    request.input('messagingStepResetEmail', sql.VarChar, messagingStepResetEmail);
    request.input('phoneNumberResetEmail', sql.NVarChar, phoneNumberResetEmail);
    request.input('textEmailReset', sql.NVarChar, textEmailReset);
    request.input('textIDATEmail', sql.NVarChar, textIDATEmail);
    request.query(updateDelete, function (err, results) {
      if (err) {
        console.error('Error executing query: ' + err.stack);
        return;
      }
      console.log('Email UPDATE successful');

      sql.close();
    });
  });
}

function updateEmail2(statusResetCPassword, phoneNumberResetCPassword, messagingStepResetCPassword, textEmail, textIDATCPassword, config) {
  sql.connect(config, function (err) {
    const request = new sql.Request();
    const updateDelete = `UPDATE two_way_sms_tb SET status = @statusResetCPassword, messagingStep = @messagingStepResetCPassword, email = @textEmail WHERE phoneNumber = @phoneNumberResetCPassword AND text_id_AT = @textIDATCPassword AND time = (
    SELECT MAX(time) FROM two_way_sms_tb WHERE phoneNumber = @phoneNumberResetCPassword )`;
    request.input('statusResetCPassword', sql.VarChar, statusResetCPassword);
    request.input('messagingStepResetCPassword', sql.VarChar, messagingStepResetCPassword);
    request.input('phoneNumberResetCPassword', sql.NVarChar, phoneNumberResetCPassword);
    request.input('textEmail', sql.NVarChar, textEmail);
    request.input('textIDATCPassword', sql.NVarChar, textIDATCPassword);
    request.query(updateDelete, function (err, results) {
      if (err) {
        console.error('Error executing query: ' + err.stack);
        return;
      }
      console.log('Email UPDATE successful');
      sql.close();
    });
  });
}
function updateCurrentPassword(statusResetPassword, phoneNumberResetPassword, messagingStepResetPassword, textCPassword, textIDATPassword, config, sms, sender, reset, textIDAT) {
  sql.connect(config, function (err) {
    const requestUpdate = new sql.Request();
    const updateReset = `UPDATE two_way_sms_tb SET status = @statusResetPassword , messagingStep = @messagingStepResetPassword , password = @textCPassword WHERE phoneNumber = @phoneNumberResetPassword AND text_id_AT = @textIDATPassword AND  time = (
        SELECT MAX(time) FROM two_way_sms_tb WHERE phoneNumber = @phoneNumberResetPassword )`;
    requestUpdate.input('statusResetPassword', sql.VarChar, statusResetPassword);
    requestUpdate.input('messagingStepResetPassword', sql.VarChar, messagingStepResetPassword);
    requestUpdate.input('phoneNumberResetPassword', sql.NVarChar, phoneNumberResetPassword);
    requestUpdate.input('textCPassword', sql.NVarChar, textCPassword);
    requestUpdate.input('textIDATPassword', sql.NVarChar, textIDATPassword);
    requestUpdate.query(updateReset, function (err, results) {
      if (err) {
        console.error('Error executing query: ' + err.stack);
        return;
      }
      console.log('Current Password UPDATE successful');
      // The first query has completed, so we can execute the second query now
      const statusReg = "ResetingPassword";
      const phoneNumberEnding = phoneNumberResetPassword;
      const textIDEnD = textIDAT;
      // Bind the values to the parameters
      const request = new sql.Request();
      request.input('statusReg', sql.NVarChar(50), statusReg);
      request.input('phoneNumberEnding', sql.NVarChar(50), phoneNumberEnding);
      request.input('textIDEnD', sql.VarChar(100), textIDEnD);
      request.query("SELECT TOP 1 * FROM two_way_sms_tb WHERE phoneNumber = @phoneNumberEnding AND status = @statusReg AND isActive = 1 AND text_id_AT = @textIDEnD order by time DESC", function (err, registerResults) {
        if (err) {
          console.error('Error executing query: ' + err.stack);
          return;
        }
        if (registerResults.recordset.length > 0) {
          const emailT = registerResults.recordset[0].email;
          const pass = registerResults.recordset[0].password;
          const phone = registerResults.recordset[0].phoneNumber;
          console.log(emailT + ' ' + pass + ' ' + phone);
          var deleteClient = new Client();
          var args = {
            data: { username: emailT, password: pass },
            headers: { "Content-Type": "application/json" }
          };
          deleteClient.post("https://api.octagonafrica.com/v1/login", args, function (data, response) {
            if ([200].includes(response.statusCode)) {
              sms.send(reset.verifyPassword(sender));
              var deleteClient = new Client();
              var args = {
                data: { identifier: emailT },
                headers: { "Content-Type": "application/json" }
              };
              deleteClient.post("https://api.octagonafrica.com/v1/password_reset", args, function (data, response) {
                console.log(data);
                if ([200].includes(response.statusCode)) {
                  sms.send(reset.enterOTP(sender));
                  console.log("OTP sent to " + emailT);
                  console.log(response.statusCode);
                } else if ([400].includes(response.statusCode)) {
                  console.log(response.statusCode);
                  sms.send(reset.error400(sender));
                } else {
                  console.log(response.statusCode);
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
        sql.close();
      });
    });
  });
}
function updateOTP(statusResetNPassword, messagingStepResetNPassword, textOTP, textIDATResetNPassword, phoneNumberResetNPassword, config) {
  sql.connect(config, function (err) {
    const request = new sql.Request();
    const updateReset = `UPDATE two_way_sms_tb SET status = @statusResetNPassword, messagingStep = @messagingStepResetNPassword, email_OTP = @textOTP  WHERE phoneNumber = @phoneNumberResetNPassword AND text_id_AT = @textIDATResetNPassword AND time = (
                SELECT MAX(time) FROM two_way_sms_tb WHERE phoneNumber = @phoneNumberResetNPassword )`;
    request.input('statusResetNPassword', sql.VarChar, statusResetNPassword);
    request.input('messagingStepResetNPassword', sql.VarChar, messagingStepResetNPassword);
    request.input('phoneNumberResetNPassword', sql.NVarChar, phoneNumberResetNPassword);
    request.input('textIDATResetNPassword', sql.NVarChar, textIDATResetNPassword);
    request.input('textOTP', sql.NVarChar, textOTP);
    request.query(updateReset, function (err, results) {
      if (err) {
        console.error('Error executing query: ' + err.stack);
        return;
      }
      console.log('OTP UPDATE successful');
      sql.close();
    });
  });
}
function updateNewPassword(statusResetNPasswordEnd, phoneNumberResetNPasswordEnd, messagingStepResetNPasswordEnd, textNewPassword, textIDATResetNPasswordEnd, config, sms, sender, reset, textIDAT) {
  sql.connect(config, function (err) {
    const request = new sql.Request();
    const updateReset = `UPDATE two_way_sms_tb SET status = @statusResetNPasswordEnd, messagingStep = @messagingStepResetNPasswordEnd, new_password = @textNewPassword  WHERE phoneNumber = @phoneNumberResetNPasswordEnd AND text_id_AT = @textIDATResetNPasswordEnd AND time = (
                SELECT MAX(time) FROM two_way_sms_tb WHERE phoneNumber = @phoneNumberResetNPasswordEnd )`;
    request.input('statusResetNPasswordEnd', sql.VarChar, statusResetNPasswordEnd);
    request.input('messagingStepResetNPasswordEnd', sql.VarChar, messagingStepResetNPasswordEnd);
    request.input('phoneNumberResetNPasswordEnd', sql.NVarChar, phoneNumberResetNPasswordEnd);
    request.input('textIDATResetNPasswordEnd', sql.NVarChar, textIDATResetNPasswordEnd);
    request.input('textNewPassword', sql.NVarChar, textNewPassword);
    request.query(updateReset, function (err, results) {
      if (err) {
        console.error('Error executing query: ' + err.stack);
        return;
      }
      console.log('OTP UPDATE successful');
      const statusResetEnd = "ResetingPassword";
      const phoneNumberEnding = phoneNumberResetNPasswordEnd;
      const textIDEnd = textIDATResetNPasswordEnd;
      // Bind the values to the parameters
      request.input('statusResetEnd', sql.NVarChar(50), statusResetEnd);
      request.input('phoneNumberEnding', sql.NVarChar(50), phoneNumberEnding);
      request.input('textIDEnd', sql.VarChar(100), textIDEnd);
      request.query("SELECT TOP 1 * FROM two_way_sms_tb WHERE phoneNumber = @phoneNumberEnding AND status = @statusResetEnd AND isActive = 1 AND text_id_AT = @textIDEnd order by time DESC", function (err, resetPasswordResults) {
        if (err) {
          console.error('Error executing query: ' + err.stack);
          return;
        }
        if (resetPasswordResults.recordset.length > 0) {
          const password = resetPasswordResults.recordset[0].new_password;
          const OTP = resetPasswordResults.recordset[0].email_OTP;
          var deleteClient = new Client();
          var args = {// set content-type header and data as json in args parameter
            data: { code: OTP, password: password },
            headers: { "Content-Type": "application/json" }
          };
          deleteClient.put("https://api.octagonafrica.com/v1/new_password", args, function (data, response) {// Actual Octagon Delete User Account API
            // parsed response body as js object
            console.log(data);
            // raw response
            if ([200].includes(response.statusCode)) {
              // success code
              sms.send(reset.confirmation(sender));
              console.log(response.statusCode)
              const statusResetConfirmation = "ResetingPassword";
              const phoneNumberResetConfirmation45 = phoneNumberResetNPasswordEnd;
              const messagingStepResetConfirmation = "0";
              sql.connect(config, function (err) {
                const request = new sql.Request();
                const updateReset = `UPDATE two_way_sms_tb SET status = @statusResetConfirmation, messagingStep = @messagingStepResetConfirmation , isActive = 0 WHERE phoneNumber = @phoneNumberResetConfirmation45 AND time = (
                        SELECT MAX(time) FROM two_way_sms_tb WHERE phoneNumber = @phoneNumberResetConfirmation45 )`;
                request.input('statusResetConfirmation', sql.VarChar, statusResetConfirmation);
                request.input('messagingStepResetConfirmation', sql.VarChar, messagingStepResetConfirmation);
                request.input('phoneNumberResetConfirmation45', sql.NVarChar, phoneNumberResetConfirmation45);
                request.query(updateReset, function (err, results) {
                  if (err) {
                    console.error('Error executing query: ' + err.stack);
                    return;
                  }
                  console.log('Password Reset Attempt successful');
                  sql.close();
                });
              });
            } else if ([400].includes(response.statusCode)) {
              console.log(response.statusCode);
              sms.send({ to: sender, from: '20880', message: " Invalid Details!!. Check your details and please try again Later " });
              sql.connect(config, function (err) {
                const request = new sql.Request();
                const statuserror404 = "ResetPasswordFailed";
                const messagingSteperror404 = "0";
                const phoneNumbererror404 = phoneNumberResetNPasswordEnd;
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
              });
            }
            else if ([500].includes(response.statusCode)) {
              console.log(response.statusCode);
              sms.send({ to: sender, from: '20880', message: " Invalid request.  " });
              sql.connect(config, function (err) {
                const request = new sql.Request();
                const statuserror500 = "ResetPasswordFailed";
                const messagingSteperror500 = "0";
                const phoneNumbererror500 = phoneNumberResetNPasswordEnd;
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
module.exports = { updateEmail1, updateEmail2, updateCurrentPassword, updateOTP, updateNewPassword };