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
      console.log('UPDATE successful');
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
      console.log('UPDATE successful');
      sql.close();
    });
  });
}
function updateCurrentPassword(text, statusResetPassword, phoneNumberResetPassword, messagingStepResetPassword, textCPassword, textIDATPassword, sender, reset, phoneNumber, config, textIDAT) {
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
      //confirm login /send to octagon Login API
      const statusCurrentPass = "ResetPassword";
      const phoneNumberCPass = sender;
      const textIDCPass = textIDAT;
      console.log(statusCurrentPass + " "+ phoneNumberCPass+" "+textIDCPass);
      console.log(phoneNumber + " " + sender + " " + textIDAT + " " );
      // Bind the values to the parameters
      request.input('statusCurrentPass', sql.NVarChar(50), statusCurrentPass);
      request.input('phoneNumberCPass', sql.NVarChar(50), phoneNumberCPass);
      request.input('textIDCPass', sql.VarChar(100), textIDCPass);
      request.query("SELECT TOP 1 * FROM two_way_sms_tb WHERE phoneNumber = @phoneNumberCPass AND status = @statusCurrentPass AND isActive = 1 AND text_id_AT = @textIDCPass order by time DESC", function (err, cPassResults) {
        if (err) {
          console.error('Error executing query: ' + err.stack);
          return;
        }
        console.log(cPassResults);
        if (cPassResults.recordset.length > 0) {
          console.log('User exists');
          const password = cPassResults.recordset[0].password;
          const email = cPassResults.recordset[0].email;

          var deleteClient = new Client();
          var args = {
            data: { username: email, password: password },
            headers: { "Content-Type": "application/json" }
          };
          deleteClient.post("https://api.octagonafrica.com/v1/login", args, function (data, response) {
            if ([200].includes(response.statusCode)) {
              sms.send(reset.verifyPassword(sender));
              const statusCurrentPass = "ResetPassword";
              const phoneNumberCPass = phoneNumber;
              const textIDCPass = textIDAT;
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
                  const email = cPassResults.recordset[0].email;
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
              const phoneNumbererror404 = phoneNumber;
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
                console.log('UPDATE successful');
                sql.close();
              });
            } else if ([500].includes(response.statusCode)) {
              console.log(response.statusCode);
              sms.send({
                to: sender,
                from: '20880',
                message: " Invalid request.  "
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
module.exports = { updateEmail1, updateEmail2,updateCurrentPassword };