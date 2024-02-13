const sql = require('mssql');
var Client = require('node-rest-client').Client;

function updateRatingValue(statusRateValue, phoneNumberRateValue, messagingRateValue, textRateValue, config, textIDATRateValue) {
  sql.connect(config, function (err) {
    const request = new sql.Request();
    const updateDelete = `UPDATE two_way_sms_tb SET status = @statusRateValue, messagingStep = @messagingRateValue, user_username = @textRateValue WHERE phoneNumber = @phoneNumberRateValue AND text_id_AT = @textIDATRateValue AND time = (
  SELECT MAX(time) FROM two_way_sms_tb WHERE phoneNumber = @phoneNumberRateValue )`;
    request.input('statusRateValue', sql.VarChar, statusRateValue);
    request.input('messagingRateValue', sql.VarChar, messagingRateValue);
    request.input('phoneNumberRateValue', sql.NVarChar, phoneNumberRateValue);
    request.input('textRateValue', sql.NVarChar, textRateValue);
    request.input('textIDATRateValue', sql.NVarChar, textIDATRateValue);
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
module.exports = {updateRatingValue};