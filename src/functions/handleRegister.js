const sql = require('mssql');
var Client = require('node-rest-client').Client;
const httpProxy = require('http-proxy');
const proxy = httpProxy.createProxyServer({});

let user={};
let registrationStep = 0;
function handleRegister(text, sender, messagingStep ,sms, register, config, phoneNumber, validateId) {
    switch (parseInt(messagingStep)) {
      case 1:
        
        // Handle step 1 of registration process
        sms.send(register.enterId(sender));
        registrationStep = 2;
        const statusID = "isRegistering";
        const phoneNumberID = phoneNumber;
        const messagingStepID= "2";
        sql.connect(config, function(err) {
            const request = new sql.Request();
            const updateRegister1 = `UPDATE two_way_sms_tb SET status = @statusID, messagingStep = @messagingStepID WHERE phoneNumber = @phoneNumberID AND time = (
                SELECT MAX(time) FROM two_way_sms_tb WHERE phoneNumber = @phoneNumberID )`;
            request.input('statusID', sql.VarChar, statusID);
            request.input('messagingStepID', sql.VarChar, messagingStepID);
            request.input('phoneNumberID', sql.VarChar, phoneNumberID);
            request.query(updateRegister1, function(err, results) {
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
        // process ID number and request for county
        if(validateId(text)) {
            user = user ? {...user, id: text} : {id: text};  
                        
            sms.send(register.enterEmail(sender));
            registrationStep = 3;
            const statusEmail = "isRegistering";
            const phoneNumberEmail = phoneNumber;
            const messagingStepEmail = "3";
            sql.connect(config, function(err) {
                const request = new sql.Request();
                const updateRegister1 = `UPDATE two_way_sms_tb SET status = @statusEmail, messagingStep = @messagingStepEmail WHERE phoneNumber = @phoneNumberEmail AND time = (
                    SELECT MAX(time) FROM two_way_sms_tb WHERE phoneNumber = @phoneNumberEmail )`;
                request.input('statusEmail', sql.VarChar, statusEmail);
                request.input('messagingStepEmail', sql.VarChar, messagingStepEmail);
                request.input('phoneNumberEmail', sql.VarChar, phoneNumberEmail);
                request.query(updateRegister1, function(err, results) {
                    if (err) {
                        console.error('Error executing query: ' + err.stack);
                        return;
                    }
                    console.log('Query executed successfully');
                });
            });

        } else {
            
            messageToCustomer = "Invalid ID number. Please enter a valid 6-digit ID number";
            registrationStep = 1;
            const statusFail = "isRegistering";
            const phoneNumberFail = sender;
            const messagingStepFail= "1";
            sql.connect(config, function(err) {
                const request = new sql.Request();
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
                console.log('UPDATE successful');
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
            sql.connect(config, function(err) {
                const request = new sql.Request();
                const updateRegister1 = `UPDATE two_way_sms_tb SET status = @statusPassword, messagingStep = @messagingStepPassword WHERE phoneNumber = @phoneNumberPassword AND time = (
                    SELECT MAX(time) FROM two_way_sms_tb WHERE phoneNumber = @phoneNumberPassword )`;
                request.input('statusPassword', sql.VarChar, statusPassword);
                request.input('messagingStepPassword', sql.VarChar, messagingStepPassword);
                request.input('phoneNumberPassword', sql.VarChar, phoneNumberPassword);
                request.query(updateRegister1, function(err, results) {
                if (err) {
                    console.error('Error executing query: ' + err.stack);
                    return;
                }
                console.log('UPDATE successful');
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
            sql.connect(config, function(err) {
                const request = new sql.Request();
                const updateRegister1 = `UPDATE two_way_sms_tb SET status = @statusFname, messagingStep = @messagingStepFname WHERE phoneNumber = @phoneNumberFname AND time = (
                    SELECT MAX(time) FROM two_way_sms_tb WHERE phoneNumber = @phoneNumberFname )`;
                request.input('statusFname', sql.VarChar, statusFname);
                request.input('messagingStepFname', sql.VarChar, messagingStepFname);
                request.input('phoneNumberFname', sql.VarChar, phoneNumberFname);
                request.query(updateRegister1, function(err, results) {
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
            //request for lname
            user.firstname=text;             
            sms.send(register.enterLastName(sender));
            registrationStep = 6;
            const statusLname = "isRegistering";
            const phoneNumberLname = phoneNumber;
            const messagingStepLname= "6";
            sql.connect(config, function(err) {
                const request = new sql.Request();
                const updateRegister1 = `UPDATE two_way_sms_tb SET status = @statusLname, messagingStep = @messagingStepLname WHERE phoneNumber = @phoneNumberLname AND time = (
                    SELECT MAX(time) FROM two_way_sms_tb WHERE phoneNumber = @phoneNumberLname )`;
                request.input('statusLname', sql.VarChar, statusLname);
                request.input('messagingStepLname', sql.VarChar, messagingStepLname);
                request.input('phoneNumberLname', sql.VarChar, phoneNumberLname);
                request.query(updateRegister1, function(err, results) {
                if (err) {
                    console.error('Error executing query: ' + err.stack);
                    return;
                }
                console.log('UPDATE successful');
                sql.close();
                });
            });
        break;
        case 6:
            // process full name and send confirmation message
            user.lastname=text;
                var client = new Client({
                    proxy: false
                });
                var args = {
                    data: { firstname: user.firstname, lastname: user.lastname, ID: user.id, email: user.email, password: user.password, phonenumber: sender },
                    headers: { "Content-Type": "application/json" }
                };
                client.post("https://api.octagonafrica.com/v1/register", args, function (data, response) {
                    if ([200].includes(response.statusCode)) {
                        // success code
                        sms.send({
                            to: sender,
                            from:'20880',
                            message: "Congratulations!! "+user.firstname.toUpperCase() + " "+ user.lastname.toUpperCase() +". You have successfully registered with Octagon Africa.Incase of any queries contact support@octagonafrica.com' "
                        });
                        isRegistering = false;
                        registrationStep = 0;
                        user = {};
                        const statusEnd = "isRegistering";
                        const phoneNumberEnd = phoneNumber;
                        const messagingStepEnd= "0";
                        const isActive = 0;
                        sql.connect(config, function(err) {
                            const request = new sql.Request();
                            const updateRegister1 = `UPDATE two_way_sms_tb SET status = @statusEnd, messagingStep = @messagingStepEnd isactive=@isActive WHERE phoneNumber = @phoneNumberEnd AND time = (
                                SELECT MAX(time) FROM two_way_sms_tb WHERE phoneNumber = @phoneNumberEnd )`;
                            request.input('statusEnd', sql.VarChar, statusEnd);
                            request.input('messagingStepEnd', sql.VarChar, messagingStepEnd);
                            request.input('phoneNumberEnd', sql.VarChar, phoneNumberEnd);
                            request.input('isActive', sql.Bit, isActive);
                            request.query(updateRegister1, function(err, results) {
                            if (err) {
                                console.error('Error executing query: ' + err.stack);
                                return;
                            }
                            console.log('UPDATE successful');
                            sql.close();
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
                        const isActive = 0;
                        sql.connect(config, function(err) {
                            const request = new sql.Request();
                            const updateRegister1 = `UPDATE two_way_sms_tb SET status = @statusFailure400, messagingStep = @messagingStepFailure400 isactive=@isActive WHERE phoneNumber = @phoneNumberFailure400 AND time = (
                                SELECT MAX(time) FROM two_way_sms_tb WHERE phoneNumber = @phoneNumberFailure400 )`;
                            request.input('statusFailure400', sql.VarChar, statusFailure400);
                            request.input('messagingStepFailure400', sql.VarChar, messagingStepFailure400);
                            request.input('phoneNumberFailure400', sql.VarChar, phoneNumberFailure400);
                            request.input('isActive', sql.Bit, isActive);
                            request.query(updateRegister1, function(err, results) {
                            if (err) {
                                console.error('Error executing query: ' + err.stack);
                                return;
                            }
                            console.log('UPDATE successful');
                            sql.close();
                            });
                        });
                    }else if ([500].includes(response.statusCode)) {
                        console.log(response.statusCode);
                        sms.send({
                            to: sender,
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
        break;
      default:
        console.log('Unknown registration step:');
        break;
    }
}
module.exports = handleRegister;