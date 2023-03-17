const sql = require('mssql');
var Client = require('node-rest-client').Client;
const httpProxy = require('http-proxy');
const proxy = httpProxy.createProxyServer({});

let user={};
let registrationStep = 0;
function handleRegister(text, sender, messagingStep ,sms, register, config, phoneNumber, textIDAT) {
    console.log(textIDAT);
    switch (parseInt(messagingStep)) {
      case 1:
        
        // Handle step 1 of registration process
        sms.send(register.enterId(sender));
        registrationStep = 2;
        const statusID = "isRegistering";
        const phoneNumberID = phoneNumber;
        const messagingStepID= "2";
        const textID =text;
        const textIDATID = textIDAT;
        sql.connect(config, function(err) {
            const request = new sql.Request();
            const updateRegister1 = `UPDATE two_way_sms_tb SET status = @statusID, messagingStep = @messagingStepID , national_ID = @textID WHERE phoneNumber = @phoneNumberID AND text_id_AT = @textIDATID  AND time = (
                SELECT MAX(time) FROM two_way_sms_tb WHERE phoneNumber = @phoneNumberID )`;
            request.input('statusID', sql.VarChar, statusID);
            request.input('messagingStepID', sql.VarChar, messagingStepID);
            request.input('phoneNumberID', sql.VarChar, phoneNumberID);
            request.input('textID', sql.VarChar, textID);
            request.input('textIDATID', sql.VarChar, textIDATID);
            request.query(updateRegister1, function(err, results) {
            if (err) {
                console.error('Error executing query: ' + err.stack);
                return;
            }
            console.log('ID UPDATE successful');
            sql.close();
            });
        });
      break;
      case 2:
        const validateId = require('../validateId');
        // process ID number and request for county
        if(validateId(text)) {
            user = user ? {...user, id: text} : {id: text};  
                        
            sms.send(register.enterEmail(sender));
            registrationStep = 3;
            const statusEmail = "isRegistering";
            const phoneNumberEmail = phoneNumber;
            const messagingStepEmail = "3";
            const textIDNumber = text;
            const textIDATEmail = textIDAT;
            sql.connect(config, function(err) {
                const request = new sql.Request();
                const updateRegister1 = `UPDATE two_way_sms_tb SET status = @statusEmail, messagingStep = @messagingStepEmail, national_ID=@textIDNUmber WHERE phoneNumber = @phoneNumberEmail AND text_id_AT = @textIDATEmail AND time = (
                    SELECT MAX(time) FROM two_way_sms_tb WHERE phoneNumber = @phoneNumberEmail )`;
                request.input('statusEmail', sql.VarChar, statusEmail);
                request.input('messagingStepEmail', sql.VarChar, messagingStepEmail);
                request.input('phoneNumberEmail', sql.VarChar, phoneNumberEmail);
                request.input('textIDNumber', sql.VarChar, textIDNumber);
                request.input('textIDATEmail', sql.VarChar, textIDATEmail);
                request.query(updateRegister1, function(err, results) {
                    if (err) {
                        console.error('Error executing query: ' + err.stack);
                        return;
                    }
                    console.log('ID # UPDATED successfully');
                });
            });

        } else {
            
            messageToCustomer = "Invalid ID number. Please enter a valid 6-digit ID number";
            registrationStep = 1;
            const statusFail = "isRegistering";
            const phoneNumberFail = sender;
            const messagingStepFail= "1";
            sql.connect(config, function(err) {
                const request = new sql.Request(connection);
                const updateRegister1 = `UPDATE two_way_sms_tb SET status = @statusFail, messagingStep = @messagingStepFail WHERE phoneNumber = @phoneNumberFail AND time = (
                    SELECT MAX(time) FROM two_way_sms_tb WHERE phoneNumber = @phoneNumberFail )`;
                request.input('statusFail', sql.VarChar, statusFail);
                request.input('messagingStepFail', sql.VarChar, messagingStepFail);
                request.input('phoneNumberFail', sql.VarChar, phoneNumberFail);
                request.query(updateRegister1, function(err, results) {
                if (err) {
                    console.error('Error executing query: ' + err.stack);
                    return;
                }
                console.log('Invalid ID number.');
                sql.close();
                });
            });
        }
      break;
      case 3:
            //request 6 character password
            user.email=text          
            sms.send(register.enterPassword(sender));
            registrationStep = 4;
            const statusPassword = "isRegistering";
            const phoneNumberPassword = phoneNumber;
            const messagingStepPassword= "4";
            const textEmail = text;
            const textIDATPass = textIDAT;
            sql.connect(config, function(err) {
                const request = new sql.Request();
                const updateRegister1 = `UPDATE two_way_sms_tb SET status = @statusPassword, messagingStep = @messagingStepPassword, email = @textEmail WHERE phoneNumber = @phoneNumberPassword  AND text_id_AT = @textIDATPass  AND time = (
                    SELECT MAX(time) FROM two_way_sms_tb WHERE phoneNumber = @phoneNumberPassword )`;
                request.input('statusPassword', sql.VarChar, statusPassword);
                request.input('messagingStepPassword', sql.VarChar, messagingStepPassword);
                request.input('phoneNumberPassword', sql.VarChar, phoneNumberPassword);
                request.input('textEmail', sql.VarChar, textEmail);
                request.input('textIDATPass', sql.VarChar, textIDATPass);
                request.query(updateRegister1, function(err, results) {
                if (err) {
                    console.error('Error executing query: ' + err.stack);
                    return;
                }
                console.log('Email UPDATE successful');
                sql.close();
                });
            });

        break;
        case 4:
            //request for fname
            user.password=text;            
            sms.send(register.enterFirstName(sender));
            registrationStep = 5;
            const statusFname = "isRegistering";
            const phoneNumberFname = phoneNumber;
            const messagingStepFname = "5";
            const textPassword =text;
            const textIDATFname = textIDAT;
            sql.connect(config, function(err) {
                const request = new sql.Request();
                const updateRegister1 = `UPDATE two_way_sms_tb SET status = @statusFname, messagingStep = @messagingStepFname, password = @textPassword WHERE phoneNumber = @phoneNumberFname AND text_id_AT = @textIDATFname AND time = (
                    SELECT MAX(time) FROM two_way_sms_tb WHERE phoneNumber = @phoneNumberFname )`;
                request.input('statusFname', sql.VarChar, statusFname);
                request.input('messagingStepFname', sql.VarChar, messagingStepFname);
                request.input('textPassword', sql.VarChar, textPassword);
                request.input('phoneNumberFname', sql.VarChar, phoneNumberFname);
                request.input('textIDATFname', sql.VarChar, textIDATFname);
                request.query(updateRegister1, function(err, results) {
                if (err) {
                    console.error('Error executing query: ' + err.stack);
                    return;
                }
                console.log('Password UPDATE successful');
                sql.close();
                });
            });
        break;
        case 5:
            //request for lname
            user.firstname=text;             
            sms.send(register.enterLastName(sender));
            registrationStep = 6;
            const statusLname = "isRegistering";
            const phoneNumberLname = phoneNumber;
            const messagingStepLname= "6";
            const textFname = text;
            const textIDATLname = textIDAT;
            sql.connect(config, function(err) {
                const request = new sql.Request();
                const updateRegister1 = `UPDATE two_way_sms_tb SET status = @statusLname, messagingStep = @messagingStepLname, firstname = @textFname WHERE phoneNumber = @phoneNumberLname AND text_id_AT = @textIDATLname AND time = (
                    SELECT MAX(time) FROM two_way_sms_tb WHERE phoneNumber = @phoneNumberLname )`;
                request.input('statusLname', sql.VarChar, statusLname);
                request.input('messagingStepLname', sql.VarChar, messagingStepLname);
                request.input('phoneNumberLname', sql.VarChar, phoneNumberLname);
                request.input('textFname', sql.VarChar, textFname);
                request.input('textIDATLname', sql.VarChar, textIDATLname);
                request.query(updateRegister1, function(err, results) {
                if (err) {
                    console.error('Error executing query: ' + err.stack);
                    return;
                }
                console.log('Firstname UPDATE successful');
                sql.close();
                });
            });
        break;
        case 6:
            // process full name and send confirmation message
            user.lastname=text;
            const statusEnd = "isRegistering";
            const phoneNumberEnd = phoneNumber;
            const messagingStepEnd= "6";
            const textLname = text;
            const textIDEnding = textIDAT; 
            sql.connect(config, function(err, connection ) {
                    const request = new sql.Request();
                    const updateRegister1 = `UPDATE two_way_sms_tb SET status = @statusEnd, messagingStep = @messagingStepEnd, lastname = @textLname  WHERE phoneNumber = @phoneNumberEnd AND text_id_AT = @textIDEnding AND time = (
                        SELECT MAX(time) FROM two_way_sms_tb WHERE phoneNumber = @phoneNumberEnd )`;
                    request.input('statusEnd', sql.VarChar, statusEnd);
                    request.input('messagingStepEnd', sql.VarChar, messagingStepEnd);
                    request.input('phoneNumberEnd', sql.VarChar, phoneNumberEnd);
                    request.input('textLname', sql.VarChar, textLname);
                    request.input('textIDEnding', sql.VarChar, textIDEnding);
                    // request.input('isActiveEnd', sql.Bit, isActiveEnd);
                    request.query(updateRegister1, function(err, results) {
                    if (err) {
                        console.error('Error executing query: ' + err.stack);
                        return;
                    }
                    console.log(' Lastname UPDATE successful');
                    sql.close();
            });
        });
        sql.connect(config, function(err) {
            if (err) {
              console.error('Error connecting to database: ' + err.stack);
              return;
            }
          
            console.log('Connected to database');
            const request = new sql.Request();
            const statusReg = "isRegistering";
            const phoneNumberEnd = phoneNumber; 
            const textIDEnD = textIDAT; 
            // Bind the values to the parameters
            request.input('statusReg', sql.NVarChar(50), statusReg);
            request.input('phoneNumberEnd', sql.NVarChar(50), phoneNumberEnd);
            request.input('textIDEnD', sql.VarChar(100), textIDEnD);
            request.query("SELECT TOP 1 * FROM two_way_sms_tb WHERE phoneNumber = @phoneNumberEnd AND status = @statusReg AND isActive = 1 AND text_id_AT = @textIDEnD order by time DESC", function(err, registerResults) {
            if (err) {
            console.error('Error executing query: ' + err.stack);
            return;
            }
            if (registerResults.recordset.length > 0) {
            const fname = registerResults.recordset[0].firstname;
            const lname = registerResults.recordset[0].lastname;
            const national_ID = registerResults.recordset[0].national_ID;
            const emailT =  registerResults.recordset[0].email;
            const pass = registerResults.recordset[0].password;
            const phone = registerResults.recordset[0].phoneNumber;
                    var client = new Client({proxy: false});
                    
                    var args = {
                        data: { firstname: fname, lastname: lname, ID: national_ID, email: emailT, password: pass, phonenumber: phone },
                        headers: { "Content-Type": "application/json" }
                    };
                    console.log(args);
                    client.post("https://api.octagonafrica.com/v1/register", args, function (data, response) {
                    if ([200].includes(response.statusCode)) {
                        // success code
                        sms.send({
                            to: phone,
                            from:'20880',
                            message: "Congratulations!! "+fname.toUpperCase() + " "+ lname.toUpperCase() +". You have successfully registered with Octagon Africa.Incase of any queries contact support@octagonafrica.com' "
                        });
                        isRegistering = false;
                        registrationStep = 0;
                        user = {};
                        const statusSuccess = "FinishedisRegistering";
                        const phoneNumberSuccess = phoneNumber;
                        const messagingStepSuccess = "0";
                        const isActiveSuccess = 0;
                        sql.connect(config, function(err) {
                            const request = new sql.Request();
                            const updateRegister1 = `UPDATE two_way_sms_tb SET status = @statusSuccess, messagingStep = @messagingStepSuccess ,isActive = @isActiveSuccess WHERE phoneNumber = @phoneNumberSuccess AND time = (
                                SELECT MAX(time) FROM two_way_sms_tb WHERE phoneNumber = @phoneNumberSuccess )`;
                            request.input('statusSuccess', sql.VarChar, statusSuccess);
                            request.input('messagingStepSuccess', sql.VarChar, messagingStepSuccess);
                            request.input('phoneNumberSuccess', sql.VarChar, phoneNumberSuccess);
                            request.input('isActiveSuccess', sql.Bit, isActiveSuccess);
                            request.query(updateRegister1, function(err, results) {
                            if (err) {
                                console.error('Error executing query: ' + err.stack);
                                return;
                            }
                            console.log('Register Attempt successful');
                            });
                        });
                        console.log(response.statusCode)
                        
                    } else if ([201].includes(response.statusCode)) {
                        console.log(response.statusCode);
                        isRegistering = false;
                        registrationStep = 0;
                        user = {};
                    }else if ([400].includes(response.statusCode)) {
                        console.log(response.statusCode);
                        sms.send({
                            to: sender,
                            from:'20880',
                            message: "Registration unsuccesfull. Invalid Details or Username Exists . Please try again Later "    
                        });
                        isRegistering = false;
                        registrationStep = 0;
                        user = {};
                        const statusFailure400 = "FailedisRegistering";
                        const phoneNumberFailure400 = phoneNumber;
                        const messagingStepFailure400= "0";
                        const isActiveFailure400 = 0;
                        sql.connect(config, function(err) {
                            const request = new sql.Request();
                            const updateRegister1 = `UPDATE two_way_sms_tb SET status = @statusFailure400, messagingStep = @messagingStepFailure400, isActive=@isActiveFailure400 WHERE phoneNumber = @phoneNumberFailure400 AND time = (
                                SELECT MAX(time) FROM two_way_sms_tb WHERE phoneNumber = @phoneNumberFailure400 )`;
                            request.input('statusFailure400', sql.VarChar, statusFailure400);
                            request.input('messagingStepFailure400', sql.VarChar, messagingStepFailure400);
                            request.input('phoneNumberFailure400', sql.VarChar, phoneNumberFailure400);
                            request.input('isActiveFailure400', sql.Bit, isActiveFailure400);
                            request.query(updateRegister1, function(err, results) {
                            if (err) {
                                console.error('Error executing query: ' + err.stack);
                                return;
                            }
                            console.log('Registration Attempt Unsuccessfull');
                            });
                        });
                    }else if ([500].includes(response.statusCode)) {
                        console.log(response.statusCode);
                        sms.send({
                            to: phone,
                            from:'20880',
                            message: "Registration unsuccesfull. Internal Server Error. Please try again Later "    
                        });
                        isRegistering = false;
                        registrationStep = 0;
                        user = {};
                    }
                    else {
                        // error code
                        console.log(response.statusCode);
                    }
                });  

            }
            sql.close();
            });
          });  
        break;

      default:
        console.log('Unknown registration step:');
        break;
    }
}
module.exports = handleRegister;