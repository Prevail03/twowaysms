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
    request.input('messagingStepReason', sql.NVarChar, messagingStepReason);
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
          console.log(args);
          addNewUserRating.post("https://api.octagonafrica.com/v1/adduserratings", args, function (data, response) {
            console.log(response.statusCode);
            if ([200].includes(response.statusCode)) {
              console.log(response.statusCode);
              sql.connect(config, function (err) {
                if (err) {
                  console.error('Error connecting to the database: ' + err.stack);
                  return;
                }
                console.log('Connected to the database');
                const request = new sql.Request();
                const updateAccounts = `UPDATE two_way_sms_tb SET status = 'isRating', messagingStep= '100', isActive= '100' WHERE phoneNumber = @phoneNumberReason AND text_id_AT = @textIDAT AND time = (SELECT MAX(time) FROM two_way_sms_tb WHERE phoneNumber = @phoneNumberReason)`;
                request.input('phoneNumberReason', sql.NVarChar, phoneNumberReason);
                request.input('textIDAT', sql.NVarChar, textIDAT);
                request.query(updateAccounts, function (err, results) {
                  if (err) {
                    console.error('Error executing query: ' + err.stack);
                    sql.close();
                    return;
                  }
                  sms.sendPremium(rate.successmessage(sender,LinkID));
                  console.log('Ratings UPDATE successful');
                  sql.close(); 
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
              const statuserror404 = "AddUserRatingsError";
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
                const statuserror500 = "AddUserRatingsE";
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
                  console.log(' Add user Ratings Attempt unsuccessful');
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