const sql = require('mssql');
var Client = require('node-rest-client').Client;

function updatePensionMessagingStep(statusIsPension, phoneNumberRateValue, meessagingStepPension, textRateValue, config, textIDATRateValue)
updatePensionMessagingStep(statusIsPension, phoneNumberPension, messagingStepPension, textMessageProduct, config, textIDATPension); {
  sql.connect(config, function (err) {
    const request = new sql.Request();
    const updateDelete = `UPDATE two_way_sms_tb SET status = @statusIsPension, messagingStep = @meessagingStepPension, rateValue = @textRateValue WHERE phoneNumber = @phoneNumberRateValue AND text_id_AT = @textIDATRateValue AND time = (
  SELECT MAX(time) FROM two_way_sms_tb WHERE phoneNumber = @phoneNumberRateValue )`;
    request.input('statusIsPension', sql.VarChar, statusIsPension);
    request.input('meessagingStepPension', sql.VarChar, meessagingStepPension);
    request.input('phoneNumberRateValue', sql.NVarChar, phoneNumberRateValue);
    request.input('textRateValue', sql.NVarChar, textRateValue);
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