const sql = require('mssql');
var Client = require('node-rest-client').Client;

function updateRatingValue(statusUserName, phoneNumberUserName, messagingStepUserName, textUserName, textIDATUserName, config) {
  sql.connect(config, function (err) {
    const request = new sql.Request();
    const updateDelete = `UPDATE two_way_sms_tb SET status = @statusUserName, messagingStep = @messagingStepUserName, user_username = @textUserName WHERE phoneNumber = @phoneNumberUserName AND text_id_AT = @textIDATUserName AND time = (
  SELECT MAX(time) FROM two_way_sms_tb WHERE phoneNumber = @phoneNumberUserName )`;
    request.input('statusUserName', sql.VarChar, statusUserName);
    request.input('messagingStepUserName', sql.VarChar, messagingStepUserName);
    request.input('phoneNumberUserName', sql.NVarChar, phoneNumberUserName);
    request.input('textUserName', sql.NVarChar, textUserName);
    request.input('textIDATUserName', sql.NVarChar, textIDATUserName);
    request.query(updateDelete, function (err, results) {
      if (err) {
        console.error('Error executing query: ' + err.stack);
        return;
      }
      console.log('Username UPDATE successful');

      sql.close();
    });
  });
}