function updateAmount(statusAmount ,phoneNumberAmount, textAmount, textIDATAmount, config, sms, sender, textIDAT, LinkID){
  const messagingStepAmount = "6";
  sql.connect(config, function (err) {
    const request = new sql.Request();
    const updateReset = `UPDATE two_way_sms_tb SET status = @statusAmount, messagingStep = @messagingStepAmount, amount = @textAmount  WHERE phoneNumber = @phoneNumberAmount AND text_id_AT = @textIDATAmount AND time = (
                SELECT MAX(time) FROM two_way_sms_tb WHERE phoneNumber = @phoneNumberAmount )`;
    request.input('statusAmount', sql.VarChar, statusAmount);
    request.input('messagingStepAmount', sql.VarChar, messagingStepAmount);
    request.input('phoneNumberAmount', sql.NVarChar, phoneNumberAmount);
    request.input('textIDATAmount', sql.NVarChar, textIDATAmount);
    request.input('textAmount', sql.NVarChar, textAmount);
    request.query(updateReset, function (err, results) {
      if (err) {
        console.error('Error executing query: ' + err.stack);
        return;
      }
      console.log('OTP UPDATE successful');
      const status = "isMakingClaim";
      const phoneNumber = phoneNumberAmount;
      const textIDAT = textIDATAmount; 
      // Bind the values to the parameters
      request.input('status', sql.NVarChar(50), status);
      request.input('phoneNumber', sql.NVarChar(50), phoneNumber);
      request.input('textIDAT', sql.VarChar(100), textIDAT);
      request.query("SELECT TOP 1 * FROM two_way_sms_tb WHERE phoneNumber = @phoneNumber AND status = @status AND isActive = 1 AND text_id_AT = @textIDAT order by time DESC", function (err, sendClaimDataResults) {
        if (err) {
          console.error('Error executing query: ' + err.stack);
          return;
        }
        if (sendClaimDataResults.recordset.length > 0) {
          const description = sendClaimDataResults.recordset[0].description;
          const parts = description.split(":");
          const memberNumber = parts[1];
          console.log("Member Details:", memberNumber);
          const memberSchemeCode = sendClaimDataResults.recordset[0].memberSchemeSchemeCode;
          const reasonForExit = sendClaimDataResults.recordset[0].reasonforExit;
          const amount = sendClaimDataResults.recordset[0].amount;
          const dateOfExit = sendClaimDataResults.recordset[0].dateOfExit;
          var addnewclaim = new Client();
          var args = {// set content-type header and data as json in args parameter
            data: { memberNo: memberNumber, memberSchemeCode : memberSchemeCode, reasonforExit: reasonForExit, amount: amount, dateOfExit : dateOfExit },
            headers: { "Content-Type": "application/json" }
          };
          addnewclaim.post("https://api.octagonafrica.com/v1/claims/addnewclaim", args, function (data, response) {
            // parsed response body as js object
            console.log(data);
            // raw response
            if ([200].includes(response.statusCode)) {
              console.log(response.statusCode);

              const statusReasons = "isMakingClaim";
              const phoneNumberReasons = phoneNumberAmount;
              const messagingStepReasons = "100"; 
              sql.connect(config, function (err) {
                if (err) {
                  console.error('Error connecting to the database: ' + err.stack);
                  return;
                }
                console.log('Connected to the database');             
                const request = new sql.Request();                         
                // Update the "two_way_sms_tb" table with the reasons string
                const updateReasons = `UPDATE two_way_sms_tb SET status = @statusReasons, messagingStep = @messagingStepReasons isActive = 0 WHERE phoneNumber = @phoneNumberReasons AND time = (
                  SELECT MAX(time) FROM two_way_sms_tb WHERE phoneNumber = @phoneNumberReasons)`;
                request.input('statusReasons', sql.VarChar, statusReasons);
                request.input('messagingStepReasons', sql.VarChar, messagingStepReasons);
                request.input('phoneNumberReasons', sql.NVarChar, phoneNumberReasons);
                request.query(updateReasons, function (err, results) {
                  if (err) {
                    console.error('Error executing updateReasons query: ' + err.stack);
                    sql.close();
                    return;
                  }          
                  sms.sendPremium({
                    to: sender,
                    from: '24123',
                    message: "Hello esteemed customer, \n Your claim was successfully made. Please hold on as its proccesed. In case of any questions please feel free to reach out to us via support@octagonafrica.com",
                    bulkSMSMode: 0,
                    keyword: 'pension',
                    linkId: LinkID
                  });
                  console.log('Claim made successfully');
                  sql.close();
                });
              }); 

            } else if ([404].includes(response.statusCode)) {
              console.log(response.statusCode);
              sms.sendPremium({ 
                to: sender, 
                from: '24123', 
                message: " Invalid Details! Check your details and please try again Later ",
                bulkSMSMode: 0,
                keyword: 'pension',
                linkId: LinkID
              });
              sql.connect(config, function (err) {
                const request = new sql.Request();
                const statuserror404 = "isMakingClaim404";
                const messagingSteperror404 = "0";
                const phoneNumbererror404 = phoneNumberAmount;
                const textIDATerror404 = textIDAT;
                const updateDelete = `UPDATE two_way_sms_tb SET status = @statuserror404, messagingStep = @messagingSteperror404,  isActive = '0'  WHERE phoneNumber = @phoneNumbererror404 AND text_id_AT =@textIDATerror404 AND time = (
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
                  console.log('Reset Password Attempt unsuccessful');
                  sql.close();
                });
              });
              
            } else if ([402].includes(response.statusCode)) {
              console.log(response.statusCode);
              sms.sendPremium({ 
                to: sender, 
                from: '24123', 
                message: "Failed to copy files from server. Please contact your scheme administrator or support at support@octagonafrica.com or call 0709 986000",
                bulkSMSMode: 0,
                keyword: 'pension',
                linkId: LinkID
              });
              sql.connect(config, function (err) {
                const request = new sql.Request();
                const statuserror404 = "isMakingClaim402";
                const messagingSteperror404 = "0";
                const phoneNumbererror404 = phoneNumberAmount;
                const textIDATerror404 = textIDAT;
                const updateDelete = `UPDATE two_way_sms_tb SET status = @statuserror404, messagingStep = @messagingSteperror404,  isActive = '0'  WHERE phoneNumber = @phoneNumbererror404 AND text_id_AT =@textIDATerror404 AND time = (
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
                  console.log('Reset Password Attempt unsuccessful');
                  sql.close();
                });
              });
            } else if ([403].includes(response.statusCode)) {
              console.log(response.statusCode);
              sms.sendPremium({ 
                to: sender, 
                from: '24123', 
                message: "Your details have not been approved your scheme HR details please contact them. Please contact your scheme Hr or support at support@octagonafrica.com or call 0709 986000",
                bulkSMSMode: 0,
                keyword: 'pension',
                linkId: LinkID
              });
              sql.connect(config, function (err) {
                const request = new sql.Request();
                const statuserror404 = "isMakingClaim403";
                const messagingSteperror404 = "0";
                const phoneNumbererror404 = phoneNumberAmount;
                const textIDATerror404 = textIDAT;
                const updateDelete = `UPDATE two_way_sms_tb SET status = @statuserror404, messagingStep = @messagingSteperror404,  isActive = '0'  WHERE phoneNumber = @phoneNumbererror404 AND text_id_AT =@textIDATerror404 AND time = (
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
                  console.log('Reset Password Attempt unsuccessful');
                  sql.close();
                });
              });
            } else if ([202].includes(response.statusCode)) {
              console.log(response.statusCode);
              sms.sendPremium({ 
                to: sender, 
                from: '24123', 
                message: "Dear estemeed customer,\nAn email with a link to update your details has been sent to your email. Please update your details to process your claim. In case of any questions, please feel free to reach out to us via support@octagonafrica.com or 0709 986000",
                bulkSMSMode: 0,
                keyword: 'pension',
                linkId: LinkID
              });
              sql.connect(config, function (err) {
                const request = new sql.Request();
                const statuserror404 = "isMakingClaim202";
                const messagingSteperror404 = "0";
                const phoneNumbererror404 = phoneNumberAmount;
                const textIDATerror404 = textIDAT;
                const updateDelete = `UPDATE two_way_sms_tb SET status = @statuserror404, messagingStep = @messagingSteperror404,  isActive = '0'  WHERE phoneNumber = @phoneNumbererror404 AND text_id_AT =@textIDATerror404 AND time = (
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
                  console.log('Reset Password Attempt unsuccessful');
                  sql.close();
                });
              });
            } else if ([405].includes(response.statusCode)) {
              console.log(response.statusCode);
              sms.sendPremium({ 
                to: sender, 
                from: '24123', 
                message: "Email was not sent. Please try again later or contact us at support@octagonafrica.com or 0709986000",
                bulkSMSMode: 0,
                keyword: 'pension',
                linkId: LinkID
              });
              sql.connect(config, function (err) {
                const request = new sql.Request();
                const statuserror404 = "isMakingClaim405";
                const messagingSteperror404 = "0";
                const phoneNumbererror404 = phoneNumberAmount;
                const textIDATerror404 = textIDAT;
                const updateDelete = `UPDATE two_way_sms_tb SET status = @statuserror404, messagingStep = @messagingSteperror404,  isActive = '0'  WHERE phoneNumber = @phoneNumbererror404 AND text_id_AT =@textIDATerror404 AND time = (
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
                  console.log('Reset Password Attempt unsuccessful');
                  sql.close();
                });
              });
            } else if ([401].includes(response.statusCode)) {
              console.log(response.statusCode);
              sms.sendPremium({ 
                to: sender, 
                from: '24123', 
                message: "Invalid response received. Please contact your administrator or support at support@octagonafrica.com or call 0709 986000",
                bulkSMSMode: 0,
                keyword: 'pension',
                linkId: LinkID
              });
              sql.connect(config, function (err) {
                const request = new sql.Request();
                const statuserror404 = "isMakingClaim401";
                const messagingSteperror404 = "0";
                const phoneNumbererror404 = phoneNumberAmount;
                const textIDATerror404 = textIDAT;
                const updateDelete = `UPDATE two_way_sms_tb SET status = @statuserror404, messagingStep = @messagingSteperror404,  isActive = '0'  WHERE phoneNumber = @phoneNumbererror404 AND text_id_AT =@textIDATerror404 AND time = (
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
                  console.log('Reset Password Attempt unsuccessful');
                  sql.close();
                });
              });
            } else if ([406].includes(response.statusCode)) {
              console.log(response.statusCode);
              sms.sendPremium({ 
                to: sender, 
                from: '24123', 
                message: "Member Number Not Found/Invalid. Please contact your administrator or support at support@octagonafrica.com or call 0709 986000",
                bulkSMSMode: 0,
                keyword: 'pension',
                linkId: LinkID
              });
              sql.connect(config, function (err) {
                const request = new sql.Request();
                const statuserror404 = "isMakingClaim406";
                const messagingSteperror404 = "0";
                const phoneNumbererror404 = phoneNumberAmount;
                const textIDATerror404 = textIDAT;
                const updateDelete = `UPDATE two_way_sms_tb SET status = @statuserror404, messagingStep = @messagingSteperror404,  isActive = '0'  WHERE phoneNumber = @phoneNumbererror404 AND text_id_AT =@textIDATerror404 AND time = (
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
                  console.log('Reset Password Attempt unsuccessful');
                  sql.close();
                });
              });
            } else if ([400].includes(response.statusCode)) {
              console.log(response.statusCode);
              sms.sendPremium({ 
                to: sender, 
                from: '24123', 
                message: "Claim was not Made Please try again later. Check your details and please try again Later ",
                bulkSMSMode: 0,
                keyword: 'pension',
                linkId: LinkID
              });
              sql.connect(config, function (err) {
                const request = new sql.Request();
                const statuserror404 = "isMakingClaim400";
                const messagingSteperror404 = "0";
                const phoneNumbererror404 = phoneNumberAmount;
                const textIDATerror404 = textIDAT;
                const updateDelete = `UPDATE two_way_sms_tb SET status = @statuserror404, messagingStep = @messagingSteperror404,  isActive = '0'  WHERE phoneNumber = @phoneNumbererror404 AND text_id_AT =@textIDATerror404 AND time = (
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
                  console.log('Reset Password Attempt unsuccessful');
                  sql.close();
                });
              });
            }else if ([500].includes(response.statusCode)) {
              console.log(response.statusCode);
              sms.sendPremium({ 
                to: sender, 
                from: '24123', 
                message: " Invalid request. Invalid Details!!. Check your details and please try again Later ",
                bulkSMSMode: 0,
                keyword: 'pension',
                linkId: LinkID
              });
              sql.connect(config, function (err) {
                const request = new sql.Request();
                const statuserror500 = "isMakingClaim500";
                const messagingSteperror500 = "0";
                const phoneNumbererror500 = phoneNumberAmount;
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
                  console.log('Reset Password Attempt unsuccessful');
                  sql.close();
                });
              });
            } else {
              // error code
              console.log(response.statusCode);
              sms.sendPremium({ 
                to: sender, 
                from: '24123', 
                message: " Invalid request. Invalid Details!!. Check your details and please try again Later ",
                bulkSMSMode: 0,
                keyword: 'pension',
                linkId: LinkID
              });
              
              sql.connect(config, function (err) {
                const request = new sql.Request();
                const statuserror500 = "isMakingClaim";
                const messagingSteperror500 = "404";
                const phoneNumbererror500 = phoneNumberAmount;
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
                  console.log('Reset Password Attempt unsuccessful');
                  sql.close();
                });
              });
            }
          });
        }

      sql.close();
    });
  });
});
}