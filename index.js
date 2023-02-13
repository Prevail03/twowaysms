const express = require("express");
const session = require('express-session');
const _ = require('lodash');
const sql = require('mssql');

var Client = require('node-rest-client').Client;

const kenyanCounties = require('./src/assets/counties.js');
const options = require('./env.js');
const config = require('./dbconnect.js');
const register = require('./src/register.js');
const account = require('./src/account.js');
const reset = require('./src/reset.js');
const validateId = require('./src/validateId.js');
const AfricasTalking = require('africastalking')(options);

const generateRandom4DigitNumber = require('./src/generateRandom4DigitNumber.js');
const app = express();

const keyword = "Test4 ";

app.use(session({
    secret: 'mysecret',
    resave: false,
    saveUninitialized: true
}));
const bodyParser = require("body-parser");
const { urlencoded } = require("express");
app.use(bodyParser.json());
app.listen(3000, function() {
    console.log("Started at localhost 3000");
});


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


let isRegistering = false;
let registrationStep = 0;
let isDeleting=false;
let deletingStep=0;
let isCheckingAccount=false;
let accountStep=0;
let ResetingPassword=false;
let resetStep=0
let user={};
// let phoneNumberVerified = false
let rate;
const registrationInputs = [];//Array for user inputs
let generatedPin; ///generated pin



app.post("/webhook", (req, res) => {
    const payload = req.body;
    const sender = payload.from;
    console.log(sender);
    const textMessage = payload.text;
    console.log(textMessage);
    const sms = AfricasTalking.SMS;
    let messageToCustomer;
    

    const text = textMessage.replace(keyword, '').trim();//remove "Key Word"
   
    console.log(text);
    if(!isRegistering && !isDeleting && !isCheckingAccount && !ResetingPassword){
        switch (text.toLowerCase()) {
            // case '':
            case 'register':
                
                //reset isRegistering flag and registrationStep
                isRegistering = false;
                registrationStep = 0;
                //generate  pin
                
                 generatedPin = generateRandom4DigitNumber();
                   
                sms.send(register.newCustomer(sender));
                sms.send(register.enterId(sender));
                //set a flag to indicate that the user is in the process of registering
                isRegistering = true;
                
                //request for ID number
                registrationStep = 2;
                break;
    
            case 'balance':
                messageToCustomer = 'Hello Our Dear Esteemed Customer, Welcome to Octagon Services. Enter your 4 digit pin - balance ';
                sms.send({
                    to: sender,
                    from:'20880',
                    message: messageToCustomer
                });
                break;
            case 'statement':
                messageToCustomer = 'Hello Our Dear Esteemed Customer, Welcome to Octagon Services. Enter your 4 digit pin - statement';
                sms.send({
                    to: sender,
                    from:'20880',
                    message: messageToCustomer
                });
                break;
                case 'deposit':
                    messageToCustomer = 'Hello Our Dear Esteemed Customer, Welcome to Octagon Services. Enter your 4 digit pin - deposit';
                    sms.send({
                        to: sender,
                        from:'20880',
                        message: messageToCustomer
                    });
                    break;
                case 'claims':
                    messageToCustomer = 'Hello Our Dear Esteemed Customer, Welcome to Octagon Services. Enter your 4 digit pin - claims';
                    sms.send({
                        to: sender,
                        from:'20880',
                        message: messageToCustomer
                    });
                    break;
                case 'products':
                    messageToCustomer = 'Hello Our Dear Esteemed Customer, Welcome to Octagon Services. Enter your 4 digit pin - products';
                    sms.send({
                        to: sender,
                        from:'20880',
                        message: messageToCustomer
                    });
                    break;
                case 'accounts':
                    isCheckingAccount=false;
                    accountStep=0;
                    sms.send(account.welcomeMessageAccount(sender));
                    sms.send(account.provideUserName(sender));
                    isCheckingAccount=true;
                    accountStep=2;
                    break;
                case 'rate':
                    messageToCustomer = 'Hello Our Dear Esteemed Customer, Welcome to Octagon Services. Enter your 4 digit pin - rate';
                    sms.send({
                        to: sender,
                        from:'20880',
                        message: messageToCustomer
                    });
                    
                    break;
                case 'delete':
                    isDeleting=false;
                    deletingStep=0;
                    messageToCustomer = 'Hello Our Dear Esteemed Customer, Welcome to Octagon Services.';
                    
                    sms.send({
                        to: sender,
                        from:'20880',
                        message: messageToCustomer
                    });
                   
                    sms.send(register.enterId(sender));
                    isDeleting =true;
                    deletingStep=2;
                    break;
                case 'reset':
                    ResetingPassword=false;
                    resetStep=0;
                    sms.send(reset.welcomeMessage(sender));
                    sms.send(reset.enterEmail(sender));
                    ResetingPassword=true;
                    resetStep=2;
                    
                    break;
                default:
                    messageToCustomer = 'Welcome To Octagon Africa you can access our services by sending the word register,save, balance,statement,products';
                    sms.send({
                        to: sender,
                        from:'20880',
                        message: messageToCustomer
                    });
                    break;
            }
        }else if(isRegistering) {
            switch (registrationStep) {
                case 1:
                    // request for ID number  
                    sms.send(register.enterId(sender));
                    registrationStep = 2;
                    break;
                case 2:
                    // process ID number and request for county
                    if(validateId(text)) {
                        user = user ? {...user, id: text} : {id: text};  
                                    
                        sms.send(register.enterEmail(sender));
                        registrationStep = 3;
                    } else {
                        
                        messageToCustomer = "Invalid ID number. Please enter a valid 6-digit ID number";
                        registrationStep = 1;
                    }
  
                    break;
                case 3:
                    //request 6 character password
                    user.email=text
                               
                    sms.send(register.enterPassword(sender));
                    registrationStep = 4;
                    break;
                case 4:
                    //request for fname
                    user.password=text;
                    //validate password
                                 
                    sms.send(register.enterFirstName(sender));
                    registrationStep = 5;
                    break;
                case 5:
                    //request for lname
                    user.firstname=text;             
                    sms.send(register.enterLastName(sender));
                    registrationStep = 6;
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
                default:
                    // do sthg
                    sms.send({
                        to: sender,
                        from:'20880',
                        message: "Invalid response:!!"
                    });
                    break;
            }
        }else if(isDeleting){
            switch(deletingStep){
                case 1:
                    // request for ID number  
                    sms.send(register.enterId(sender));
                    deletingStep = 2;
                    break;
                case 2:
                    //recieve id and request password
                    user = user ? {...user, id: text} : {id: text}; 
                    sms.send({
                        to: sender,
                        from:'20880',
                        message: "Enter Password"
                    });
                    deletingStep=3;
                   
                    break;

                case 3:
                    user.password=text;
                     // Sending the request to octagon Delete User Account  API
                     var deleteClient = new Client();
                     // set content-type header and data as json in args parameter
                     var args = {
                         data: { ID: user.id, password: user.password },
                         headers: { "Content-Type": "application/json" }
                     };
                         // username= data[0]+"."+data[1];
                     // Actual Octagon Delete User Account API
                     deleteClient.post("https://api.octagonafrica.com/v1/user/delete", args, function (data, response) {
                        // parsed response body as js object
                        console.log(data);
                        // raw response
                    
                     
                        if ([200].includes(response.statusCode)) {
                                    // success code
                                    sms.send({
                                    to: sender,
                                    from:'20880',
                                    message: "Account Deleted Successfully. It was a pleasure doing Business with you"
                                    });
                                    deletingStep=0;
                                    isDeleting=false;
                                    user = {};
                                    console.log(response.statusCode)
                            
                                } else if ([201].includes(response.statusCode)) {
                                    console.log(response.statusCode);
                                } else if ([400].includes(response.statusCode)) {
                                    console.log(response.statusCode);
                                    sms.send({
                                        to: sender,
                                        from:'20880',
                                        message: " Invalid Details!!. Check your details and please try again Later "
                                    });
                                } else if ([500].includes(response.statusCode)) { 
                                    console.log(response.statusCode);
                                    sms.send({
                                        to: sender,
                                        from:'20880',
                                        message: " Invalid request. Please input your National Id and password. "
                                    });
                                } else {
                                    // error code
                                    console.log(response.statusCode);
                                }
                            });
                            
                            break;

                        default:
                            // do sthg
                            sms.send({
                                to: sender,
                                from:'20880',
                                message: "Invalid response:!!"
                            });
                            break;
                            
                }
        }else if(isCheckingAccount){
                switch(accountStep){
                    case 1:
                        //request username
                        sms.send(account.provideUserName(sender));
                        accountStep = 2;
                    break;
                    case 2:
                        //request password
                        user.username=text;
                        sms.send(account.providePassword(sender));  
                        accountStep =3;
                    break;
                    case 3:
                        user.password=text;
                        //send to octagon Login API
                        //confirm login
                        var accountsClient = new Client();
                        // set content-type header and data as json in args parameter
                        var args = {
                            data: { username: user.username, password: user.password },
                            headers: { "Content-Type": "application/json" }
                        };
                          
                        accountsClient.post("https://api.octagonafrica.com/v1/login", args, function (data, response) {                        
                        if ([200].includes(response.statusCode)) {
                            // success code
                            sms.send(account.confirmLogin(sender));  
                            accountStep=4;
                            
                            var accountIDClient = new Client();
                            var args = {
                            data: { identifier: user.username },
                            headers: { "Content-Type": "application/json" }
                            };
                            accountIDClient.get("https://api.octagonafrica.com/v1/accountsid", args, function (data, response) {
                            if (response.statusCode === 200) {
                                const ID = data.data;
                                console.log(ID);
                                        var fetchClient = new Client();
                                    // set content-type header and data as json in args parameter
                                    var args = {
                                        data: { user_id:ID },
                                        headers: { "Content-Type": "application/json" }
                                    };
                                    fetchClient.get("https://api.octagonafrica.com/v1/accounts", args, function (data, response) {

                                    if ([200].includes(response.statusCode)) {
                                        // success code
                                            console.log(response.statusCode)
                                            
                                            const insurance = data.insurance;
                                            const pension = data.pension;
                                            const trust = data.trust;
                                            // const totalAccounts = insurance.total_accounts;
                                            const totalAccountsInsurance = insurance.total_accounts;
                                            const insuranceData = insurance.data;
                                            const totalAccountsPension = pension.total_accounts;
                                            const pensionData = pension.data;

                                            let insuranceMessage = "";
                                            for (let i = 0; i < totalAccountsInsurance; i++) {
                                                insuranceMessage += " Insurance Account Description: " + insuranceData[i].Code + " Name: " + insuranceData[i].Description + " .Active Since: " + insuranceData[i].dateFrom + ".\n";
                                                console.log("Account Description:", insuranceData[i].Code, "Name: ", insuranceData[i].Description, ". Active Since: ", insuranceData[i].dateFrom);
                                            }
                                            let pensionMessage = "";
                                            for (let i = 0; i < totalAccountsPension; i++) {
                                                pensionMessage += " Pension Account Description: " + pensionData[i].Code + " Name: " + pensionData[i].scheme_name + " .Active Since: " + pensionData[i].dateFrom + ".\n";
                                                console.log("Account Description:", pensionData[i].Code, "Name: ", pensionData[i].scheme_name, ".Active Since: ", pensionData[i].dateFrom);
                                            }

                                            const finalMessage = insuranceMessage + pensionMessage;

                                            sms.send({
                                                to: sender,
                                                from: '20880',
                                                message: finalMessage
                                            });
                                    
                                } else if ([400].includes(response.statusCode)) {
                                    console.log(response.statusCode);
                                } else {
                                    // error code
                                    console.log(response.statusCode);
                                }
                                });
                            } else if (response.statusCode === 400) {
                                console.log(response.statusCode);
                            } else {
                                console.error(response.statusCode, data);
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
                           message: " Invalid request. Please input your National Id and password. "
                       });
                   } else {
                       // error code
                       console.log(response.statusCode);
                   }
                });
               
            break;
            case 4:
                

            break;
            default:
                // do sthg
                sms.send(account.wrongResponse(sender));
            break;

        }

        }else if (ResetingPassword){
            switch(resetStep){
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
    
    
        console.log(registrationInputs);
            res.send("Webhook received");
});       

    
       



