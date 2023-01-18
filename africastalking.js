const express = require("express");
const app = express();
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

let userID;
//diving deeper into the switch
app.post("/webhook", (req, res) => {
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
    let messageToCustomer;
    switch (textMessage.toLowerCase()) {
        case 'register':
            messageToCustomer = 'Hello Our Esteemed Customer, Welcome to Octagon Africa your credentials are: Username -' + generateUsername() + ' Pin- ' + generateRandom4DigitNumber() + '. Enter your National Identity number';
            // Send the message prompt
            const sms = AfricasTalking.SMS;
            sms.send({
                to: sender,
                message: "Please enter your ID number:"
            });
            break;
        default:
            function validateIDNumber(userID) {
                // Check if the ID number is 6 digits long
                if (userID.length !== 6) {
                    return false;
                }
                // check if it's only number
                const idRegex = /^[0-9]{6}$/;
                if (!idRegex.test(id)) {
                    return false;
                }
                // If all checks pass, return true
                return true;
            }
            if (validateIDNumber(textMessage)) {
                userID = textMessage;
                
            
                messageToCustomer = "Thank you for providing your ID number. Please enter your county.";
            } else {
                messageToCustomer = "Sorry, that is not a valid ID number. Please enter your ID number.";
            }

































            app.post("/webhook", (req, res) => {
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
                let messageToCustomer;
                let isRegistering = false;
                switch (textMessage.toLowerCase()) {
                    case 'register':
                        messageToCustomer = 'Hello Our Esteemed Customer, Welcome to Octagon Africa your credentials are: Username -' + generateUsername() + ' Pin- ' + generateRandom4DigitNumber() + '. Enter your National Identity number';
                        // Send the message prompt
                        const sms = AfricasTalking.SMS;
                        sms.send({
                            to: sender,
                            message: "Please enter your ID number:"
                        });
                        // Set a flag to indicate that the user is in the registration process
                        isRegistering = true;
                        break;
                    default:
                        if (isRegistering) {
                            // Check if the text message is a valid ID number
                            if (validateIDNumber(textMessage)) {
                                messageToCustomer = "Thank you for providing your ID number. Please enter your county.";
                            } else {
                                messageToCustomer = "Sorry, that is not a valid ID number. Please enter your ID number.";
                            }
                            sms.send({
                                to: sender,
                                message: messageToCustomer
                            });
                        } else {
                            switch (textMessage.toLowerCase()) {
                                case 'balance':
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
                               
            