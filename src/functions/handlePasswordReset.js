const sql = require('mssql');
var Client = require('node-rest-client').Client;
const httpProxy = require('http-proxy');
const proxy = httpProxy.createProxyServer({});

let user={};


function handlePasswordReset(text, sender, messagingStep, reset, config, phoneNumber) {
    switch (parseInt(messagingStep)) {
      case 1:
        //request username
        sms.send(reset.enterEmail(sender));
        resetStep = 2;
    break;

    case 2:
        //request current password 
        user.email=text;
        sms.send(reset.enterCurrentPassword(sender));  
        resetStep =3;
    break;
    //send to login and reset Password
    case 3:
        //request OTP
        user.currentPassword=text;
        //send to octagon Login API
        //confirm login
        var deleteClient = new Client();
        // set content-type header and data as json in args parameter
        var args = {
            data: { username: user.email, password: user.currentPassword },
            headers: { "Content-Type": "application/json" }
        };
            // username= data[0]+"."+data[1];
        // Actual Octagon Login To Account API
        deleteClient.post("https://api.octagonafrica.com/v1/login", args, function (data, response) {
        // parsed response body as js object
        console.log(data);
        // raw response
        
        
        if ([200].includes(response.statusCode)) {
            // success code
            sms.send(reset.verifyPassword(sender)); 
            //send email to reset Password API
            var deleteClient = new Client();
                    // set content-type header and data as json in args parameter
                    var args = {
                        data: { identifier: user.email },
                        headers: { "Content-Type": "application/json" }
                    };
                        // username= data[0]+"."+data[1];
                    // Actual Octagon Delete User Account API
                    deleteClient.post("https://api.octagonafrica.com/v1/password_reset", args, function (data, response) {
                    // parsed response body as js object
                    console.log(data);
                    // raw response
                
                    
                    if ([200].includes(response.statusCode)) {
                        // success code 
                        
                        sms.send(reset.enterOTP(sender));  
                            resetStep = 4; 
                        
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