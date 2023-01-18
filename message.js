const express = require("express");
const app = express();

     const options = {
    apiKey: 'b3aa70ace9f3c5e9458fac4ce13affa4854b810be6f500a866784d01fc74a7d4', // use your sandbox app API key for development in the test environment
    username: 'sandbox', // use ‘sandbox’ for development in the test environment
    };
    const AfricasTalking = require('africastalking')(options);


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

        app.post("/incoming", (req,res) => {
            //Define the service needed (SMS)
        const sms = AfricasTalking.SMS;
        // all methods return a promise
            // handle the incoming message here
            // Extract the phone number and message text
            const phoneNumber = req.body.from;
            const messageText = req.body.text;

            console.log(phoneNumber);

            // Do something with the message
            // if (messageText === 'register') {
            //     // Save the customer's phone number and m
            //     // Send a reply to the customer
            //     sms.send({
            //         to: phoneNumber, 
            //         from:'65615',
            //         message: 'Thanks for registering! Your credentials are: Username - '+generateUsername()+' Pin-'+generateRandom4DigitNumber()});
            // } else {
            //     // Send a reply to the customer
            //     sms.send({to: phoneNumber,
            //         from:'65615',
            //         message: 'Welcome to Octagon Africa! You can access our services by sending the word "register", "save", "balance", "statement".'});
            // }
        });
        app.listen(3000, function() {
            console.log("Started at localhost 3000");
            });
