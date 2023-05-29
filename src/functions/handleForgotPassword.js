const sql = require('mssql');
var Client = require('node-rest-client').Client;
const httpProxy = require('http-proxy');
function handleForgotPassword(textMessage, sender, messagingStep, sms, forgotPassword, config, textIDAT, LinkID) {

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
    break;   
      
  }



}
module.exports = handleForgotPassword;