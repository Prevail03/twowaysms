const sql = require('mssql');
var Client = require('node-rest-client').Client;

function updateRatingValue(statusRateValue, phoneNumberRateValue, messagingRateValue, textRateValue, config, textIDATRateValue) {
  sql.connect(config, function (err) {
    const request = new sql.Request();
    const updateDelete = `UPDATE two_way_sms_tb SET status = @statusRateValue, messagingStep = @messagingRateValue, rateValue = @textRateValue WHERE phoneNumber = @phoneNumberRateValue AND text_id_AT = @textIDATRateValue AND time = (
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
      console.log('Rating Value UPDATE successful');

      sql.close();
    });
  });
}
function updateReason(statusReason, phoneNumberReason, messagingStepReason, textReason, config, textIDATReason, rate) {
  sql.connect(config, function (err) {
    if (err) {
      console.error('Error connecting to the database: ' + err.stack);
      return;
    }
    console.log('Connected to the database');

    const request = new sql.Request();
    const updateAccounts = `UPDATE two_way_sms_tb SET status = @statusReason, messagingStep= @messagingStepReason, ratingReason = @textReason WHERE phoneNumber = @phoneNumberReason AND text_id_AT = @textIDATReason AND time = (SELECT MAX(time) FROM two_way_sms_tb WHERE phoneNumber = @phoneNumberReason)`;
    request.input('phoneNumberReason', sql.NVarChar, phoneNumberReason);
    request.input('textIDATReason', sql.NVarChar, textIDATReason);
    request.input('textReason', sql.NVarChar, textReason);
    request.input('statusReason', sql.NVarChar, statusReason);
    request.input('statusReason', sql.NVarChar, statusReason);
    request.query(updateAccounts, function (err, results) {
      if (err) {
        console.error('Error executing query: ' + err.stack);
        sql.close();
        return;
      }
      console.log('Rating Reason UPDATE successful');
      const statusReason1 = "isRating";
      const phoneNumberReason = sender;
      const textIDAT = textIDATReason;
      // Bind the values to the parameters
      const request = new sql.Request();
      request.input('statusReason1', sql.NVarChar(50), statusReason1);
      request.input('phoneNumberReason', sql.NVarChar(50), phoneNumberReason);
      request.input('textIDAT', sql.NVarChar(50), textIDAT);
      request.query("SELECT TOP 1 * FROM two_way_sms_tb WHERE phoneNumber = @phoneNumberReason AND status = @statusReason1 AND isActive = 1 AND text_id_AT = @textIDAT order by time DESC", function (err, ratingResults) {
        if (err) {
          console.error('Error executing query: ' + err.stack);
          return;
        }

        if (ratingResults.recordset.length > 0) {
          const ratingValue = ratingResults.recordset[0].ratingValue;
          const ratingReason = ratingResults.recordset[0].ratingReason;
          
          var addNewUserRating = new Client();
          // set content-type header and data as json in args parameter
          var args = {
            data: { identifier: phoneNumberReason, ratingReason: ratingReason, ratingValue: ratingValue},
            headers: { "Content-Type": "application/json" }
          };
          console.log(args)
          addNewUserRating.post("https://api.octagonafrica.com/v1/adduserratings", args, function (data, response) {
            if ([200].includes(response.statusCode)) {
              const periodID = data.data;
              console.log(periodID);
              console.log(response.statusCode);
              const phoneNumberperiodID = sender;
              const textperiodID = periodID;
              const textIDATperiodID = textIDAT;

              sql.connect(config, function (err) {
                if (err) {
                  console.error('Error connecting to the database: ' + err.stack);
                  return;
                }

                console.log('Connected to the database');
                const request = new sql.Request();
                const updateAccounts = `UPDATE two_way_sms_tb SET status = 'isCheckingAccount', messagingStep= '5', periodID = @textperiodID WHERE phoneNumber = @phoneNumberperiodID AND text_id_AT = @textIDATperiodID AND time = (SELECT MAX(time) FROM two_way_sms_tb WHERE phoneNumber = @phoneNumberperiodID)`;

                request.input('phoneNumberperiodID', sql.NVarChar, phoneNumberperiodID);
                request.input('textIDATperiodID', sql.NVarChar, textIDATperiodID);
                request.input('textperiodID', sql.NVarChar, textperiodID);

                request.query(updateAccounts, function (err, results) {
                  if (err) {
                    console.error('Error executing query: ' + err.stack);
                    sql.close();
                    return;
                  }

                  console.log('periodID UPDATE successful');

                  const statusperiodID = "isCheckingAccount";
                  const phoneNumberperiodID = sender;
                  const textIDATperiodID1 = textIDAT;

                  const request2 = new sql.Request();
                  request2.input('statusperiodID', sql.NVarChar(50), statusperiodID);
                  request2.input('phoneNumberperiodID', sql.NVarChar(50), phoneNumberperiodID);
                  request2.input('textIDATperiodID1', sql.NVarChar(50), textIDATperiodID1);

                  request2.query("SELECT TOP 1 * FROM two_way_sms_tb WHERE phoneNumber = @phoneNumberperiodID AND status = @statusperiodID AND isActive = 1 AND text_id_AT = @textIDATperiodID1 order by time DESC", function (err, periodIDResults) {
                    if (err) {
                      console.error('Error executing query: ' + err.stack);
                      sql.close();
                      return;
                    }

                    if (periodIDResults.recordset.length > 0) {
                      const periodID = periodIDResults.recordset[0].periodID;
                      const periodName = periodNameResults.recordset[0].periodname;
                      let memberID = periodNameResults.recordset[0].memberID;

                      memberID = memberID.replace(/^\d+\.\s*/, '');
                      memberID = memberID.replace(/\s/g, '');
                      const member_id = memberID;
                      console.log('Member ID: ' + memberID);

                      const request3 = new sql.Request();
                      request3.input('member_id', sql.Int(13), member_id);
                      request3.query("SELECT TOP 1 * FROM members_tb where m_id = @member_id ", function (err, statementResults) {
                        if (err) {
                          console.error('Error executing query: ' + err.stack);
                          sql.close();
                          return;
                        }

                        if (statementResults.recordset.length > 0) {
                          const scheme_code = statementResults.recordset[0].m_scheme_code;
                          const member_email = statementResults.recordset[0].m_email;
                          const member_name = statementResults.recordset[0].m_name;
                          const member_number = statementResults.recordset[0].m_number;

                          var fetchMemberStatements = new Client();
                          // set content-type header and data as json in args parameter
                          var args = {
                            data: { period_id: periodID, member_number: member_number, scheme_code: scheme_code, email: member_email, name: member_name },
                            headers: { "Content-Type": "application/json" }
                          };
                          console.log(args);
                          fetchMemberStatements.post("https://cloud.octagonafrica.com/opas/commons/tcpdf/examples/memberStatementNew.php", args, function (data, response) {
                            if ([200].includes(response.statusCode)) {
                              console.log(response.statusCode);
                              const statementsData = data.data;
                              const nameFromAPI = member_name;
                              const emailFromAPI = member_email;
                              const periodsNameAPI = periodName;
                              const phoneNumberStatement = sender;
                              const textIDATStatement = textIDAT;
                              sql.connect(config, function (err) {
                                console.log('Connected to the database');
                                const request = new sql.Request();
                                const updateAccounts = `UPDATE two_way_sms_tb SET status = 'isCheckingAccountSuccess', messagingStep= '100', isActive = 100, periodname = @periodsNameAPI, name = @nameFromAPI, email = @emailFromAPI  WHERE phoneNumber = @phoneNumberStatement AND text_id_AT = @textIDATStatement AND time = (SELECT MAX(time) FROM two_way_sms_tb WHERE phoneNumber = @phoneNumberStatement)`;
                                request.input('phoneNumberStatement', sql.NVarChar, phoneNumberStatement);
                                request.input('periodsNameAPI', sql.NVarChar, periodsNameAPI);
                                request.input('emailFromAPI', sql.NVarChar, emailFromAPI);
                                request.input('nameFromAPI', sql.NVarChar, nameFromAPI);
                                request.input('textIDATStatement', sql.NVarChar, textIDATStatement);
                                request.query(updateAccounts, function (err, results) {
                                  if (err) {
                                    console.error('Error executing query: ' + err.stack);
                                    sql.close();
                                    return;
                                  }
                                  console.log('Member Statement details UPDATE successful');
                                  const statusMemberStatement = "isCheckingAccountSuccess";
                                  const phoneNumberStatement = sender;
                                  const textIDATMemberStatement = textIDAT;
                                  // Bind the values to the parameters
                                  const request = new sql.Request();
                                  request.input('statusMemberStatement', sql.NVarChar(50), statusMemberStatement);
                                  request.input('phoneNumberStatement', sql.NVarChar(50), phoneNumberStatement);
                                  request.input('textIDATMemberStatement', sql.NVarChar(50), textIDATMemberStatement);
                                  request.query("SELECT TOP 1 * FROM two_way_sms_tb WHERE phoneNumber = @phoneNumberStatement AND status = @statusMemberStatement AND isActive = 100 AND text_id_AT = @textIDATMemberStatement order by time DESC", function (err, memberStatementResults) {
                                    if (err) {
                                      console.error('Error executing query: ' + err.stack);
                                      return;
                                    }

                                    if (memberStatementResults.recordset.length > 0) {
                                      const name = memberStatementResults.recordset[0].name.trim();
                                      const email = memberStatementResults.recordset[0].email;
                                      const periodsName = memberStatementResults.recordset[0].periodname;
                                      console.log("Dear " + name + ".Your member statement for " + periodsName + " period has been sent to  " + email);
                                      sms.sendPremium({
                                        to: sender,
                                        from: '24123',
                                        message: "Dear " + name + ". Your member statement for " + periodsName + " period has been sent to  " + email + ". Incase of any queries contact us at support@octagonafrica.com or 0709 986 000 ",
                                        bulkSMSMode: 0,
                                        keyword: 'pension',
                                        linkId: LinkID
                                      });
                                    }
                                    sql.close();
                                  });
                                });
                              });
                            } else if ([400].includes(response.statusCode)) {
                              console.log(response.statusCode);
                              sms.sendPremium({
                                to: sender,
                                from: '24123',
                                message: 'Invalid Details. Try again later',
                                bulkSMSMode: 0,
                                keyword: 'pension',
                                linkId: LinkID
                              });
                              sql.connect(config, function (err) {
                                console.log('Connected to the database');
                                const request = new sql.Request();
                                const statuserror404 = "FetchMemberStatementFailed";
                                const messagingSteperror404 = "0";
                                const phoneNumbererror404 = sender;
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
                                  console.log('Fetch Member Statemement Attempt unsuccessful');
                                  sql.close();
                                });
                              });
                            } else if ([500].includes(response.statusCode)) {
                              console.log(response.statusCode);
                              sms.sendPremium({
                                to: sender,
                                from: '24123',
                                message: 'Internal Server Error',
                                bulkSMSMode: 0,
                                keyword: 'pension',
                                linkId: LinkID
                              });
                              sql.connect(config, function (err) {
                                console.log('Connected to the database');
                                const request = new sql.Request();
                                const statuserror500 = "FetchMemberFailed";
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
                                  console.log('Fetch Member statement Attempt unsuccessful');
                                  sql.close();
                                });
                              });
                            } else {
                              console.log(response.statusCode);
                            }
                          });
                        }

                        sql.close(); // Close connection after executing all queries
                      });
                    } else {
                      sql.close(); // Close connection if no periodID results
                    }
                  });
                });
              });

            } else if ([400].includes(response.statusCode)) {
              console.log(response.statusCode);
              sms.sendPremium({
                to: sender,
                from: '24123',
                message: 'Invalid Details. Try again later',
                bulkSMSMode: 0,
                keyword: 'pension',
                linkId: LinkID
              });
              const statuserror404 = "FetchPeriodsIDFailed";
              const messagingSteperror404 = "0";
              const phoneNumbererror404 = sender;
              const textIDATerror404 = textIDAT;
              sql.connect(config, function (err) {
                console.log('Connected to the database');
                const request = new sql.Request();
                const updateDelete = `UPDATE two_way_sms_tb SET status = @statuserror404, messagingStep = @messagingSteperror404, isActive = '0' WHERE phoneNumber = @phoneNumbererror404 AND text_id_AT =@textIDATerror404 AND time = (
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
                  console.log(' FetchPeriodsID Attempt unsuccessful');
                  sql.close();
                });
              });
            } else if ([500].includes(response.statusCode)) {
              console.log(response.statusCode);
              sms.sendPremium({
                to: sender,
                from: '24123',
                message: 'Internal Server Error',
                bulkSMSMode: 0,
                keyword: 'pension',
                linkId: LinkID
              });
              sql.connect(config, function (err) {
                console.log('Connected to the database');
                const request = new sql.Request();
                const statuserror500 = "FetchPeriodsIDFailed";
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
                  console.log(' Fetch Periods ID Attempt unsuccessful');
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

module.exports = {updateRatingValue};