const express = require("express");
const session = require('express-session');
const _ = require('lodash');

//Example POST method invocation
var Client = require('node-rest-client').Client;

const kenyanCounties = require('./src/assets/counties.js');
const options = require('./env.js');
const register = require('./src/register.js');

const validateId = require('./src/validateId.js');
const AfricasTalking = require('africastalking')(options);

const generateRandom4DigitNumber = require('./src/generateRandom4DigitNumber.js');
const app = express();

const keyword = /^test4/;

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
let user;
let phoneNumberVerified = false
let rate;
const registrationInputs = [];//Array for user inputs
let generatedPin; ///generated pin


app.post("/webhook", (req, res) => {
    const payload = req.body;
    console.log(payload);
    console.log(isDeleting);
    const sender = payload.from;
    console.log(sender);
    const textMessage = payload.text;
    console.log(textMessage);
    const sms = AfricasTalking.SMS;
    let messageToCustomer;

    const text = textMessage.toLowerCase().replace(keyword, '').trim();
   


    if(!isRegistering || !isDeleting){
        switch (text) {
            case '':
            case 'register':
                
                //reset isRegistering flag and registrationStep
                isRegistering = false;
                registrationStep = 0;
                //generate  pin
                
                 generatedPin = generateRandom4DigitNumber();
                registrationInputs.push(sender);
                  
                messageToCustomer = 'Hello Our Esteemed Customer, Welcome to Octagon Africa. To complete the registration process, please provide us with the following information  ';
                sms.send({
                    to: sender,
                    from:'20880',
                    message: messageToCustomer
                });

                registrationInputs.push(generatedPin);
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
    
                    messageToCustomer = 'Hello Our Dear Esteemed Customer, Welcome to Octagon Services. Enter your 4 digit pin - accounts';
                    sms.send({
                        to: sender,
                        from:'20880',
                        message: messageToCustomer
                    });
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
                default:
                    messageToCustomer = 'Welcome To Octagon Africa you can access our services by sending the word register,save, balance,statement,products';
                    sms.send({
                        to: sender,
                        from:'20880',
                        message: messageToCustomer
                    });
                    break;
            }
    }
    
        //check if the user is in the process of registering
      else if(isRegistering) {
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
                        registrationInputs.push(user.id);              
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
                    registrationInputs.push(user.email);              
                    sms.send(register.enterPassword(sender));
                    registrationStep = 4;
                    break;

                case 4:
                    //request for fname
                    user.password=text;
                    //validate password
                    registrationInputs.push(user.password);              
                    sms.send(register.enterFirstName(sender));
                    registrationStep = 5;
                    break;
                case 5:
                    //request for lname
                    user.firstname=text;
                   
                    registrationInputs.push(user.firstname);              
                    sms.send(register.enterLastName(sender));
                    registrationStep = 6;
                    break;
                case 6:
                    // process full name and send confirmation message
                    user.lastname=text;
                    
                    registrationInputs.push(user.lastname); 
                       
                        // Sending the request to octagon registration API
                        var client = new Client();
                        // set content-type header and data as json in args parameter
                        var args = {
                            data: { firstname: user.firstname, lastname: user.lastname, ID: user.id, email: user.email, password: user.password, phone_number: sender },
                            headers: { "Content-Type": "application/json" }
                        };
                            // username= data[0]+"."+data[1];
                        // Actual Octagon user registration API
                        client.post("https://api.octagonafrica.com/v1/register", args, function (data, response) {
                            // parsed response body as js object
                            console.log(data);
                            // raw response
                            console.log(response);
                           

                            if ([200].includes(response.statusCode)) {
                                // success code
                                sms.send({
                                    to: sender,
                                    from:'20880',
                                    message: "Congratulations!! "+user.firstname.toUpperCase() + " "+ user.lastname.toUpperCase() +". You have successfully registered with Octagon Africa. Your credentials are: username: " + user.firstname+"."+user.lastname + " Password: " + user.password

                                    
                                });
                                isRegistering = false;
                                registrationStep = 0;
                                user = {};
                                
                                console.log(response.statusCode)
                                
                            } else if ([201].includes(response.statusCode)) {
                                console.log(response.statusCode);
                            }else if ([400].includes(response.statusCode)) {
                                console.log(response.statusCode);
                                sms.send({
                                    to: sender,
                                    from:'20880',
                                    message: "Registration unsuccesfull. Invalid Details or Username Existsnpm . Please try again Later "

                                    
                                });
                            }else if ([500].includes(response.statusCode)) {
                                console.log(response.statusCode);
                                sms.send({
                                    to: sender,
                                    from:'20880',
                                    message: "Registration unsuccesfull. Internal Server Error. Please try again Later "

                                    
                                });
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
                    registrationStep = 2;
                    break;
                case 2:
                    //recieve id and request password
                    user.id=text;
                    sms.send({
                        to: sender,
                        from:'20880',
                        message: "Enter Password"
                    });
                    deletingStep=3;
                   
                    break;
                case 3:
                    user.password=text;
                    sms.send({
                        to: sender,
                        from:'20880',
                        message: "Account Deleted Successfully. It was a pleasure doing Business with you"
                    });
                    deletingStep=0;
                    isDeleting;
                    user = {};
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
              
                      


                   
        
    }
      
        
            res.send("Webhook received");
});       

    
       


