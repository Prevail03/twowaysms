const sql = require('mssql');
var Client = require('node-rest-client').Client;
let user={};
function handleRegister(text, sender, messagingStep ,sms, register, config, phoneNumber, time, validateId) {
    switch (parseInt(messagingStep)) {
      case 1:
        
        // Handle step 1 of registration process
        sms.send(register.enterId(sender));
        registrationStep = 2;
        const status = "isRegistering";
        const phoneNumber = sender;
        const messagingStep= "2";
        sql.connect(config, function(err) {
            const request = new sql.Request();
            const updateRegister1 = `UPDATE two_way_sms_tb SET status = @status, messagingStep = @messagingStep WHERE phoneNumber = @phoneNumber AND time = (
                SELECT MAX(time) FROM two_way_sms_tb WHERE phoneNumber = @phoneNumber )`;
            request.input('status', sql.VarChar, status);
            request.input('messagingStep', sql.VarChar, messagingStep);
            request.input('phoneNumber', sql.VarChar, phoneNumber);
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
            const status = "isRegistering";
            const phoneNumber = sender;
            const messagingStep= "3";
            sql.connect(config, function(err) {
                const request = new sql.Request();
                const updateRegister1 = `UPDATE two_way_sms_tb SET status = @status, messagingStep = @messagingStep WHERE phoneNumber = @phoneNumber AND time = (
                    SELECT MAX(time) FROM two_way_sms_tb WHERE phoneNumber = @phoneNumber )`;
                request.input('status', sql.VarChar, status);
                request.input('messagingStep', sql.VarChar, messagingStep);
                request.input('phoneNumber', sql.VarChar, phoneNumber);
                request.query(updateRegister1, function(err, results) {
                if (err) {
                    console.error('Error executing query: ' + err.stack);
                    return;
                }
                console.log('UPDATE successful');
                sql.close();
                });
            });

        } else {
            
            messageToCustomer = "Invalid ID number. Please enter a valid 6-digit ID number";
            registrationStep = 1;
            const status = "isRegistering";
            const phoneNumber = sender;
            const messagingStep= "1";
            sql.connect(config, function(err) {
                const request = new sql.Request();
                const updateRegister1 = `UPDATE two_way_sms_tb SET status = @status, messagingStep = @messagingStep WHERE phoneNumber = @phoneNumber AND time = (
                    SELECT MAX(time) FROM two_way_sms_tb WHERE phoneNumber = @phoneNumber )`;
                request.input('status', sql.VarChar, status);
                request.input('messagingStep', sql.VarChar, messagingStep);
                request.input('phoneNumber', sql.VarChar, phoneNumber);
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
            const phoneNumberPassword = sender;
            const messagingStepPassword= "4";
            sql.connect(config, function(err) {
                const request = new sql.Request();
                const updateRegister1 = `UPDATE two_way_sms_tb SET status = @statusPassword, messagingStep = @messagingStepPassword WHERE phoneNumber = @phoneNumberPassword AND time = (
                    SELECT MAX(time) FROM two_way_sms_tb WHERE phoneNumber = @phoneNumberPassword )`;
                request.input('status', sql.VarChar, statusPassword);
                request.input('messagingStep', sql.VarChar, messagingStepPassword);
                request.input('phoneNumber', sql.VarChar, phoneNumberPassword);
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
            const phoneNumberFname = sender;
            const messagingStepFname = "5";
            sql.connect(config, function(err) {
                const request = new sql.Request();
                const updateRegister1 = `UPDATE two_way_sms_tb SET status = @statusFname, messagingStep = @messagingStepFname WHERE phoneNumber = @phoneNumberFname AND time = (
                    SELECT MAX(time) FROM two_way_sms_tb WHERE phoneNumber = @phoneNumberFname )`;
                request.input('status', sql.VarChar, statusFname);
                request.input('messagingStep', sql.VarChar, messagingStepFname);
                request.input('phoneNumber', sql.VarChar, phoneNumberFname);
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
            const phoneNumberLname = sender;
            const messagingStepLname= "6";
            sql.connect(config, function(err) {
                const request = new sql.Request();
                const updateRegister1 = `UPDATE two_way_sms_tb SET status = @statusLname, messagingStep = @messagingStepLname WHERE phoneNumber = @phoneNumberLname AND time = (
                    SELECT MAX(time) FROM two_way_sms_tb WHERE phoneNumber = @phoneNumberLname )`;
                request.input('status', sql.VarChar, statusLname);
                request.input('messagingStep', sql.VarChar, messagingStepLname);
                request.input('phoneNumber', sql.VarChar, phoneNumberLname);
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
                // Sending the request to octagon registration API
                var client = new Client();
                // set content-type header and data as json in args parameter
                var args = {
                    data: { firstname: user.firstname, lastname: user.lastname, ID: user.id, email: user.email, password: user.password, phonenumber: sender },
                    headers: { "Content-Type": "application/json" }
                };
                    // username= data[0]+"."+data[1];
                // Actual Octagon user registration API
                client.post("https://api.octagonafrica.com/v1/register", args, function (data, response) {
                    // parsed response body as js object
                    console.log(data);
                    // raw response
                
                    

                    if ([200].includes(response.statusCode)) {
                        // success code
                        sms.send({
                            to: sender,
                            from:'20880',
                            message: "Congratulations!! "+user.firstname.toUpperCase() + " "+ user.lastname.toUpperCase() +". You have successfully registered with Octagon Africa. It has been sent to our team and it is awaiting Approval.Incase of any queries contact support@octagonafrica.com' "
                        });
                        isRegistering = false;
                        registrationStep = 0;
                        user = {};
                        const statusPassword = "isRegistering";
                        const phoneNumberPassword = sender;
                        const messagingStepPassword= "0";
                        const isActive = 1;
                        sql.connect(config, function(err) {
                            const request = new sql.Request();
                            const updateRegister1 = `UPDATE two_way_sms_tb SET status = @statusPassword, messagingStep = @messagingStepPassword isactive=@isActive WHERE phoneNumber = @phoneNumberPassword AND time = (
                                SELECT MAX(time) FROM two_way_sms_tb WHERE phoneNumber = @phoneNumberPassword )`;
                            request.input('status', sql.VarChar, statusPassword);
                            request.input('messagingStep', sql.VarChar, messagingStepPassword);
                            request.input('phoneNumber', sql.VarChar, phoneNumberPassword);
                            insertRequest.input('isActive', sql.Bit, isActive);
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
      // ...
      default:
        console.log('Unknown registration step: ' + messagingStep);
        break;
    }
}
module.exports = handleRegister;