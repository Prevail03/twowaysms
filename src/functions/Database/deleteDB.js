const sql = require('mssql');
var Client = require('node-rest-client').Client;

function updateNationalID1(textIDATID, phoneNumberID, statusID, messagingStepID) {
  sql.connect(config, function (err) {
    const request = new sql.Request();
    const updateDelete = `UPDATE two_way_sms_tb SET status = @statusID, messagingStep = @messagingStepID WHERE phoneNumber = @phoneNumberID AND text_id_AT = @textIDATID AND time = (
        SELECT MAX(time) FROM two_way_sms_tb WHERE phoneNumber = @phoneNumberID )`;
    request.input('statusID', sql.VarChar, statusID);
    request.input('messagingStepID', sql.VarChar, messagingStepID);
    request.input('phoneNumberID', sql.VarChar, phoneNumberID);
    request.query(updateDelete, function (err, results) {
      if (err) {
        console.error('Error executing query: ' + err.stack);
        return;
      }
      console.log('ID # UPDATE successful');
      sql.close();
    });
  });
}

function updateNationalID2(statusPasswordDel, phoneNumberPasswordDel, messagingStepPasswordDel, textIDATPasswordDel, textNationalID, config) {
  sql.connect(config, function (err) {
    const request = new sql.Request();
    const updateDelete = `UPDATE two_way_sms_tb SET status = @statusPasswordDel, messagingStep = @messagingStepPasswordDel, national_ID=@textNationalID WHERE phoneNumber = @phoneNumberPasswordDel AND text_id_AT = @textIDATPasswordDel AND time = (
        SELECT MAX(time) FROM two_way_sms_tb WHERE phoneNumber = @phoneNumberPasswordDel )`;
    request.input('statusPasswordDel', sql.VarChar, statusPasswordDel);
    request.input('messagingStepPasswordDel', sql.VarChar, messagingStepPasswordDel);
    request.input('phoneNumberPasswordDel', sql.NVarChar, phoneNumberPasswordDel);
    request.input('textNationalID', sql.NVarChar, textNationalID);
    request.input('textIDATPasswordDel', sql.NVarChar, textIDATPasswordDel);
    request.query(updateDelete, function (err, results) {
      if (err) {
        console.error('Error executing query: ' + err.stack);
        return;
      }
      console.log(' ID # UPDATE successful');
      sql.close();
    });
  });
}
function updatePassword(statusPasswordDeleting, phoneNumberPasswordDeleting, messagingStepPasswordDeliting, textPassword, textIDATPasswordDeleting, config) {
  sql.connect(config, function (err) {
    const request = new sql.Request();
    const updateDelete = `UPDATE two_way_sms_tb SET status = @statusPasswordDeleting, messagingStep = @messagingStepPasswordDeliting, password=@textPassword WHERE phoneNumber = @phoneNumberPasswordDeleting AND text_id_AT = @textIDATPasswordDeleting AND time = (
        SELECT MAX(time) FROM two_way_sms_tb WHERE phoneNumber = @phoneNumberPasswordDeleting )`;
    request.input('statusPasswordDeleting', sql.VarChar, statusPasswordDeleting);
    request.input('messagingStepPasswordDeliting', sql.VarChar, messagingStepPasswordDeliting);
    request.input('phoneNumberPasswordDeleting', sql.NVarChar, phoneNumberPasswordDeleting);
    request.input('textPassword', sql.NVarChar, textPassword);
    request.input('textIDATPasswordDeleting', sql.NVarChar, textIDATPasswordDeleting);
    request.query(updateDelete, function (err, results) {
      if (err) {
        console.error('Error executing query: ' + err.stack);
        return;
      }
      console.log(' Password UPDATE successful');
      const statusReg = "isRegistering";
      const phoneNumberEnding = phoneNumberPasswordDeleting;
      const textIDEnD = textIDATPasswordDeleting;
      console.log(statusPasswordDeleting + ' ' + phoneNumberEnding+ ' ' + textIDEnD);
      // Bind the values to the parameters
      request.input('statusReg', sql.NVarChar(50), statusReg);
      request.input('phoneNumberEnding', sql.NVarChar(50), phoneNumberEnding);
      request.input('textIDEnD', sql.VarChar(100), textIDEnD);
      request.query("SELECT TOP 1 * FROM two_way_sms_tb WHERE phoneNumber = @phoneNumberEnding AND status = @statusReg AND isActive = 1 AND text_id_AT = @textIDEnD order by time DESC", function (err, registerResults) {
        if (err) {
          console.error('Error executing query: ' + err.stack);
          return;
        }
        if (registerResults.recordset.length > 0) {

          const national_ID = registerResults.recordset[0].national_ID;
          const pass = registerResults.recordset[0].password;
          const phone = registerResults.recordset[0].phoneNumber;
          console.log(national_ID + ' ' + pass + ' ' + phone);
        }
        
        sql.close();
      });
    });
  });
}

module.exports = { updateNationalID1, updateNationalID2, updatePassword };