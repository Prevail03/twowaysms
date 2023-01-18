 
 const express = require("express");
 const app = express();
 
 const bodyParser = require("body-parser");
 app.use(bodyParser.json());
 
 app.listen(3000, function() {
     console.log("Started at localhost 3000");
 });

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
  
  
 
  //listen to traffic on 3000
 
    app.post("/webhook", (req,res) => {
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
    // ...
    // Send a response back to Africa's Talking
    res.send("Webhook received");  
        
      if(!sender){
        console.log("Please provide a valid phone number to send the message to")
        return;
    }
      
        //Define the service needed (SMS)
        const sms = AfricasTalking.SMS;
       // all methods return a promise
       
       
      
        if (textMessage ==='register'){

          messageToCustomer='Hello Our Esteemed Customer, Welcome to Octagon Africa your credentials are: Username -'+generateUsername()+' Pin- '+generateRandom4DigitNumber()+'. Enter your National Identity number'

        }else{
            messageToCustomer="Welcome To Octagon africa you can access our services by sending the word register,save, balance,statement,";
        }
        const opts = {
            //get phone number from AT
            //save the number
            //if statements in the braces.
            //Keyword
        to: sender,
        from: '65615',
        message: messageToCustomer,
        }; //Configure options for message sending
        console.log(opts);
        sms.send(opts)
        .then(function(success) {
        console.log(success);
        console.log("Good Job Success");
        })
        .catch(function(error) {
        console.log(error);
        }); //Actually send the message


        });    
//webhook:   https://c273-197-254-120-202.eu.ngrok.io/webhook