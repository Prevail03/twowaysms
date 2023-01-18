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


var messageToCustomer;
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
    
    switch (textMessage.toLowerCase()) {
        case 'register':
            messageToCustomer = 'Hello Our Esteemed Customer, Welcome to Octagon Africa your credentials are: Username -' + generateUsername() + ' Pin- ' + generateRandom4DigitNumber() + '. Enter your National Identity number';
           
            break;
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
        default:
            messageToCustomer = 'Welcome To Octagon africa you can access our services by sending the word register,save, balance,statement,products';
            break;
    }
    
    // ...
    // Send a response back to the sender
    if(sender){
        const sms = AfricasTalking.SMS;
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
// const id=textMessage;
        // function isValidID(id) {
        //     // The ID number should be 8 or 10 characters long
        //     if (id.length !== 8 && id.length !== 10) {
        //         return false;
        //     }
        //     // The first 6 characters should be digits
        //     for (let i = 0; i < 6; i++) {
        //         if (!/^\d+$/.test(id[i])) {
        //             return false;
        //         }
        //     }
        //     // The 7th character should be a letter
        //     if (!/^[a-zA-Z]+$/.test(id[6])) {
        //         return false;
        //     }       
        //     // The 8th character should be a digit
        //     if (!/^\d+$/.test(id[7])) {
        //         return false;
        //     }
        
        //     // If the ID is 10 characters long, the last 2 characters should be letters
        //     if (id.length === 10) {
        //         if (!/^[a-zA-Z]+$/.test(id[8]) || !/^[a-zA-Z]+$/.test(id[9])) {
        //             return false;
        //         }
        //     }
        
        //     return true;
        // }
        // if(id=true){
            

        // }
