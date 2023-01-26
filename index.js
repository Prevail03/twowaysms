const express = require("express");
const session = require('express-session');
//Example POST method invocation
var Client = require('node-rest-client').Client;

const kenyanCounties = require('./src/assets/counties.js');
const options = require('./env.js');
const register = require('./src/register.js');

const sendDataToPHPAPI = require('./src/registrationapi.js');
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
let isRating=false;
let ratingStep=0;
let user;
let phoneNumberVerified = false
let rate;
const registrationInputs = [];//Array for user inputs

app.post("/webhook", (req, res) => {
    const payload = req.body;
    console.log(payload);
    console.log(isRegistering);
    const sender = payload.from;
    console.log(sender);
    const textMessage = payload.text;
    console.log(textMessage);
    const sms = AfricasTalking.SMS;
    let messageToCustomer;

    const text = textMessage.toLowerCase().replace(keyword, '').trim();
   


    if(!isRegistering){
        switch (text) {
            case '':
            case 'register':
                
                //reset isRegistering flag and registrationStep
                isRegistering = false;
                registrationStep = 0;
                //generate username and pin
                user = {
                pin: generateRandom4DigitNumber()
                 };
                registrationInputs.push(sender);
                  
                messageToCustomer = 'Hello Our Esteemed Customer, Welcome to Octagon Africa your credentials are: Username - ' +sender + ' Pin- ' + user.pin + '.';
                sms.send({
                    to: sender,
                    from:'20880',
                    message: messageToCustomer
                });

                registrationInputs.push(user.pin);
                if(phoneNumberVerified){

                }
                else{
                    sms.send(register.enterId(sender));
                    //set a flag to indicate that the user is in the process of registering
                    isRegistering = true;
                    
                    //request for ID number
                    registrationStep = 2;
                }
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
                default:
                    messageToCustomer = 'Welcome To Octagon africa you can access our services by sending the word register,save, balance,statement,products';
                    sms.send({
                        to: sender,
                        from:'20880',
                        message: messageToCustomer
                    });
                    break;
            }
    }
    
        //check if the user is in the process of registering
      else {
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
                        sms.send(register.enterCounty(sender));
                        registrationStep = 3;
                    } else {
                        registrationStep = 1;
                        messageToCustomer = "Invalid ID number. Please enter a valid 6-digit ID number";
                    }
  
                    break;
                case 3:
                    // process county and request for full name
                    if (kenyanCounties.includes(text.toLowerCase())) {
                        user.county = text;
                        registrationInputs.push(user.county);  
                        sms.send(register.enterName(sender));
                        registrationStep = 4;
                    }else {
                        sms.send({
                            to: sender,
                            from: '20880',
                            message: "Invalid county. Please enter a valid county of residence in Kenya."
                        });
                        registrationStep = 3;
                    }
                    break;
                case 4:
                    // process full name and send confirmation message
                    user.name = text;
                    registrationInputs.push(user.name); 
                          
                        // Sending the request to octagon registration API
                        var client = new Client();
                        // set content-type header and data as json in args parameter
                        var args = {
                            data: { pin: generateRandom4DigitNumber(), phoneNumber: sender, id: user.id, county: user.county, name: user.name },
                            headers: { "Content-Type": "application/json" }
                        };

                        // Actual Octagon user registration API
                        client.post("https://prevailor.free.beeceptor.com", args, function (data, response) {
                            // parsed response body as js object
                            console.log(data);
                            // raw response
                            console.log(response);

                            if ((_.contains([200], response.statusCode))) {
                                console.log(JSON.stringify(data));
                                // console.log(response);

                                sms.send({
                                    to: sender,
                                    from:'20880',
                                    message: "Congratulations!! "+user.name+". You have successfully registered with Octagon Africa. Your credentials are: username: " + sender + " pin: " + user.pin
                                });
                                isRegistering = false;
                                registrationStep = 0;
                                user = {};

                            } else if ((_.contains([201], response.statusCode))) {
                                console.log(JSON.stringify(data));
                                // console.log(response);

                            }else if ((_.contains([202], response.statusCode))) {
                                console.log(JSON.stringify(data));
                                // console.log(response);

                            } else{
                                console.log(JSON.stringify(data));
                                // console.log(response);

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
        }
        sendDataToPHPAPI(registrationInputs[0]);
        sendDataToPHPAPI(registrationInputs[1]);
        sendDataToPHPAPI(registrationInputs[2]);
        sendDataToPHPAPI(registrationInputs[3]);
        sendDataToPHPAPI(registrationInputs[4]);
        console.log(registrationInputs);
            res.send("Webhook received");
});       

    
       


