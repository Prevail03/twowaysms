const sql = require('mssql');
var Client = require('node-rest-client').Client;
const httpProxy = require('http-proxy');
const proxy = httpProxy.createProxyServer({});

let user={};


function handlePasswordReset(text, sender, messagingStep, reset, config) {
    switch (parseInt(messagingStep)) {
      case 1:
        //request username
        sms.send(reset.enterEmail(sender));
        resetStep = 2;
        const statusResetEmail = "ResetingPassword";
        const phoneNumberResetEmail = sender;
        const messagingStepResetEmail = "2";
        sql.connect(config, function(err) {
            const request = new sql.Request();
            const updateDelete = `UPDATE two_way_sms_tb SET status = @statusResetEmail, messagingStep = @messagingStepResetEmail WHERE phoneNumber = @phoneNumberResetEmail AND time = (
                SELECT MAX(time) FROM two_way_sms_tb WHERE phoneNumber = @phoneNumberResetEmail )`;
            request.input('statusResetEmail', sql.VarChar, statusResetEmail);
            request.input('messagingStepResetEmail', sql.VarChar, messagingStepResetEmail);
            request.input('phoneNumberResetEmail', sql.NVarChar, phoneNumberResetEmail);
            request.query(updateDelete, function(err, results) {
            if (err) {
                console.error('Error executing query: ' + err.stack);
                return;
            }
            console.log('UPDATE successful');
            sql.close();
            });
        });
    break;

    case 2:
        //request current password 
        user.email=text;
        sms.send(reset.enterCurrentPassword(sender));  
        resetStep =3;
        const statusResetCPassword = "ResetingPassword";
        const phoneNumberResetCPassword = sender;
        const messagingStepResetCPassword = "3";
        sql.connect(config, function(err) {
            const request = new sql.Request();
            const updateDelete = `UPDATE two_way_sms_tb SET status = @statusResetCPassword, messagingStep = @messagingStepResetCPassword WHERE phoneNumber = @phoneNumberResetCPassword AND time = (
                SELECT MAX(time) FROM two_way_sms_tb WHERE phoneNumber = @phoneNumberResetCPassword )`;
            request.input('statusResetCPassword', sql.VarChar, statusResetCPassword);
            request.input('messagingStepResetCPassword', sql.VarChar, messagingStepResetCPassword);
            request.input('phoneNumberResetCPassword', sql.NVarChar, phoneNumberResetCPassword);
            request.query(updateDelete, function(err, results) {
            if (err) {
                console.error('Error executing query: ' + err.stack);
                return;
            }
            console.log('UPDATE successful');
            sql.close();
            });
        });
        
    break;
    //send to login and reset Password
    case 3:
        //request OTP
        user.currentPassword=text;
        //confirm login /send to octagon Login API
        var deleteClient = new Client();
        var args = {
            data: { username: user.email, password: user.currentPassword },
            headers: { "Content-Type": "application/json" }
        };
        deleteClient.post("https://api.octagonafrica.com/v1/login", args, function (data, response) {
        console.log(data);  
        if ([200].includes(response.statusCode)) {
            sms.send(reset.verifyPassword(sender)); 
            var deleteClient = new Client();
                    var args = {
                        data: { identifier: user.email },
                        headers: { "Content-Type": "application/json" }
                    };
                    deleteClient.post("https://api.octagonafrica.com/v1/password_reset", args, function (data, response) {
                    console.log(data);
                    if ([200].includes(response.statusCode)) { 
                        sms.send(reset.enterOTP(sender));  
                            resetStep = 4; 
                            const statusResetVPassword = "ResetingPassword";
                            const phoneNumberResetVPassword = sender;
                            const messagingStepResetVPassword = "4";
                            sql.connect(config, function(err) {
                                const request = new sql.Request();
                                const updateDelete = `UPDATE two_way_sms_tb SET status = @statusResetVPassword, messagingStep = @messagingStepResetVPassword WHERE phoneNumber = @phoneNumberResetVPassword AND time = (
                                    SELECT MAX(time) FROM two_way_sms_tb WHERE phoneNumber = @phoneNumberResetVPassword )`;
                                request.input('statusResetVPassword', sql.VarChar, statusResetVPassword);
                                request.input('messagingStepResetVPassword', sql.VarChar, messagingStepResetVPassword);
                                request.input('phoneNumberResetVPassword', sql.NVarChar, phoneNumberResetVPassword);
                                request.query(updateDelete, function(err, results) {
                                if (err) {
                                    console.error('Error executing query: ' + err.stack);
                                    return;
                                }
                                console.log('UPDATE successful');
                                sql.close();
                                });
                            });
                        console.log(response.statusCode);
                    
                    } else if ([201].includes(response.statusCode)) {
                        console.log(response.statusCode);
                    } else if ([400].includes(response.statusCode)) {
                        console.log(response.statusCode);
                        sms.send({
                            to: sender,
                            from:'20880',
                            message: " Invalid Details!!. Check your details and please try again Later "
                        });
                    } else {
                        // error code
                        console.log(response.statusCode);
                    }
                    });
        } else if ([201].includes(response.statusCode)) {
            console.log(response.statusCode);
        } else if ([400].includes(response.statusCode)) {
            console.log(response.statusCode);
            sms.send({
                to: sender,
                from:'20880',
                message: " Invalid Details!!. Check your details and please try again Later "
            });
            
            } else if ([401].includes(response.statusCode)) {
                console.log(response.statusCode);
                sms.send({
                    to: sender,
                    from:'20880',
                    message: " Authentication failed. Incorrect password or username. Access denied "
                });
            }
        
        else if ([500].includes(response.statusCode)) { 
            console.log(response.statusCode);
            sms.send({
                to: sender,
                from:'20880',
                message: " Invalid request.  "
            });
        } else {
            // error code
            console.log(response.statusCode);
        }
        });
    
        
    break;
    case 4:
        //request new Password
        user.otp=text;
        sms.send(reset.enterNewPassword(sender));  
        resetStep = 5;
        const statusResetNPassword = "ResetingPassword";
        const phoneNumberResetNPassword = sender;
        const messagingStepResetNPassword = "5";
        sql.connect(config, function(err) {
            const request = new sql.Request();
            const updateDelete = `UPDATE two_way_sms_tb SET status = @statusResetNPassword, messagingStep = @messagingStepResetNPassword WHERE phoneNumber = @phoneNumberResetNPassword AND time = (
                SELECT MAX(time) FROM two_way_sms_tb WHERE phoneNumber = @phoneNumberResetNPassword )`;
            request.input('statusResetNPassword', sql.VarChar, statusResetNPassword);
            request.input('messagingStepResetNPassword', sql.VarChar, messagingStepResetNPassword);
            request.input('phoneNumberResetNPassword', sql.NVarChar, phoneNumberResetNPassword);
            request.query(updateDelete, function(err, results) {
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
        user.newPassword=text;
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
                resetStep=0;
                ResetingPassword=false;
                user = {};
                console.log(response.statusCode)
                const statusResetConfirmation = "ResetingPassword";
                const phoneNumberResetConfirmation45 = sender;
                const messagingStepResetConfirmation = "2";
                sql.connect(config, function(err) {
                    const request = new sql.Request();
                    const updateDelete = `UPDATE two_way_sms_tb SET status = @statusResetConfirmation, messagingStep = @messagingStepResetConfirmation WHERE phoneNumber = @phoneNumberResetConfirmation45 AND time = (
                        SELECT MAX(time) FROM two_way_sms_tb WHERE phoneNumber = @phoneNumberResetConfirmation45 )`;
                    request.input('statusResetConfirmation', sql.VarChar, statusResetConfirmation);
                    request.input('messagingStepResetConfirmation', sql.VarChar, messagingStepResetConfirmation);
                    request.input('phoneNumberResetConfirmation', sql.NVarChar, phoneNumberResetConfirmation45);
                    request.query(updateDelete, function(err, results) {
                    if (err) {
                        console.error('Error executing query: ' + err.stack);
                        return;
                    }
                    console.log('UPDATE successful');
                    sql.close();
                    });
                });
            }else if ([400].includes(response.statusCode)) {
                console.log(response.statusCode);
                sms.send({
                    to: sender,
                    from:'20880',
                    message: " Invalid Details!!. Check your details and please try again Later "
                });
            }
            else if ([404].includes(response.statusCode)) {
                console.log(response.statusCode);
                sms.send({
                    to: sender,
                    from:'20880',
                    message: " Invalid or Expired Password Reset Token !!!"
                });
            }else if ([500].includes(response.statusCode)) { 
                console.log(response.statusCode);
                sms.send({
                    to: sender,
                    from:'20880',
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
module.exports=handlePasswordReset;