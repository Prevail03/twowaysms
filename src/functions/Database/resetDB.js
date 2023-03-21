const sql = require('mssql');
var Client = require('node-rest-client').Client;

function updateEmail1(statusResetEmail, phoneNumberResetEmail, messagingStepResetEmail, textEmailReset, config, textIDATEmail) {
  sql.connect(config, function (err) {
    const request = new sql.Request();
    const updateDelete = `UPDATE two_way_sms_tb SET status = @statusResetEmail, messagingStep = @messagingStepResetEmail email = @textEmailReset WHERE phoneNumber = @phoneNumberResetEmail AND text_id_AT =@textIDATEmail text AND time = (
  SELECT MAX(time) FROM two_way_sms_tb WHERE phoneNumber = @phoneNumberResetEmail )`;
    request.input('statusResetEmail', sql.VarChar, statusResetEmail);
    request.input('messagingStepResetEmail', sql.VarChar, messagingStepResetEmail);
    request.input('phoneNumberResetEmail', sql.NVarChar, phoneNumberResetEmail);
    request.input('textEmailReset', sql.NVarChar, textEmailReset);
    request.input('textIDATEmail', sql.NVarChar, textIDATEmail);
    request.query(updateDelete, function (err, results) {
      if (err) {
        console.error('Error executing query: ' + err.stack);
        return;
      }
      console.log('UPDATE successful');
      sql.close();
    });
  });
}

function updateEmail2(statusResetCPassword, phoneNumberResetCPassword, messagingStepResetCPassword, textEmail, textIDATCPassword, config) {
  sql.connect(config, function (err) {
    const request = new sql.Request();
    const updateDelete = `UPDATE two_way_sms_tb SET status = @statusResetCPassword, messagingStep = @messagingStepResetCPassword, email = @textEmail WHERE phoneNumber = @phoneNumberResetCPassword AND text_id_AT = @textIDATCPassword AND time = (
    SELECT MAX(time) FROM two_way_sms_tb WHERE phoneNumber = @phoneNumberResetCPassword )`;
    request.input('statusResetCPassword', sql.VarChar, statusResetCPassword);
    request.input('messagingStepResetCPassword', sql.VarChar, messagingStepResetCPassword);
    request.input('phoneNumberResetCPassword', sql.NVarChar, phoneNumberResetCPassword);
    request.input('textEmail', sql.NVarChar, textEmail);
    request.input('textIDATCPassword', sql.NVarChar, textIDATCPassword);
    request.query(updateDelete, function (err, results) {
      if (err) {
        console.error('Error executing query: ' + err.stack);
        return;
      }
      console.log('UPDATE successful');
      sql.close();
    });
  });
}
function  fetchData(statusResetPassword,phoneNumberResetPassword,messagingStepResetPassword,textIDATPassword){ 
  const requestSelect = new sql.Request();
  const statusReg = statusResetPassword;
  const phoneNumberEnding = phoneNumberResetPassword;
  const textIDEnD = textIDATPassword;
  console.log(statusReg +" "+phoneNumberEnding +" "+textIDEnD);
  // Bind the variables to parameters for a SQL query
  requestSelect.input('statusReg', sql.NVarChar, statusReg);
  requestSelect.input('textIDEnD', sql.NVarChar, textIDEnD);
  requestSelect.input('phoneNumberEnding', sql.NVarChar, phoneNumberEnding);
  // Execute a SQL query
  requestSelect.query("SELECT TOP 1 * FROM two_way_sms_tb WHERE phoneNumber = @phoneNumberEnding AND status = @statusReg AND isActive = 1 AND text_id_AT = @textIDEnD order by time DESC", function (err, registerResults) {
      if (err) {
          console.error('Error executing query: ' + err.stack);
          return;
      }
      // If the query returned results, retrieve user information and log it
      if (registerResults.recordset.length > 0) {
          try {
              const fname = registerResults.recordset[0].firstname;
              const lname = registerResults.recordset[0].lastname;
              const national_ID = registerResults.recordset[0].national_ID;
              const emailT = registerResults.recordset[0].email;
              const pass = registerResults.recordset[0].password;
              const phone = registerResults.recordset[0].phoneNumber;
          
              console.log("First name: " + fname + " last name: " + lname + " national ID: " + national_ID + "  pass: #" + pass + "  phone" + phone + "  email:  #" + emailT);
          } catch (err) {
              console.error('Error retrieving user information: ' + err.stack);
          } 
      }
  }); 
}

module.exports = { updateEmail1, updateEmail2, fetchData };