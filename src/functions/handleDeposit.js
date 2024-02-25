const sql = require('mssql');
var Client = require('node-rest-client').Client;

const {updatePassword, updateDescription, updateAmount} = require('./Database/depositDB');
function handleDeposit(textMessage, sender, messagingStep, sms, config, textIDAT, LinkID, deposit, account){
  switch (parseInt(messagingStep)) {
    case 1:
      const phoneNumberPassword = sender;
      const textPassword = textMessage;
      const textIDATPassword = textIDAT;
      updatePassword(phoneNumberPassword, textPassword, textIDATPassword, sender, config, textIDAT, sms, deposit, LinkID);
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
      const checkIfExistsQuery = "SELECT TOP 1 * FROM two_way_sms_tb WHERE phoneNumber = @phoneNumberDescription AND isActive = 1 AND status = 'isDeposit' AND time = (SELECT MAX(time) FROM two_way_sms_tb WHERE phoneNumber = @phoneNumberDescription)";
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
              const allMemberIDs = checkResults.recordset[0].allMemberIDs;
              const accountsArray = allAccounts.split(',')
                  .map(account => account.trim().replace(/^\d+\.\s*/, ''))
                  .filter(account => account !== '');

              const memberIDsArray = allMemberIDs.split(',')
                  .map(memberID => memberID.trim())
                  .filter(memberID => memberID !== '');

              console.log("Array count:", accountsArray.length);

              if (accountDescription >= 1 && accountDescription <= accountsArray.length) {
                  const selectedAccount = accountsArray[accountDescription - 1];
                  const selectedMemberID = memberIDsArray[accountDescription - 1]; // Get the corresponding memberID

                  console.log("Selected account:", selectedAccount);
                  console.log("Selected memberID:", selectedMemberID);

                  textDescription = selectedAccount;
                  memberID = selectedMemberID;
                  console.log("Account Description: " + textDescription);

                  updateDescription(phoneNumberDescription, textDescription, textIDATDescription, sender, config, textIDAT, sms, deposit, LinkID, memberID); // Pass the selectedMemberID to the function
              } else {
                  console.log("Invalid account description");
                  sms.sendPremium(deposit.invalidResponse(sender, LinkID));
              }

          } else {
          console.log('Record does not exist');
          sms.sendPremium(deposit.invalidResponseSystem(sender, LinkID));
          }
      });
      });
    break;

    case 3:
      const statusAmount = "isDeposit";
      const phoneNumberAmount = sender;
      const messagingStepAmount = "4";
      const textAmount = textMessage;
      const textIDATAmount = textIDAT;
      updateAmount(sender, statusAmount, phoneNumberAmount, messagingStepAmount, textAmount, config, textIDATAmount, textIDAT, sms, LinkID);
    break;
  }
}
module.exports = handleDeposit;