const sql = require('mssql');
const {updatePassword,updateDescription}= require('./Database/claimsDB');
function  handleClaims(textMessage, sender, messagingStep, sms,  config, textIDAT, LinkID, claims){
  switch (parseInt(messagingStep)) {
  //1.enter Password
  //2 - enter member number
  //3 - enter OTP
  //4 - enter reasons for exit select 
  //5 - enter date of exit
  //6 - enter claim amount
    case 1:
      const phoneNumberPassword = sender;
      const textPassword = textMessage;
      const textIDATPassword = textIDAT;
      updatePassword(phoneNumberPassword, textPassword, textIDATPassword, sender, config, textIDAT, sms, LinkID);
    break;
    case 2:
      const phoneNumberDescription = sender;
      const accountDescription = textMessage;
      const textIDATDescription = textIDAT;
      let textDescription = "";
      sql.connect(config, function(err, connection) {
      if (err) {
          console.error('Error connecting to database: ' + err.stack);
          return;
      }
      console.log('Connected to database');

      const checkIfExistsQuery = "SELECT TOP 1 * FROM two_way_sms_tb WHERE phoneNumber = @phoneNumberDescription AND isActive = 1 AND status = 'isMakingClaims' AND time = (SELECT MAX(time) FROM two_way_sms_tb WHERE phoneNumber = @phoneNumberDescription)";
      const checkIfExistsRequest = new sql.Request(connection);
      checkIfExistsRequest.input('phoneNumberDescription', sql.VarChar, phoneNumberDescription);
      checkIfExistsRequest.query(checkIfExistsQuery, function(checkErr, checkResults) {
          if (checkErr) {
          console.error('Error executing checkIfExistsQuery: ' + checkErr.stack);
          connection.close();
          return;
          }
          if (checkResults.recordset.length > 0) {
              const allAccounts = checkResults.recordset[0].allAccounts;
              const accountsArray = allAccounts.split(',')
                  .map(account => account.trim().replace(/^\d+\.\s*/, ''))
                  .filter(account => account !== '');

              console.log("Array count:", accountsArray.length);
              if (accountDescription >= 1 && accountDescription <= accountsArray.length) {
                  const selectedAccount = accountsArray[accountDescription - 1];
                  console.log("Selected account:", selectedAccount);
                  textDescription = selectedAccount;
                  console.log("Account Description: " + textDescription);
                  updateDescription(phoneNumberDescription, textDescription, textIDATDescription, sender, config, textIDAT, sms, account, LinkID);
              } else {
                  console.log("Invalid account description");
                  sms.sendPremium(claims.invalidResponse(sender, LinkID));
              }
          } else {
          console.log('Record does not exist');
          }
      });
      });
    break;
    case 3:

    break;

  
  } 

 }
 module.exports = handleClaims;