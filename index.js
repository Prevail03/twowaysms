const express = require("express");
const session = require('express-session');
const kenyanCounties = require('./src/assets/counties.js');
const options = require('./env.js');
const register = require('./src/register.js');
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
let rate;

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

    switch (text) {
        case '':
        case 'register':
            //reset isRegistering flag and registrationStep
            isRegistering = false;
            registrationStep = 0;
            //generate username and pin

            sms.send(register(sender))
            // user = {
            //     pin: generateRandom4DigitNumber()
            // };
            // //send message with credentials
            // messageToCustomer = 'Hello Our Esteemed Customer, Welcome to Octagon Africa your credentials are: Username - ' +sender + ' Pin- ' + user.pin + '.';
            // sms.send({
            //     to: sender,
            //     from:'20880',
            //     message: messageToCustomer
            // });
            

            //set a flag to indicate that the user is in the process of registering
            isRegistering = true;
            
            //request for ID number
            registrationStep = 1;
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
        //check if the user is in the process of registering
        if (isRegistering) {
            switch (registrationStep) {
                case 1:
                    // request for ID number
                    sms.send({
                        to: sender,
                        from:'20880',
                        message: "Please enter your ID number:"
                    });
                    registrationStep = 2;
                    break;
                case 2:
                    // process ID number and request for county
                    user.id = textMessage;
                    if(textMessage.length !== 6 || isNaN(textMessage)) {
                        messageToCustomer = "Invalid ID number. Please enter a valid 6-digit ID number";
                    } else {
                        user.id = textMessage;                  
                        messageToCustomer = "ID number verified. Please enter your county: ";
                        sms.send({
                            to: sender,
                            from:'20880',
                            message: messageToCustomer
                        });
                        registrationStep = 3;
                    }
                    
                    
                    break;
                case 3:
                    // process county and request for full name
                    if (kenyanCounties.includes(textMessage.toLowerCase())) {
                        user.county = textMessage;
                        sms.send({
                            to: sender,
                            from:'20880',
                            message: "Please enter your full name:"
                        });
                        registrationStep = 4;
                    }else {
                        sms.send({
                            to: sender,
                            from: '20880',
                            message: "Invalid county. Please enter a valid county of residence in Kenya."
                        });
                    }
                    break;
                case 4:
                    // process full name and send confirmation message
                    user.name = textMessage;
                    sms.send({
                        to: sender,
                        from:'20880',
                        message: "Congratulations!! "+user.name+". You have successfully registered with Octagon Africa. Your credentials are: username: " + sender + " pin: " + user.pin
                    });
                    isRegistering = false;
                    registrationStep = 0;
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

    
       


