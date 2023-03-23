const sql = require('mssql');
var Client = require('node-rest-client').Client;

function updateEmailAccountFail(statusAccountEmail, phoneNumberAccountEmail, messagingStepAccountEmail, textEmailAccount, textIDATEmail){
  sql.connect(config, function (err) {
    const request = new sql.Request();
    const updateDelete = `UPDATE two_way_sms_tb SET status = @statusAccountEmail, messagingStep = @messagingStepAccountEmail email = @textEmailAccount WHERE phoneNumber = @phoneNumberAccountEmail AND text_id_AT =@textIDATEmail text AND time = (
  SELECT MAX(time) FROM two_way_sms_tb WHERE phoneNumber = @phoneNumberAccountEmail )`;
    request.input('statusAccountEmail', sql.VarChar, statusAccountEmail);
    request.input('messagingStepAccountEmail', sql.VarChar, messagingStepAccountEmail);
    request.input('phoneNumberAccountEmail', sql.NVarChar, phoneNumberAccountEmail);
    request.input('textEmailAccount', sql.NVarChar, textEmailAccount);
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

function updateEmailAccountFail(statusAccountEmailSuccess, phoneNumberAccountEmailSuccess, messagingStepAccountEmailSuccess, textEmailAccountSuccess, textIDATEmailSuccess){
  sql.connect(config, function (err) {
    const request = new sql.Request();
    const updateDelete = `UPDATE two_way_sms_tb SET status = @statusAccountEmailSuccess, messagingStep = @messagingStepAccountEmailSuccess email = @textEmailAccountSuccess WHERE phoneNumber = @phoneNumberAccountEmailSuccess AND text_id_AT =@textIDATEmailSuccess text AND time = (
  SELECT MAX(time) FROM two_way_sms_tb WHERE phoneNumber = @phoneNumberAccountEmailSuccess )`;
    request.input('statusAccountEmail', sql.VarChar, statusAccountEmailSuccess);
    request.input('messagingStepAccountEmail', sql.VarChar, messagingStepAccountEmailSuccess);
    request.input('phoneNumberAccountEmail', sql.NVarChar, phoneNumberAccountEmailSuccess);
    request.input('textEmailAccount', sql.NVarChar, textEmailAccountSuccess);
    request.input('textIDATEmail', sql.NVarChar, textIDATEmailSuccess);
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

module.exports = {updateEmailAccountFail};