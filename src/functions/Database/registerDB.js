const sql = require('mssql');

function updateNationalID(statusEmail,phoneNumberEmail,messagingStepEmail,textIDNumber,textIDATEmail,config){
  sql.connect(config, function (err) {
    const request = new sql.Request();
    const updateRegister1 = `UPDATE two_way_sms_tb SET status = @statusEmail, messagingStep = @messagingStepEmail, national_ID=@textIDNUmber WHERE phoneNumber = @phoneNumberEmail AND text_id_AT = @textIDATEmail AND time = (
    SELECT MAX(time) FROM two_way_sms_tb WHERE phoneNumber = @phoneNumberEmail )`;
    request.input('statusEmail', sql.VarChar, statusEmail);
    request.input('messagingStepEmail', sql.VarChar, messagingStepEmail);
    request.input('phoneNumberEmail', sql.VarChar, phoneNumberEmail);
    request.input('textIDNumber', sql.VarChar, textIDNumber);
    request.input('textIDATEmail', sql.VarChar, textIDATEmail);
    request.query(updateRegister1, function (err, results) {
        if (err) {
            console.error('Error executing query: ' + err.stack);
            return;
        }
        console.log('ID # UPDATED successfully');
    });
});
}

function InvalidNationalID(statusFail,phoneNumberFail,messagingStepFail,config){
  sql.connect(config, function (err) {
    const request = new sql.Request(connection);
    const updateRegister1 = `UPDATE two_way_sms_tb SET status = @statusFail, messagingStep = @messagingStepFail WHERE phoneNumber = @phoneNumberFail AND time = (
    SELECT MAX(time) FROM two_way_sms_tb WHERE phoneNumber = @phoneNumberFail )`;
    request.input('statusFail', sql.VarChar, statusFail);
    request.input('messagingStepFail', sql.VarChar, messagingStepFail);
    request.input('phoneNumberFail', sql.VarChar, phoneNumberFail);
    request.query(updateRegister1, function (err, results) {
        if (err) {
            console.error('Error executing query: ' + err.stack);
            return;
        }
        console.log('Invalid ID number.');
        sql.close();
    });
});
}
function updateEmail(statusPassword, phoneNumberPassword, messagingStepPassword, textEmail, textIDATPass, config) {
  sql.connect(config, function (err) {
    const request = new sql.Request();
    const updateRegister1 = `UPDATE two_way_sms_tb SET status = @statusPassword, messagingStep = @messagingStepPassword, email = @textEmail WHERE phoneNumber = @phoneNumberPassword  AND text_id_AT = @textIDATPass  AND time = (
      SELECT MAX(time) FROM two_way_sms_tb WHERE phoneNumber = @phoneNumberPassword )`;
    request.input('statusPassword', sql.VarChar, statusPassword);
    request.input('messagingStepPassword', sql.VarChar, messagingStepPassword);
    request.input('phoneNumberPassword', sql.VarChar, phoneNumberPassword);
    request.input('textEmail', sql.VarChar, textEmail);
    request.input('textIDATPass', sql.VarChar, textIDATPass);
    request.query(updateRegister1, function (err, results) {
      if (err) {
        console.error('Error executing query: ' + err.stack);
        return;
      }
      console.log('Email UPDATE successful');
      sql.close();
    });
  });
}
module.exports = {
updateNationalID,
InvalidNationalID,
updateEmail
};