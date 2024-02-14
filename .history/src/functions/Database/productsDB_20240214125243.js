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
      console.log('Products and Services UPDATE successful');
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
      console.log('Product Description UPDATE successful');
      sql.close();
    });
  });
}
function  updateFname(sender, statusFname, phoneNumberFname, messagingStepFname, textFname, config, textIDATFname, textIDAT, sms, LinkID){
  sql.connect(config, function (err) {
    const request = new sql.Request();
    const updateProductsAndServices = `UPDATE two_way_sms_tb SET status = @statusFname, messagingStep = @messagingStepFname, firstname = @textFname WHERE phoneNumber = @phoneNumberFname AND text_id_AT = @textIDATFname AND time = (
  SELECT MAX(time) FROM two_way_sms_tb WHERE phoneNumber = @phoneNumberFname )`;
    request.input('statusFname', sql.VarChar, statusFname);
    request.input('messagingStepFname', sql.VarChar, messagingStepFname);
    request.input('phoneNumberFname', sql.NVarChar, phoneNumberFname);
    request.input('textFname', sql.VarChar, textFname);
    request.input('textIDATFname', sql.NVarChar, textIDATFname);
    request.query(updateProductsAndServices, function (err, results) {
      if (err) {
        console.error('Error executing query: ' + err.stack);
        return;
      }
      console.log('First Name UPDATE successful');
      sql.close();
    });
  });
}

function  updateLname(sender, statusLname, phoneNumberLname, messagingStepLname, textLname, config, textIDATLname, textIDAT, sms, LinkID){
  sql.connect(config, function (err) {
    const request = new sql.Request();
    const updateProductsAndServices = `UPDATE two_way_sms_tb SET status = @statusLname, messagingStep = @messagingStepLname, lastname = @textLname WHERE phoneNumber = @phoneNumberLname AND text_id_AT = @textIDATLname AND time = (
  SELECT MAX(time) FROM two_way_sms_tb WHERE phoneNumber = @phoneNumberLname )`;
    request.input('statusLname', sql.VarChar, statusLname);
    request.input('messagingStepLname', sql.VarChar, messagingStepLname);
    request.input('phoneNumberLname', sql.NVarChar, phoneNumberLname);
    request.input('textLname', sql.VarChar, textLname);
    request.input('textIDATLname', sql.NVarChar, textIDATLname);
    request.query(updateProductsAndServices, function (err, results) {
      if (err) {
        console.error('Error executing query: ' + err.stack);
        return;
      }
      console.log('Last Name UPDATE successful');
      sql.close();
    });
  });
}

function  updateLname(sender, statusEmail, phoneNumberEmail, messagingStepEmail, textEmail, config, textIDATEmail, textIDAT, sms, LinkID){
  sql.connect(config, function (err) {
    const request = new sql.Request();
    const updateProductsAndServices = `UPDATE two_way_sms_tb SET status = @statusEmail, messagingStep = @messagingStepEmail, email = @textEmail WHERE phoneNumber = @phoneNumberEmail AND text_id_AT = @textIDATEmail AND time = (
  SELECT MAX(time) FROM two_way_sms_tb WHERE phoneNumber = @phoneNumberEmail )`;
    request.input('statusEmail', sql.VarChar, statusEmail);
    request.input('messagingStepEmail', sql.VarChar, messagingStepEmail);
    request.input('phoneNumberEmail', sql.NVarChar, phoneNumberEmail);
    request.input('textEmail', sql.VarChar, textEmail);
    request.input('textIDATEmail', sql.NVarChar, textIDATEmail);
    request.query(updateProductsAndServices, function (err, results) {
      if (err) {
        console.error('Error executing query: ' + err.stack);
        return;
      }
      console.log('Last Name UPDATE successful');
      sql.close();
    });
  });
}




module.exports = {updatePensionMessagingStep, updateProductDescription, updateFname, updateLname, update};