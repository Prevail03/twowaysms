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

function  updateLastname(sender, statusLname, phoneNumberLname, messagingStepLname, textLname, config, textIDATLname, textIDAT, sms, LinkID){
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

function  updateEmail(sender, statusEmail, phoneNumberEmail, messagingStepEmail, textEmail, config, textIDATEmail, textIDAT, sms, LinkID){
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
      console.log('Email UPDATE successful');
      sql.close();
    });
  });
}

function  updateNationalID(sender, statusNationalID, phoneNumberNationalID, messagingStepNationalID, textNationalID, config, textIDATNationalID, textIDAT, sms, LinkID){
  sql.connect(config, function (err) {
    const request = new sql.Request();
    const updateProductsAndServices = `UPDATE two_way_sms_tb SET status = @statusNationalID, messagingStep = @messagingStepNationalID, national_ID = @textNationalID WHERE phoneNumber = @phoneNumberNationalID AND text_id_AT = @textIDATNationalID AND time = (
  SELECT MAX(time) FROM two_way_sms_tb WHERE phoneNumber = @phoneNumberNationalID )`;
    request.input('statusNationalID', sql.VarChar, statusNationalID);
    request.input('messagingStepNationalID', sql.VarChar, messagingStepNationalID);
    request.input('phoneNumberNationalID', sql.NVarChar, phoneNumberNationalID);
    request.input('textNationalID', sql.VarChar, textNationalID);
    request.input('textIDATNationalID', sql.NVarChar, textIDATNationalID);
    request.query(updateProductsAndServices, function (err, results) {
      if (err) {
        console.error('Error executing query: ' + err.stack);
        return;
      }
      console.log('National ID UPDATE successful');
      sql.close();
    });
  });
}

function  updateMethodOfPayment(sender, statusMethodOfPayment, phoneNumberMethodOfPayment, messagingStepMethodOfPayment, textMethodOfPayment, config, textIDATMethodOfPayment, textIDAT, sms, LinkID){
  sql.connect(config, function (err) {
    const request = new sql.Request();
    const updateProductsAndServices = `UPDATE two_way_sms_tb SET status = @statusMethodOfPayment, messagingStep = @messagingStepMethodOfPayment, methodOfPayment = @textMethodOfPayment WHERE phoneNumber = @phoneNumberMethodOfPayment AND text_id_AT = @textIDATMethodOfPayment AND time = (
  SELECT MAX(time) FROM two_way_sms_tb WHERE phoneNumber = @phoneNumberMethodOfPayment )`;
    request.input('statusMethodOfPayment', sql.VarChar, statusMethodOfPayment);
    request.input('messagingStepMethodOfPayment', sql.VarChar, messagingStepMethodOfPayment);
    request.input('phoneNumberMethodOfPayment', sql.NVarChar, phoneNumberMethodOfPayment);
    request.input('textMethodOfPayment', sql.VarChar, textMethodOfPayment);
    request.input('textIDATMethodOfPayment', sql.NVarChar, textIDATMethodOfPayment);
    request.query(updateProductsAndServices, function (err, results) {
      if (err) {
        console.error('Error executing query: ' + err.stack);
        return;
      }
      console.log('National ID UPDATE successful');
      sql.close();
    });
  });
}

function  updateModeOfPayment(sender, statusModeOfPayment, phoneNumberModeOfPayment, messagingStepModeOfPayment, textModeOfPayment, config, textIDATModeOfPayment, textIDAT, sms, LinkID){
  sql.connect(config, function (err) {
    const request = new sql.Request();
    const updateProductsAndServices = `UPDATE two_way_sms_tb SET status = @statusModeOfPayment, messagingStep = @messagingStepModeOfPayment, modeOfPayment = @textModeOfPayment WHERE phoneNumber = @phoneNumberModeOfPayment AND text_id_AT = @textIDATModeOfPayment AND time = (
  SELECT MAX(time) FROM two_way_sms_tb WHERE phoneNumber = @phoneNumberModeOfPayment )`;
    request.input('statusModeOfPayment', sql.VarChar, statusModeOfPayment);
    request.input('messagingStepModeOfPayment', sql.VarChar, messagingStepModeOfPayment);
    request.input('phoneNumberModeOfPayment', sql.NVarChar, phoneNumberModeOfPayment);
    request.input('textModeOfPayment', sql.VarChar, textModeOfPayment);
    request.input('textIDATModeOfPayment', sql.NVarChar, textIDATModeOfPayment);
    request.query(updateProductsAndServices, function (err, results) {
      if (err) {
        console.error('Error executing query: ' + err.stack);
        return;
      }
      console.log('Mode Of Payment UPDATE successful');
      sql.close();
    });
  });
}

function updateAmount(sender, statusAmount, phoneNumberAmount, messagingStepAmount, textAmount, config, textIDATAmount, textIDAT, sms, LinkID) {
  sql.connect(config, function (err) {
    if (err) {
      console.error('Error connecting to the database: ' + err.stack);
      return;
    }
    console.log('Connected to the database');

    const request = new sql.Request();
    const updateAccounts1 = `UPDATE two_way_sms_tb SET status = @statusAmount, messagingStep= @messagingStepAmount, amount = @textAmount WHERE phoneNumber = @phoneNumberAmount AND text_id_AT = @textIDATAmount AND time = (SELECT MAX(time) FROM two_way_sms_tb WHERE phoneNumber = @phoneNumberAmount)`;
    request.input('phoneNumberAmount', sql.NVarChar, phoneNumberAmount);
    request.input('textIDATAmount', sql.NVarChar, textIDATAmount);
    request.input('textAmount', sql.NVarChar, textAmount);
    request.input('statusAmount', sql.NVarChar, statusAmount);
    request.input('messagingStepAmount', sql.NVarChar, messagingStepAmount);
    request.query(updateAccounts1, function (err, results) {
      if (err) {
        console.error('Error executing query: ' + err.stack);
        sql.close();
        return;
      }
      console.log('Rating Reason UPDATE successful');
      const statusServices = "isProducts";
      const phoneNumberAmount = sender;
      const textIDAT = textIDATAmount;
      // Bind the values to the parameters
      const request = new sql.Request();
      request.input('statusServices', sql.NVarChar(50), statusServices);
      request.input('phoneNumberAmount', sql.NVarChar(50), phoneNumberAmount);
      request.input('textIDAT', sql.NVarChar(50), textIDAT);
      request.query("SELECT TOP 1 * FROM two_way_sms_tb WHERE phoneNumber = @phoneNumberAmount AND status = @statusServices AND isActive = 1 AND text_id_AT = @textIDAT order by time DESC", function (err, productsResults) {
        if (err) {
          console.error('Error executing query: ' + err.stack);
          return;
        }

        if (productsResults.recordset.length > 0) {
          const product = productsResults.recordset[0].product;
          const productDescription = productsResults.recordset[0].productDescription; 
          const firstname = productsResults.recordset[0].firstname;
          const lastname = productsResults.recordset[0].lastname;
          const email = productsResults.recordset[0].email;
          const national_ID = productsResults.recordset[0].national_ID;
          
          
          var addNewUserRating = new Client();
          // set content-type header and data as json in args parameter
          var args = {
            data: { identifier: phoneNumberAmount, ratingReason: ratingReason, ratingValue: ratingValue},
            headers: { "Content-Type": "application/json" }
          };
          console.log(args);
          addNewUserRating.post("https://api.octagonafrica.com/v1/user/adduserratings", args, function (data, response) {
            if ([200].includes(response.statusCode)) {
              console.log(response.statusCode);
              sql.connect(config, function (err) {
                if (err) {
                  console.error('Error connecting to the database: ' + err.stack);
                  return;
                }
                console.log('Connected to the database');
                const request = new sql.Request();
                const updateAccounts = `UPDATE two_way_sms_tb SET status = 'isRating', messagingStep= '100', isActive= '100' WHERE phoneNumber = @phoneNumberAmount AND text_id_AT = @textIDAT AND time = (SELECT MAX(time) FROM two_way_sms_tb WHERE phoneNumber = @phoneNumberAmount)`;
                request.input('phoneNumberAmount', sql.NVarChar, phoneNumberAmount);
                request.input('textIDAT', sql.NVarChar, textIDAT);
                request.query(updateAccounts, function (err, results) {
                  if (err) {
                    console.error('Error executing query: ' + err.stack);
                    sql.close();
                    return;
                  }
                  
                  console.log('Ratings UPDATE successful');
                  sql.close(); 
                });
              });
            } else if ([400].includes(response.statusCode)) {
              console.log(response.statusCode);
              sms.sendPremium({
                to: sender,
                from: '24123',
                message: 'Invalid Details. Check your data and try again later',
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
                  console.log(' Add user Ratings Attempt unsuccessful');
                  sql.close();
                  process.exit();
                });
              });
            } else if ([403].includes(response.statusCode)) {
              console.log(response.statusCode);
              sms.sendPremium({
                to: sender,
                from: '24123',
                message: 'Invalid Details. Internal Server Error',
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
                  console.log(' Add user Ratings Attempt unsuccessful. Insert Failed');
                  sql.close();
                  process.exit();
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
                  console.log('Add user Ratings Attempt unsuccessful');
                  sql.close();
                  process.exit();
                });
              });
            } else {
              console.log(response.statusCode);
              process.exit();
            }
          });
        }
        sql.close();
      });
    });
  });
}

module.exports = {updatePensionMessagingStep, updateProductDescription, updateFname, updateLastname, updateEmail, updateNationalID, updateMethodOfPayment, updateModeOfPayment};