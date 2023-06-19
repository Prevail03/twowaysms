const sql = require('mssql');
const {updatePassword,updateDescription, updateOTP, updateReasonForExit, updateDateOfExit, updateAmount}= require('./Database/claimsDB');
function  handleClaims(textMessage, sender, messagingStep, sms,  config, textIDAT, LinkID, claims,account){
  switch (parseInt(messagingStep)) {
  //1.enter Password
  //2 - enter member number
  //3 - enter OTP
  //4 - enter reasons for exit select 
  //5 - enter date of exit.
  //6 - enter claim amount.
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

        const checkIfExistsQuery = "SELECT TOP 1 * FROM two_way_sms_tb WHERE phoneNumber = @phoneNumberDescription AND isActive = 1 AND status = 'isMakingClaim' AND time = (SELECT MAX(time) FROM two_way_sms_tb WHERE phoneNumber = @phoneNumberDescription)";
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
                updateDescription(phoneNumberDescription, textDescription, textIDATDescription, sender, config, textIDAT, sms, account, LinkID
                );
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
      const statusOTP = "isMakingClaim";
      const phoneNumberOTP = sender;
      const messagingStepOTP = "4";
      const textIDATOTP = textIDAT;
      const textOTP = textMessage;
      updateOTP(statusOTP, phoneNumberOTP, messagingStepOTP, textOTP, textIDATOTP, config, sms, sender, textIDAT, LinkID);
    break;

    case 4:
      const statusReason = "isMakingClaim";
      const phoneNumberReason = sender;
      const reasonID = textMessage;
      const textIDATReason = textIDAT;
      let textReasonForExit = "";
      sql.connect(config, function(err, connection) {
        if (err) {
            console.error('Error connecting to database: ' + err.stack);
            return;
        }
        console.log('Connected to database');
        const checkIfExistsQuery = "SELECT TOP 1 * FROM two_way_sms_tb WHERE phoneNumber = @phoneNumberReason AND isActive = 1 AND status = 'isMakingClaim' AND time = (SELECT MAX(time) FROM two_way_sms_tb WHERE phoneNumber = @phoneNumberReason)";
        const checkIfExistsRequest = new sql.Request(connection);
        checkIfExistsRequest.input('phoneNumberReason', sql.VarChar, phoneNumberReason);
        checkIfExistsRequest.query(checkIfExistsQuery, function(checkErr, checkResults) {
        if (checkErr) {
        console.error('Error executing checkIfExistsQuery: ' + checkErr.stack);
        connection.close();
        return;
        }
        if (checkResults.recordset.length > 0) {
          const allReasons = checkResults.recordset[0].allReasons;
          const reasonsArray = allReasons.split(',')
              .map(reason => reason.trim().replace(/^\d+\.\s*/, ''))
              .filter(reason => reason !== '');
          console.log("Array count:", reasonsArray.length);
          if (reasonID >= 1 && reasonID <= reasonsArray.length) {
            const selectedReason = reasonsArray[reasonID - 1];
            console.log("Selected Reason", selectedReason);
            textReasonForExit = selectedReason;
            console.log("Reason: " + textReasonForExit);
            sms.sendPremium(claims.dateOfExit(sender, LinkID));
            updateReasonForExit(statusReason ,phoneNumberReason, textReasonForExit, textIDATReason, config);
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

    case 5:
      sms.sendPremium(claims.amount(sender, LinkID));
      const statusDate = "isMakingClaim";
      const phoneNumberDate = sender;
      const textIDATDate = textIDAT;
      const textDate = textMessage;
      updateDateOfExit(statusDate ,phoneNumberDate, textDate, textIDATDate, config)
    break;

    case 6:
      const statusAmount = "isMakingClaim";
      const phoneNumberAmount = sender;
      const textIDATAmount = textIDAT;
      const textAmount= textMessage;
      updateAmount(statusAmount ,phoneNumberAmount, textAmount, textIDATAmount, config, sms, sender, textIDAT, LinkID)
    break;
  } 

 }
 module.exports = handleClaims;