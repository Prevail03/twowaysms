const sql = require('mssql');
var Client = require('node-rest-client').Client;

function updatePensionMessagingStep(statusIsPension, phoneNumberPension, meessagingStepPension, texMessageProduct, config, textIDATRateValue)
updatePensionMessagingStep(statusIsPension, phoneNumberPension, messagingStepPension, textMessageProduct, config, textIDATPension); {
  sql.connect(config, function (err) {
    const request = new sql.Request();
    const updateDelete = `UPDATE two_way_sms_tb SET status = @statusIsPension, messagingStep = @messagingStepPension, rateValue = @texMessageProduct WHERE phoneNumber = @phoneNumberPension AND text_id_AT = @textIDATRateValue AND time = (
  SELECT MAX(time) FROM two_way_sms_tb WHERE phoneNumber = @phoneNumberPension )`;
    request.input('statusIsPension', sql.VarChar, statusIsPension);
    request.input('messagingStepPension', sql.VarChar, messagingStepPension);
    request.input('phoneNumberPension', sql.NVarChar, phoneNumberPension);
    request.input('texMessageProduct', sql.NVarChar, texMessageProduct);
    request.input('textIDATRateValue', sql.NVarChar, textIDATRateValue);
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