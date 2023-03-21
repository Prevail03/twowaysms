const sql = require('mssql');
var Client = require('node-rest-client').Client;

function updateNationalID1(textIDATID, phoneNumberID, statusID,messagingStepID){
  sql.connect(config, function(err) {
    const request = new sql.Request();
    const updateDelete = `UPDATE two_way_sms_tb SET status = @statusID, messagingStep = @messagingStepID WHERE phoneNumber = @phoneNumberID AND text_id_AT = @textIDATID AND time = (
        SELECT MAX(time) FROM two_way_sms_tb WHERE phoneNumber = @phoneNumberID )`;
    request.input('statusID', sql.VarChar, statusID);
    request.input('messagingStepID', sql.VarChar, messagingStepID);
    request.input('phoneNumberID', sql.VarChar, phoneNumberID);
    request.query(updateDelete, function(err, results) {
    if (err) {
        console.error('Error executing query: ' + err.stack);
        return;
    }
    console.log('ID # UPDATE successful');
    sql.close();
    });
});
}

function updateNationalID2(statusPasswordDel, phoneNumberPasswordDel, messagingStepPasswordDel,textIDATPasswordDel,textNationalID,config) {
  sql.connect(config, function(err) {
    const request = new sql.Request();
    const updateDelete = `UPDATE two_way_sms_tb SET status = @statusPasswordDel, messagingStep = @messagingStepPasswordDel, national_ID=@textNationalID WHERE phoneNumber = @phoneNumberPasswordDel AND text_id_AT = @textIDATPasswordDel AND time = (
        SELECT MAX(time) FROM two_way_sms_tb WHERE phoneNumber = @phoneNumberPasswordDel )`;
    request.input('statusPasswordDel', sql.VarChar, statusPasswordDel);
    request.input('messagingStepPasswordDel', sql.VarChar, messagingStepPasswordDel);
    request.input('phoneNumberPasswordDel', sql.NVarChar, phoneNumberPasswordDel);
    request.input('textNationalID', sql.NVarChar, textNationalID);
    request.input('textIDATPasswordDel', sql.NVarChar, textIDATPasswordDel);
    request.query(updateDelete, function(err, results) {
    if (err) {
        console.error('Error executing query: ' + err.stack);
        return;
    }
    console.log(' ID # UPDATE successful');
    sql.close();
    });
});
}

module.exports = {updateNationalID1, updateNationalID2};