const express = require("express");
const app = express();

const options = {
    apiKey: 'YOUR_API_KEY_GOES_HERE', // use your sandbox app API key for development in the test environment
    username: 'sandbox', // use ‘sandbox’ for development in the test environment
    };
    const AfricasTalking = require('africastalking')(options);

    app.post("/webhook", (req,res) => {
        //Define the service needed (SMS)
        const sms = AfricasTalking.SMS;
        // all methods return a promise

        const opts = {
        to: '+254701694441',
        from: '65615',
        message: 'my reply',
        }; //Configure options for message sending
        sms.send(opts)
        .then(function(success) {
        console.log(success);
        })
        .catch(function(error) {
        console.log(error);
        }); //Actually send the message
        });
        app.listen(3000, function() {
            console.log("Started at localhost 3000");
        });