const sql = require('mssql');
var Client = require('node-rest-client').Client;

function updateUserNameFail(statusUserName, phoneNumberUserName, messagingStepUserName, textUserName, textIDATUserName,config){
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

function updateUserNameSuccess(phoneNumberUserNameS,textUsername,textIDATUserNameS,config ){
sql.connect(config, function (err) {
    if (err) {
        console.error('Error connecting to the database: ' + err.stack);
        return;
    }
    console.log('Connected to the database');

    const request = new sql.Request();
    const updateDelete = `UPDATE two_way_sms_tb SET status = 'isCheckingAccount', messagingStep= '3', user_username = @textUsername WHERE phoneNumber = @phoneNumberUserNameS AND text_id_AT = @textIDATUserNameS AND time = (SELECT MAX(time) FROM two_way_sms_tb WHERE phoneNumber = @phoneNumberUserNameS)`;
    request.input('phoneNumberUserNameS', sql.NVarChar, phoneNumberUserNameS);
    request.input('textIDATUserNameS', sql.NVarChar, textIDATUserNameS);
    request.input('textUsername', sql.NVarChar, textUsername);
    request.query(updateDelete, function (err, results) {
        if (err) {
            console.error('Error executing query: ' + err.stack);
            sql.close();
            return;
        }
        console.log('UserName UPDATE successful');
        console.log('Query results:', results);
        sql.close();
    });
});
}
module.exports = {updateUserNameFail, updateUserNameSuccess};