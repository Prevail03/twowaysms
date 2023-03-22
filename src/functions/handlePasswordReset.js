const sql = require('mssql');
var Client = require('node-rest-client').Client;
const httpProxy = require('http-proxy');
const proxy = httpProxy.createProxyServer({});
const { updateEmail1, updateEmail2, fetchData } = require('./Database/resetDB');

let user = {};
function handlePasswordReset(text, sender, messagingStep, sms, reset, config, textIDAT) {
    switch (parseInt(messagingStep)) {
        case 1:
            //request username
            sms.send(reset.enterEmail(sender));
            resetStep = 2;
            const statusResetEmail = "ResetingPassword";
            const phoneNumberResetEmail = sender;
            const messagingStepResetEmail = "2";
            const textEmailReset = text;
            const textIDATEmail = textIDAT;
            updateEmail1(statusResetEmail, phoneNumberResetEmail, messagingStepResetEmail, textEmailReset, config, textIDATEmail);
            break;

        case 2:
            //request current password 
            sms.send(reset.enterCurrentPassword(sender));
            const statusResetCPassword = "ResetingPassword";
            const phoneNumberResetCPassword = sender;
            const messagingStepResetCPassword = "3";
            const textEmail = text;
            const textIDATCPassword = textIDAT;
            updateEmail2(statusResetCPassword, phoneNumberResetCPassword, messagingStepResetCPassword, textEmail, textIDATCPassword, config);
            break;
        //send to login and reset Password
        case 3:
            //request OTP
            const statusResetPassword = "ResetingPassword";
            const phoneNumberResetPassword = sender;
            const messagingStepResetPassword = "3";
            const textCPassword = text;
            const textIDATPassword = textIDAT;

            sql.connect(config, function (err) {
                const requestUpdate = new sql.Request();
                const updateReset = `UPDATE two_way_sms_tb SET status = @statusResetPassword , messagingStep = @messagingStepResetPassword , password = @textCPassword WHERE phoneNumber = @phoneNumberResetPassword AND text_id_AT = @textIDATPassword AND  time = (
                    SELECT MAX(time) FROM two_way_sms_tb WHERE phoneNumber = @phoneNumberResetPassword )`;
                requestUpdate.input('statusResetPassword', sql.VarChar, statusResetPassword);
                requestUpdate.input('messagingStepResetPassword', sql.VarChar, messagingStepResetPassword);
                requestUpdate.input('phoneNumberResetPassword', sql.NVarChar, phoneNumberResetPassword);
                requestUpdate.input('textCPassword', sql.NVarChar, textCPassword);
                requestUpdate.input('textIDATPassword', sql.NVarChar, textIDATPassword);
                requestUpdate.query(updateReset, function (err, results) {
                    if (err) {
                        console.error('Error executing query: ' + err.stack);
                        return;
                    }
                    console.log('Current Password UPDATE successful');
                    // The first query has completed, so we can execute the second query now
                    const statusReg = "ResetingPassword";
                    const phoneNumberEnding = phoneNumberResetPassword;
                    const textIDEnD = textIDAT;
                    // Bind the values to the parameters
                    const request = new sql.Request();
                    request.input('statusReg', sql.NVarChar(50), statusReg);
                    request.input('phoneNumberEnding', sql.NVarChar(50), phoneNumberEnding);
                    request.input('textIDEnD', sql.VarChar(100), textIDEnD);
                    request.query("SELECT TOP 1 * FROM two_way_sms_tb WHERE phoneNumber = @phoneNumberEnding AND status = @statusReg AND isActive = 1 AND text_id_AT = @textIDEnD order by time DESC", function (err, registerResults) {
                        if (err) {
                            console.error('Error executing query: ' + err.stack);
                            return;
                        }
                        if (registerResults.recordset.length > 0) {
                            const emailT = registerResults.recordset[0].email;
                            const pass = registerResults.recordset[0].password;
                            const phone = registerResults.recordset[0].phoneNumber;
                            console.log(emailT + ' ' + pass + ' ' + phone);
                            var deleteClient = new Client();
                            var args = {
                                data: { username: emailT, password: pass },
                                headers: { "Content-Type": "application/json" }
                            };
                            deleteClient.post("https://api.octagonafrica.com/v1/login", args, function (data, response) {
                                if ([200].includes(response.statusCode)) {
                                    sms.send(reset.verifyPassword(sender));
                                    var deleteClient = new Client();
                                    var args = {
                                        data: { identifier: emailT },
                                        headers: { "Content-Type": "application/json" }
                                    };
                                    deleteClient.post("https://api.octagonafrica.com/v1/password_reset", args, function (data, response) {
                                        console.log(data);
                                        if ([200].includes(response.statusCode)) {
                                            sms.send(reset.enterOTP(sender));
                                            console.log("OTP sent to " + emailT);
                                            console.log(response.statusCode);
                                        } else if ([400].includes(response.statusCode)) {
                                            console.log(response.statusCode);
                                            sms.send(reset.error400(sender));
                                        } else {
                                            console.log(response.statusCode);
                                        }
                                    });
                                } else if ([400].includes(response.statusCode)) {
                                    console.log(response.statusCode);
                                    sms.send(reset.error400(sender));
                                    const statuserror404 = "ResetPasswordFailed";
                                    const messagingSteperror404 = "2";
                                    const phoneNumbererror404 = sender;
                                    const textIDATerror404 = textIDAT;
                                    const updateDelete = `UPDATE two_way_sms_tb SET status = @statuserror404, messagingStep = @messagingSteperror404  WHERE phoneNumber = @phoneNumbererror404 AND text_id_AT =@textIDATerror404 AND time = (
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
                                        console.log(' Reset Password Attempt unsuccessful');
                                        sql.close();
                                    });
                                } else if ([500].includes(response.statusCode)) {
                                    console.log(response.statusCode);
                                    sms.send(reset.error500(sender));
                                    const statuserror500 = "ResetPasswordFailed";
                                    const messagingSteperror500 = "2";
                                    const phoneNumbererror500 = sender;
                                    const textIDATerror500 = textIDAT;
                                    const updateDelete = `UPDATE two_way_sms_tb SET status = @statuserror500, messagingStep = @messagingSteperror500  WHERE phoneNumber = @phoneNumbererror500 AND text_id_AT =@textIDATerror500 AND time = (
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
                                        console.log(' Reset Password Attempt unsuccessful');
                                        sql.close();
                                    });

                                } else {
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
        case 4:
            //request new Password
            user.otp = text;
            sms.send(reset.enterNewPassword(sender));
            resetStep = 5;
            const statusResetNPassword = "ResetingPassword";
            const phoneNumberResetNPassword = sender;
            const messagingStepResetNPassword = "5";
            sql.connect(config, function (err) {
                const request = new sql.Request();
                const updateReset = `UPDATE two_way_sms_tb SET status = @statusResetNPassword, messagingStep = @messagingStepResetNPassword WHERE phoneNumber = @phoneNumberResetNPassword AND time = (
                            SELECT MAX(time) FROM two_way_sms_tb WHERE phoneNumber = @phoneNumberResetNPassword )`;
                request.input('statusResetNPassword', sql.VarChar, statusResetNPassword);
                request.input('messagingStepResetNPassword', sql.VarChar, messagingStepResetNPassword);
                request.input('phoneNumberResetNPassword', sql.NVarChar, phoneNumberResetNPassword);
                request.query(updateReset, function (err, results) {
                    if (err) {
                        console.error('Error executing query: ' + err.stack);
                        return;
                    }
                    console.log('UPDATE successful');
                    sql.close();
                });
            });
            break;
        case 5:
            //confirmation of password reset
            user.newPassword = text;
            //confirm login
            var deleteClient = new Client();
            // set content-type header and data as json in args parameter
            var args = {
                data: { code: user.otp, password: user.newPassword },
                headers: { "Content-Type": "application/json" }
            };
            // username= data[0]+"."+data[1];
            // Actual Octagon Delete User Account API
            deleteClient.put("https://api.octagonafrica.com/v1/new_password", args, function (data, response) {
                // parsed response body as js object
                console.log(data);
                // raw response


                if ([200].includes(response.statusCode)) {
                    // success code
                    sms.send(reset.confirmation(sender));
                    resetStep = 0;
                    ResetingPassword = false;
                    user = {};
                    console.log(response.statusCode)
                    const statusResetConfirmation = "ResetingPassword";
                    const phoneNumberResetConfirmation45 = sender;
                    const messagingStepResetConfirmation = "2";
                    sql.connect(config, function (err) {
                        const request = new sql.Request();
                        const updateReset = `UPDATE two_way_sms_tb SET status = @statusResetConfirmation, messagingStep = @messagingStepResetConfirmation WHERE phoneNumber = @phoneNumberResetConfirmation45 AND time = (
                                    SELECT MAX(time) FROM two_way_sms_tb WHERE phoneNumber = @phoneNumberResetConfirmation45 )`;
                        request.input('statusResetConfirmation', sql.VarChar, statusResetConfirmation);
                        request.input('messagingStepResetConfirmation', sql.VarChar, messagingStepResetConfirmation);
                        request.input('phoneNumberResetConfirmation', sql.NVarChar, phoneNumberResetConfirmation45);
                        request.query(updateReset, function (err, results) {
                            if (err) {
                                console.error('Error executing query: ' + err.stack);
                                return;
                            }
                            console.log('UPDATE successful');
                            sql.close();
                        });
                    });
                } else if ([400].includes(response.statusCode)) {
                    console.log(response.statusCode);
                    sms.send({
                        to: sender,
                        from: '20880',
                        message: " Invalid Details!!. Check your details and please try again Later "
                    });
                }
                else if ([404].includes(response.statusCode)) {
                    console.log(response.statusCode);
                    sms.send({
                        to: sender,
                        from: '20880',
                        message: " Invalid or Expired Password Reset Token !!!"
                    });
                } else if ([500].includes(response.statusCode)) {
                    console.log(response.statusCode);
                    sms.send({
                        to: sender,
                        from: '20880',
                        message: " Invalid request.  "
                    });
                } else {
                    // error code
                    console.log(response.statusCode);
                }
            });


            break;
    }
}
module.exports = handlePasswordReset;