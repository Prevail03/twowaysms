const sql = require('mssql');
var Client = require('node-rest-client').Client;

function  updateNationalID1(textIDATID, phoneNumberID, statusID,messagingStepID) {
  sql.connect(config, function (err) {
    const request = new sql.Request();
    const updateDelete = `UPDATE two_way_sms_tb SET status = @statusID, messagingStep = @messagingStepID WHERE phoneNumber = @phoneNumberID AND text_id_AT = @textIDATID AND time = (
        SELECT MAX(time) FROM two_way_sms_tb WHERE phoneNumber = @phoneNumberID )`;
    request.input('statusID', sql.VarChar, statusID);
    request.input('messagingStepID', sql.VarChar, messagingStepID);
    request.input('textIDATID', sql.VarChar, textIDATID);
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
function updatePassword(statusPasswordDeleting, phoneNumberPasswordDeleting, messagingStepPasswordDeliting, textPassword, textIDATPasswordDeleting, config, sms, sender, textIDAT, LinkID) {
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
      const statusReg = "isDeleting";
      const phoneNumberEnding = phoneNumberPasswordDeleting;
      const textIDEnD = textIDATPasswordDeleting;
      console.log(statusPasswordDeleting + ' ' + phoneNumberEnding + ' ' + textIDEnD);
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
          // Sending the request to octagon Delete User Account  API
          var deleteClient = new Client({ proxy: false });
          // set content-type header and data as json in args parameter
          var args = {
            data: { ID: national_ID, password: pass },
            headers: { "Content-Type": "application/json" }
          };
          deleteClient.post("https://api.octagonafrica.com/v1/user/delete", args, function (data, response) {
            if ([200].includes(response.statusCode)) {
              // success code
              sms.sendPremium({
                to: sender,
                from: '24123',
                message: "Account Deactivated Successfully. It was a pleasure doing Business with you",
                bulkSMSMode: 0,
                keyword: 'pension',
                linkId: LinkID
              });
              console.log(response.statusCode);
              const statusDelEnd = "FinishedisDeleting";
              const phoneNumberDelEnd = sender;
              const messagingStepDelEnd = "0";
              const textIDATDelEnd = textIDAT;
              const isActiveDelEnd = "0";
              sql.connect(config, function (err) {
                const request = new sql.Request();
                const updateDelete = `UPDATE two_way_sms_tb SET status = @statusDelEnd, messagingStep = @messagingStepDelEnd WHERE phoneNumber = @phoneNumberDelEnd AND text_id_AT = @textIDATDelEnd AND time = (
                              SELECT MAX(time) FROM two_way_sms_tb WHERE phoneNumber = @phoneNumberDelEnd )`;
                request.input('statusDelEnd', sql.VarChar, statusDelEnd);
                request.input('messagingStepDelEnd', sql.VarChar, messagingStepDelEnd);
                request.input('phoneNumberDelEnd', sql.NVarChar, phoneNumberDelEnd);
                request.input('isActiveDelEnd', sql.Bit, isActiveDelEnd);
                request.input('textIDATDelEnd', sql.NVarChar, textIDATDelEnd);
                request.query(updateDelete, function (err, results) {
                  if (err) {
                    console.error('Error executing query: ' + err.stack);
                    return;
                  }
                  console.log('Delete Account successful');
                  sql.close();
                });
              });
            } else if ([400].includes(response.statusCode) || [401].includes(response.statusCode)) {
              console.log(response.statusCode);
              sms.sendPremium({ 
                to: sender, 
                from: '24123', 
                message: " Invalid Details!!. Check your details and please try again Later ",
                bulkSMSMode: 0,
                keyword: 'pension',
                linkId: LinkID 
              });
              sql.connect(config, function (err) {
                console.log('Connected to the database');
                const request = new sql.Request();
                const statuserror404 = "DeleteAccountFailed";
                const messagingSteperror404 = "0";
                const phoneNumbererror404 = sender;
                const textIDATerror404 = textIDAT;
                const updateDelete = `UPDATE two_way_sms_tb SET status = @statuserror404, messagingStep = @messagingSteperror404, isActive = '0'  WHERE phoneNumber = @phoneNumbererror404 AND text_id_AT =@textIDATerror404 AND time = (
                                        SELECT MAX(time) FROM two_way_sms_tb WHERE phoneNumber = @phoneNumbererror404 )`;
                request.input('statuserror404', sql.VarChar, statuserror404);
                request.input('messagingSteperror404', sql.VarChar, messagingSteperror404);
                request.input('phoneNumbererror404', sql.NVarChar, phoneNumbererror404);
                request.input('textIDATerror404', sql.NVarChar, textIDATerror404);
                request.query(updateDelete, function (err, results) {
                  if (err) {
                    console.error('Error executing query: ' + err.stack);
                    return;
                  }
                  console.log('Delete Attempt unsuccessful');
                  sql.close();
                });
              });
            } else if ([500].includes(response.statusCode)) {
              console.log(response.statusCode);
              sms.sendPremium({ 
                to: sender, 
                from: '24123', 
                message: " Invalid request. Please input your National Id and password. ",
                bulkSMSMode: 0,
                keyword: 'pension',
                linkId: LinkID 
              });
              sql.connect(config, function (err) {
                console.log('Connected to the database');
                const request = new sql.Request();
                const statuserror500 = "DeleteAccountFailed";
                const messagingSteperror500 = "0";
                const phoneNumbererror500 = sender;
                const textIDATerror500 = textIDAT;
                const updateDelete = `UPDATE two_way_sms_tb SET status = @statuserror500, messagingStep = @messagingSteperror500, isActive = '0'  WHERE phoneNumber = @phoneNumbererror500 AND text_id_AT =@textIDATerror500 AND time = (
                            SELECT MAX(time) FROM two_way_sms_tb WHERE phoneNumber = @phoneNumbererror500 )`;
                request.input('statuserror500', sql.VarChar, statuserror500);
                request.input('messagingSteperror500', sql.VarChar, messagingSteperror500);
                request.input('phoneNumbererror500', sql.NVarChar, phoneNumbererror500);
                request.input('textIDATerror500', sql.NVarChar, textIDATerror500);
                request.query(updateDelete, function (err, results) {
                  if (err) {
                    console.error('Error executing query: ' + err.stack);
                    return;
                  }
                  console.log('Delete Account Attempt unsuccessful');
                  sql.close();
                });
              });
            } else {
              console.log(response.statusCode);
            }
          });
        }
        sql.close();
      });
    });
  });
}

module.exports = { updateNationalID1, updateNationalID2, updatePassword };