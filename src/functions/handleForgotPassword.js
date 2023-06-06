const sql = require('mssql');
var Client = require('node-rest-client').Client;
const httpProxy = require('http-proxy');
function handleForgotPassword(textMessage, sender, messagingStep, sms, forgotPassword, config, textIDAT, LinkID, reset) {

  switch (parseInt(messagingStep)) {
    case 1:
      //enter OTP///
      const textMessageOTP = textMessage;
      const phoneNumberOTP = sender;
      const messagingStepOTP  = "2";
      const textIDATOTP = textIDAT;
      const statusOTP = "isForgotPassword";
      sql.connect(config, function (err) {
        const request = new sql.Request();
        const updateReset = `UPDATE two_way_sms_tb SET status = @statusOTP, messagingStep = @messagingStepOTP, email_OTP = @textOTP  WHERE phoneNumber = @phoneNumberOTP AND text_id_AT = @textIDATOTP AND time = (
                    SELECT MAX(time) FROM two_way_sms_tb WHERE phoneNumber = @phoneNumberOTP )`;
        request.input('statusOTP', sql.VarChar, statusOTP);
        request.input('messagingStepOTP', sql.VarChar, messagingStepOTP);
        request.input('phoneNumberOTP', sql.NVarChar, phoneNumberOTP);
        request.input('textIDATOTP', sql.NVarChar, textIDATOTP);
        request.input('textOTP', sql.NVarChar, textMessageOTP);
        request.query(updateReset, function (err, results) {
          if (err) {
            console.error('Error executing query: ' + err.stack);
            return;
          }
          console.log('OTP UPDATE successful');
          sql.close();
        });
      });
      sms.sendPremium(forgotPassword.enterNewPassword(sender, LinkID));
    break;
    case 2:
      // new password///
      const statusNewPassword = "isForgotPassword";
        const phoneNumberNewPassword = sender;
        const messagingStepNewPassword = "3";
        const textIDATNewPassword = textIDAT;
        const textNewPassword = textMessage;
      sql.connect(config, function (err) {
        const request = new sql.Request();
        const updateReset = `UPDATE two_way_sms_tb SET status = @statusNewPassword, messagingStep = @messagingStepNewPassword, new_password = @textNewPassword  WHERE phoneNumber = @phoneNumberNewPassword AND text_id_AT = @textIDATNewPassword AND time = (
                    SELECT MAX(time) FROM two_way_sms_tb WHERE phoneNumber = @phoneNumberNewPassword )`;
        request.input('statusNewPassword', sql.VarChar, statusNewPassword);
        request.input('messagingStepNewPassword', sql.VarChar, messagingStepNewPassword);
        request.input('phoneNumberNewPassword', sql.NVarChar, phoneNumberNewPassword);
        request.input('textIDATNewPassword', sql.NVarChar, textIDATNewPassword);
        request.input('textNewPassword', sql.NVarChar, textNewPassword);
        request.query(updateReset, function (err, results) {
          if (err) {
            console.error('Error executing query: ' + err.stack);
            return;
          }
          console.log('New Password UPDATE successful');
          const statusNewPasswordEnd = "isForgotPassword";
          const phoneNumberEnding = phoneNumberNewPassword;
          const textIDEnd = textIDATNewPassword;
          // Bind the values to the parameters
          request.input('statusNewPasswordEnd', sql.NVarChar(50), statusNewPasswordEnd);
          request.input('phoneNumberEnding', sql.NVarChar(50), phoneNumberEnding);
          request.input('textIDEnd', sql.VarChar(100), textIDEnd);
          request.query("SELECT TOP 1 * FROM two_way_sms_tb WHERE phoneNumber = @phoneNumberEnding AND status = @statusNewPasswordEnd AND isActive = 1 AND text_id_AT = @textIDEnd order by time DESC", function (err, forgotPassword) {
            if (err) {
              console.error('Error executing query: ' + err.stack);
              return;
            }
            if (forgotPassword.recordset.length > 0) {
              const password = forgotPassword.recordset[0].new_password;
              const OTP = forgotPassword.recordset[0].email_OTP;
              var forgotPassword = new Client();
              var args = {// set content-type header and data as json in args parameter
                data: { code: OTP, password: password },
                headers: { "Content-Type": "application/json" }
              };
              forgotPassword.put("https://api.octagonafrica.com/v1/new_password", args, function (data, response) {
                // parsed response body as js object
                console.log(data);
                // raw response
                if ([200].includes(response.statusCode)) {
                  // success code
                  sms.sendPremium(reset.confirmation(sender, LinkID));
                  console.log(response.statusCode)
                  const statusResetConfirmation = "isForgotPassword";
                  const phoneNumberResetConfirmation45 = phoneNumberNewPassword;
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
                    const statuserror404 = "isForgotPasswordFailed";
                    const messagingSteperror404 = "0";
                    const phoneNumbererror404 = phoneNumberNewPassword;
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
                      console.log(' Forgot Password Attempt unsuccessful');
                      sql.close();
                    });
                  });
                }
                else if ([500].includes(response.statusCode)) {
                  console.log(response.statusCode);
                  sms.send({ 
                    to: sender, 
                    from: '24123', 
                    message: " Invalid request.",
                    bulkSMSMode: 0,
                    keyword: 'pension',
                    linkId: LinkID
                  });
                  sql.connect(config, function (err) {
                    const request = new sql.Request();
                    const statuserror500 = "ResetPasswordFailed";
                    const messagingSteperror500 = "0";
                    const phoneNumbererror500 = phoneNumberNewPassword;
                    const textIDATerror500 = textIDAT;
                    const updateDelete = `UPDATE two_way_sms_tb SET status = @statuserror500, messagingStep = @messagingSteperror500, isActive ='0'  WHERE phoneNumber = @phoneNumbererror500 AND text_id_AT =@textIDATerror500 AND time = (
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
                      console.log('Forgot Password Attempt unsuccessful');
                      sql.close();
                    });
                  });
                } else {
                  // error code
                  console.log(response.statusCode);
                  sql.connect(config, function (err) {
                    const request = new sql.Request();
                    const statuserror500 = "ResetPasswordFailed";
                    const messagingSteperror500 = "404";
                    const phoneNumbererror500 = phoneNumberNewPassword;
                    const textIDATerror500 = textIDAT;
                    const updateDelete = `UPDATE two_way_sms_tb SET status = @statuserror500, messagingStep = @messagingSteperror500, isActive='0'  WHERE phoneNumber = @phoneNumbererror500 AND text_id_AT =@textIDATerror500 AND time = (
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
                      console.log(' Forgot Password Attempt unsuccessful');
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
    break;   
      
  }



}
module.exports = handleForgotPassword;