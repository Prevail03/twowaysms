//sending everything in the switch
const express = require("express");
const session = require('express-session'); //toimport middleeware
const app = express();
//unset variable
app.use(session({
    secret: 'mysecret',
    resave: false,
    saveUninitialized: true
}));
const bodyParser = require("body-parser");

// use the json middleware to parse json payloads
app.use(bodyParser.json());

app.listen(3000, function() {
    console.log("Started at localhost 3000");
});

const options = {
    apiKey: 'b3aa70ace9f3c5e9458fac4ce13affa4854b810be6f500a866784d01fc74a7d4',
    username: 'sandbox',
};
const AfricasTalking = require('africastalking')(options);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//generate password and username
function generateRandom4DigitNumber() {
    return Math.floor(1000 + Math.random() * 9000);
}
const adjectives = ['happy', 'exciting', 'courageous', 'loving', 'funny'];
const nouns = ['dog', 'cat', 'tree', 'ocean', 'flower'];

function generateUsername() {
    let adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    let noun = nouns[Math.floor(Math.random() * nouns.length)];
    return adjective + noun;
}


let userID; //in number
let userName; // name
let isRegistering = false;

app.post("/webhook", (req, res) => {
    //reset isregistering
    req.session.user = null;
    // Extract the payload from the request body
    const payload = req.body;
    console.log(payload);
    // Extract the phone number of the sender
    const sender = payload.from;
    console.log("Sender: ", sender);
    // Extract the message text
    const textMessage = payload.text;
    console.log("Message: ", textMessage);
    // Extract the message timestamp
    const timestamp = payload.date;
    console.log("Timestamp: ", timestamp);
    // Do something with the information
    //message to customer variable declaration
    const sms = AfricasTalking.SMS;
    let messageToCustomer;
    const kenyanCounties = ['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret',
        'Machakos', 'Meru', 'Thika', 'Kitui', 'Garissa', 'Embu', 'Kiambu', 'Murang’a',
        'Nyeri', 'Kirinyaga', 'Bungoma', 'Busia', 'Vihiga', 'Trans-Nzoia', 'Uasin Gishu',
        'Turkana', 'Nandi', 'West Pokot', 'Samburu', 'Siaya', 'Migori', 'Homa Bay', 
        'Kakamega', 'Kericho', 'Kisii', 'Laikipia', 'Lamu', 'Narok', 'Nyamira',
        'Nyandarua', 'Nairobi City'];
    

    switch (textMessage.toLowerCase()) {
        case 'register':
            messageToCustomer = 'Hello Our Esteemed Customer, Welcome to Octagon Africa your credentials are: Username -' + generateUsername() + ' Pin- ' + generateRandom4DigitNumber() + '.';//i want to send this message then after that request for ID
           sms.send({
                to: sender,
                from:'65615',
                message: "Please enter your ID number:"// request ID then request for county then name and then congratulate them for registering.
            });
            //set a flag to indicate that the user is in the process of registering
            isRegistering = true;
            break;
        case 'balance': //dont leaave out the rest of the switch
            messageToCustomer = 'Hello Our Dear Esteemed Customer, Welcome to Octagon Services. Enter your 4 digit pin - balance ';
            break;
        case 'statement':
            messageToCustomer = 'Hello Our Dear Esteemed Customer, Welcome to Octagon Services. Enter your 4 digit pin - statement';
            break;
        case 'deposit':
            messageToCustomer = 'Hello Our Dear Esteemed Customer, Welcome to Octagon Services. Enter your 4 digit pin - deposit';
            break;
        case 'claims':
            messageToCustomer = 'Hello Our Dear Esteemed Customer, Welcome to Octagon Services. Enter your 4 digit pin - claims';
            break;
        case 'products':
            messageToCustomer = 'Hello Our Dear Esteemed Customer, Welcome to Octagon Services. Enter your 4 digit pin - products';
            break;
        case 'accounts':
            messageToCustomer = 'Hello Our Dear Esteemed Customer, Welcome to Octagon Services. Enter your 4 digit pin - accounts';
            break;
        case 'rate':
            messageToCustomer = 'Hello Our Dear Esteemed Customer, Welcome to Octagon Services. Enter your 4 digit pin - rate';
            break;
        default:
            messageToCustomer = 'Welcome To Octagon africa you can access our services by sending the word register,save, balance,statement,products';
            break;
    }
    // ...
    // Send a response back to the sender
    if(isRegistering) {
        //verify user's ID number
        if(textMessage.length !== 6 || isNaN(textMessage)) {
            messageToCustomer = "Invalid ID number. Please enter a valid 6-digit ID number";
        } else {
            userID = textMessage;
            messageToCustomer = "ID number verified. Please enter your county: ";
        }
        //verify user's county
        if(userID && !isNaN(userID)) {
            if (kenyanCounties.includes(textMessage>toLowerCase())) {
                messageToCustomer = "County verified. Please enter your name: ";///not requesting this. m not able to get this response.
            }else{
                messageToCustomer = "Invalid County.Please enter a valid Kenyan county";
            }
        }
        //verify user's name
        if(userID && !isNaN(userID) && kenyanCounties.includes(textMessage.toLowerCase())){
            userName = textMessage;
            messageToCustomer = "Registration Successful. Welcome " + userName + " to Octagon Africa. Thank you for choosing us.";
            isRegistering = false; //reset the flag
        }
    }

    if(sender){
       
        const opts = {
            to: sender,
            from:'65615',
            message: messageToCustomer
        };
        sms.send(opts)
        .then(function(success) {
            console.log(success);
        })
        .catch(function(error) {
            console.log(error);
        });
    }else{
        console.log("Please provide a valid phone number to send the message to")
    }
    // Send a response back to Africa's Talking
    res.send("Webhook received");
});
