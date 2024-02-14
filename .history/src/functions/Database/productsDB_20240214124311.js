const sql = require('mssql');
var Client = require('node-rest-client').Client;

function updatePensionMessagingStep(statusIsPension, phoneNumberPension, messagingStepPension, textMessageProduct, config, textIDATPension) {
  sql.connect(config, function (err) {
    const request = new sql.Request();
    const updateProductsAndServices = `UPDATE two_way_sms_tb SET status = @statusIsPension, messagingStep = @messagingStepPension, product = @textMessageProduct WHERE phoneNumber = @phoneNumberPension AND text_id_AT = @textIDATPension AND time = (
  SELECT MAX(time) FROM two_way_sms_tb WHERE phoneNumber = @phoneNumberPension )`;
    request.input('statusIsPension', sql.VarChar, statusIsPension);
    request.input('messagingStepPension', sql.VarChar, messagingStepPension);
    request.input('phoneNumberPension', sql.NVarChar, phoneNumberPension);
    request.input('textMessageProduct', sql.NVarChar, textMessageProduct);
    request.input('textIDATPension', sql.NVarChar, textIDATPension);
    request.query(updateProductsAndServices, function (err, results) {
      if (err) {
        console.error('Error executing query: ' + err.stack);
        return;
      }
      console.log('Rating Value UPDATE successful');
      sql.close();
    });
  });
}

function updateProductDescription(sender, statusIPP, phoneNumberIPP, messagingStepIPP, textIPP, config, textIDATIPP, textIDAT, sms, LinkID){
  sql.connect(config, function (err) {
    const request = new sql.Request();
    const updateProductsAndServices = `UPDATE two_way_sms_tb SET status = @statusIPP, messagingStep = @messagingStepIPP, productDescription = @textIPP WHERE phoneNumber = @phoneNumberIPP AND text_id_AT = @textIDATIPP AND time = (
  SELECT MAX(time) FROM two_way_sms_tb WHERE phoneNumber = @phoneNumberIPP )`;
    request.input('statusIPP', sql.VarChar, statusIPP);
    request.input('messagingStepIPP', sql.VarChar, messagingStepIPP);
    request.input('phoneNumberIPP', sql.NVarChar, phoneNumberIPP);
    request.input('textIPP', sql.NVarChar, textIPP);
    request.input('textIDATIPP', sql.NVarChar, textIDATIPP);
    request.query(updateProductsAndServices, function (err, results) {
      if (err) {
        console.error('Error executing query: ' + err.stack);
        return;
      }
      console.log('Rating Value UPDATE successful');
      sql.close();
    });
  });
}
function  updateFname(sender, statusFname, phoneNumberFname, messagingStepFname, textFname, config, textIDATFname, textIDAT, sms, LinkID);{
  sql.connect(config, function (err) {
    const request = new sql.Request();
    const updateProductsAndServices = `UPDATE two_way_sms_tb SET status = @statusFname, messagingStep = @messagingStepIPP, productDescription = @textIPP WHERE phoneNumber = @phoneNumberIPP AND text_id_AT = @textIDATIPP AND time = (
  SELECT MAX(time) FROM two_way_sms_tb WHERE phoneNumber = @phoneNumberIPP )`;
    request.input('statusIPP', sql.VarChar, statusIPP);
    request.input('messagingStepIPP', sql.VarChar, messagingStepIPP);
    request.input('phoneNumberIPP', sql.NVarChar, phoneNumberIPP);
    request.input('textIPP', sql.NVarChar, textIPP);
    request.input('textIDATIPP', sql.NVarChar, textIDATIPP);
    request.query(updateProductsAndServices, function (err, results) {
      if (err) {
        console.error('Error executing query: ' + err.stack);
        return;
      }
      console.log('Rating Value UPDATE successful');
      sql.close();
    });
  });
}




module.exports = {updatePensionMessagingStep, updateProductDescription};