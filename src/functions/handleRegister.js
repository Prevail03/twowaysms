const sql = require('mssql');
var Client = require('node-rest-client').Client;
const httpProxy = require('http-proxy');
const { InvalidNationalID,updateNationalID,updateEmail,failedIDNumber } = require('./Database/registerDB');


let user = {};
let registrationStep = 0;
function handleRegister(text, sender, messagingStep, sms, register, config, phoneNumber, textIDAT) {
    console.log(textIDAT);
    switch (parseInt(messagingStep)) {
        case 1:

            // Handle step 1 of registration process
            sms.send(register.enterId(sender));
            registrationStep = 2;
            const statusID = "isRegistering";
            const phoneNumberID = phoneNumber;
            const messagingStepID = "2";
            const textID = text;
            const textIDATID = textIDAT;
            failedIDNumber(statusID,phoneNumberID,messagingStepID,textID,textIDATID,config);
            break;
        case 2:
            const validateId = require('../validateId');
            // process ID number and request for county
            if (validateId(text)) {
                user = user ? { ...user, id: text } : { id: text };

                sms.send(register.enterEmail(sender));
                const statusEmail = "isRegistering";
                const phoneNumberEmail = phoneNumber;
                const messagingStepEmail = "3";
                const textIDNumber = text;
                const textIDATEmail = textIDAT;
                updateNationalID(statusEmail,phoneNumberEmail,messagingStepEmail,textIDNumber,textIDATEmail,config);
            } else {
                sms.send(register.failedId(sender));
                const statusFail = "isRegistering";
                const phoneNumberFail = sender;
                const messagingStepFail = "1";
                InvalidNationalID(statusFail,phoneNumberFail,messagingStepFail,config);
            }
            break;
        case 3:
            //request 6 character password         
            sms.send(register.enterPassword(sender));
            const statusPassword = "isRegistering";
            const phoneNumberPassword = phoneNumber;
            const messagingStepPassword = "4";
            const textEmail = text;
            const textIDATPass = textIDAT;
            updateEmail(statusPassword,phoneNumberPassword,messagingStepPassword,textEmail,textIDATPass,config);
            break;
        case 4:
            //request for fname           
            sms.send(register.enterFirstName(sender));
            const statusFname = "isRegistering";
            const phoneNumberFname = phoneNumber;
            const messagingStepFname = "5";
            const textPassword = text;
            const textIDATFname = textIDAT;
            updatePassword(statusFname,phoneNumberFname,messagingStepFname,textPassword,textIDATFname,config);
            break;
        case 5:
            //request for lname           
            sms.send(register.enterLastName(sender));
            registrationStep = 6;
            const statusLname = "isRegistering";
            const phoneNumberLname = phoneNumber;
            const messagingStepLname = "6";
            const textFname = text;
            const textIDATLname = textIDAT;
            sql.connect(config, function (err) {
                const request = new sql.Request();
                const updateRegister1 = `UPDATE two_way_sms_tb SET status = @statusLname, messagingStep = @messagingStepLname, firstname = @textFname WHERE phoneNumber = @phoneNumberLname AND text_id_AT = @textIDATLname AND time = (
                    SELECT MAX(time) FROM two_way_sms_tb WHERE phoneNumber = @phoneNumberLname )`;
                request.input('statusLname', sql.VarChar, statusLname);
                request.input('messagingStepLname', sql.VarChar, messagingStepLname);
                request.input('phoneNumberLname', sql.VarChar, phoneNumberLname);
                request.input('textFname', sql.VarChar, textFname);
                request.input('textIDATLname', sql.VarChar, textIDATLname);
                request.query(updateRegister1, function (err, results) {
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
            const statusEnd = "isRegistering";
            const phoneNumberEnd = phoneNumber;
            const messagingStepEnd = "6";
            const textLname = text;
            const textIDEnding = textIDAT;
            sql.connect(config, function (err, connection) {
                const request = new sql.Request();
                const updateRegister1 = `UPDATE two_way_sms_tb SET status = @statusEnd, messagingStep = @messagingStepEnd, lastname = @textLname  WHERE phoneNumber = @phoneNumberEnd AND text_id_AT = @textIDEnding AND time = (
                        SELECT MAX(time) FROM two_way_sms_tb WHERE phoneNumber = @phoneNumberEnd )`;
                request.input('statusEnd', sql.VarChar, statusEnd);
                request.input('messagingStepEnd', sql.VarChar, messagingStepEnd);
                request.input('phoneNumberEnd', sql.VarChar, phoneNumberEnd);
                request.input('textLname', sql.VarChar, textLname);
                request.input('textIDEnding', sql.VarChar, textIDEnding);
                // request.input('isActiveEnd', sql.Bit, isActiveEnd);
                request.query(updateRegister1, function (err, results) {
                    if (err) {
                        console.error('Error executing query: ' + err.stack);
                        return;
                    }
                    console.log(' Lastname UPDATE successful');
                    const statusReg = "isRegistering";
                    const phoneNumberEnding = phoneNumber;
                    const textIDEnD = textIDAT;
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
                            const fname = registerResults.recordset[0].firstname;
                            const lname = registerResults.recordset[0].lastname;
                            const national_ID = registerResults.recordset[0].national_ID;
                            const emailT = registerResults.recordset[0].email;
                            const pass = registerResults.recordset[0].password;
                            const phone = registerResults.recordset[0].phoneNumber;
                            var client = new Client({ proxy: false });

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
                                        from: '20880',
                                        message: "Congratulations!! " + fname.toUpperCase() + " " + lname.toUpperCase() + ". You have successfully registered with Octagon Africa.Incase of any queries contact support@octagonafrica.com' "
                                    });
                                    const statusSuccess = "FinishedisRegistering";
                                    const phoneNumberSuccess = phoneNumber;
                                    const messagingStepSuccess = "0";
                                    const isActiveSuccess = 0;
                                    sql.connect(config, function (err) {
                                        const request = new sql.Request();
                                        const updateRegister1 = `UPDATE two_way_sms_tb SET status = @statusSuccess, messagingStep = @messagingStepSuccess ,isActive = @isActiveSuccess WHERE phoneNumber = @phoneNumberSuccess AND time = (
                                            SELECT MAX(time) FROM two_way_sms_tb WHERE phoneNumber = @phoneNumberSuccess )`;
                                        request.input('statusSuccess', sql.VarChar, statusSuccess);
                                        request.input('messagingStepSuccess', sql.VarChar, messagingStepSuccess);
                                        request.input('phoneNumberSuccess', sql.VarChar, phoneNumberSuccess);
                                        request.input('isActiveSuccess', sql.Bit, isActiveSuccess);
                                        request.query(updateRegister1, function (err, results) {
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
                                } else if ([400].includes(response.statusCode)) {
                                    console.log(response.statusCode);
                                    sms.send({
                                        to: sender,
                                        from: '20880',
                                        message: "Registration unsuccesfull. Invalid Details or Username Exists . Please try again Later "
                                    });
                                    const statusFailure400 = "FailedisRegistering";
                                    const phoneNumberFailure400 = phoneNumber;
                                    const messagingStepFailure400 = "0";
                                    const isActiveFailure400 = 0;
                                    sql.connect(config, function (err) {
                                        const request = new sql.Request();
                                        const updateRegister1 = `UPDATE two_way_sms_tb SET status = @statusFailure400, messagingStep = @messagingStepFailure400, isActive=@isActiveFailure400 WHERE phoneNumber = @phoneNumberFailure400 AND time = (
                                            SELECT MAX(time) FROM two_way_sms_tb WHERE phoneNumber = @phoneNumberFailure400 )`;
                                        request.input('statusFailure400', sql.VarChar, statusFailure400);
                                        request.input('messagingStepFailure400', sql.VarChar, messagingStepFailure400);
                                        request.input('phoneNumberFailure400', sql.VarChar, phoneNumberFailure400);
                                        request.input('isActiveFailure400', sql.Bit, isActiveFailure400);
                                        request.query(updateRegister1, function (err, results) {
                                            if (err) {
                                                console.error('Error executing query: ' + err.stack);
                                                return;
                                            }
                                            console.log('Registration Attempt Unsuccessfull');
                                        });
                                    });

                                } else if ([407].includes(response.statusCode)) {
                                    console.log(response.statusCode);
                                    sms.send({
                                        to: sender,
                                        from: '20880',
                                        message: 'We already have your registration request and is awaiting approval. Incase of any queries please contact support on support@octagonafrica.com or  +254709986000 '
                                    });
                                    const statusFailure407 = "FailedisRegistering";
                                    const phoneNumberFailure407 = phoneNumber;
                                    const messagingStepFailure407 = "0";
                                    const isActiveFailure407 = 0;
                                    sql.connect(config, function (err) {
                                        const request = new sql.Request();
                                        const updateRegister1 = `UPDATE two_way_sms_tb SET status = @statusFailure407, messagingStep = @messagingStepFailure407, isActive=@isActiveFailure407 WHERE phoneNumber = @phoneNumberFailure407 AND time = (
                                            SELECT MAX(time) FROM two_way_sms_tb WHERE phoneNumber = @phoneNumberFailure407 )`;
                                        request.input('statusFailure407', sql.VarChar, statusFailure407);
                                        request.input('messagingStepFailure407', sql.VarChar, messagingStepFailure407);
                                        request.input('phoneNumberFailure407', sql.VarChar, phoneNumberFailure407);
                                        request.input('isActiveFailure407', sql.Bit, isActiveFailure407);
                                        request.query(updateRegister1, function (err, results) {
                                            if (err) {
                                                console.error('Error executing query: ' + err.stack);
                                                return;
                                            }
                                            console.log('Registration Attempt Unsuccessfull');
                                        });
                                    });
                                }    
                                else if ([500].includes(response.statusCode)) {
                                    console.log(response.statusCode);
                                    sms.send({
                                        to: phone,
                                        from: '20880',
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
            });
            break;

        default:
            console.log('Unknown registration step:');
            break;
    }
}
module.exports = handleRegister;