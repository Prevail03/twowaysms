const sql = require('mssql');
var Client = require('node-rest-client').Client;

function updateEmail1(statusResetEmail,phoneNumberResetEmail,messagingStepResetEmail,textEmailReset,config ,textIDATEmail){
sql.connect(config, function (err) {
  const request = new sql.Request();
  const updateDelete = `UPDATE two_way_sms_tb SET status = @statusResetEmail, messagingStep = @messagingStepResetEmail email = @textEmailReset WHERE phoneNumber = @phoneNumberResetEmail AND text_id_AT =@textIDATEmail text AND time = (
  SELECT MAX(time) FROM two_way_sms_tb WHERE phoneNumber = @phoneNumberResetEmail )`;
  request.input('statusResetEmail', sql.VarChar, statusResetEmail);
  request.input('messagingStepResetEmail', sql.VarChar, messagingStepResetEmail);
  request.input('phoneNumberResetEmail', sql.NVarChar, phoneNumberResetEmail);
  request.input('textEmailReset', sql.NVarChar, textEmailReset );
  request.input('textIDATEmail', sql.NVarChar, textIDATEmail );
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

function updateEmail2(statusResetCPassword, phoneNumberResetCPassword, messagingStepResetCPassword, textEmail, textIDATCPassword,config) {
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
module.exports = { updateEmail1,updateEmail2 };