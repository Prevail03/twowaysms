const sql = require('mssql');
var Client = require('node-rest-client').Client;

function updatePensionMessagingStep(statusIsPension, phoneNumberPension, messagingStepPension, textMessageProduct, config, textIDATPension) {
  sql.connect(config, function (err) {
    const request = new sql.Request();
    const updateDelete = `UPDATE two_way_sms_tb SET status = @statusIsPension, messagingStep = @messagingStepPension, product = @textMessageProduct WHERE phoneNumber = @phoneNumberPension AND text_id_AT = @textIDATRatePension AND time = (
  SELECT MAX(time) FROM two_way_sms_tb WHERE phoneNumber = @phoneNumberPension )`;
    request.input('statusIsPension', sql.VarChar, statusIsPension);
    request.input('messagingStepPension', sql.VarChar, messagingStepPension);
    request.input('phoneNumberPension', sql.NVarChar, phoneNumberPension);
    request.input('textMessageProduct', sql.NVarChar, textMessageProduct);
    request.input('textIDATPension', sql.NVarChar, textIDATPension);
    request.query(updateDelete, function (err, results) {
      if (err) {
        console.error('Error executing query: ' + err.stack);
        return;
      }
      console.log('Rating Value UPDATE successful');
      sql.close();
    });
  });
}



module.exports = {updatePensionMessagingStep, updateReason};