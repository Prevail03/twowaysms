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
                if (err) {
                    console.error('Error connecting to database: ' + err.stack);
                    return;
                }
                console.log('Connected to database');
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
                   fetchData(statusResetPassword,phoneNumberResetPassword,textIDATPassword);
                });
                sql.close();
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