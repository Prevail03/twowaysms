const express = require("express");
const sql = require('mssql');
const session = require('express-session');
const MemoryStore = require('memorystore')(session);
var Client = require('node-rest-client').Client;
const options = require('./env.js');
const config = require('./dbconnect.js');
const register = require('./src/register.js');
const account = require('./src/account.js');
const reset = require('./src/reset.js');
const validateId = require('./src/validateId.js');
const AfricasTalking = require('africastalking')(options);
const app = express();
const keyword = "Test4 ";
app.use(session({
    cookie: { maxAge: 86400000 },
    store: new MemoryStore({
        checkPeriod: 86400000 // prune expired entries every 24h
    }),
    secret: 'octagonafrica',
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

app.post("/webhook", (req, res) => {
    const payload = req.body;
    console.log(payload);
    const sender = payload.from;
    const textId =payload.id;
    const phoneNumber=sender;
    const isActive=1;
    console.log(sender);
    const textMessage = payload.text;
    console.log(textMessage);
    const sms = AfricasTalking.SMS;
    let messageToCustomer;    
    const text = textMessage.replace(keyword, '').trim();//remove "Key Word" 
    const time = new Date();
    let status = '';
    let messagingStep = '';

    function handleIncomingMessage(text, sender) {
        // Check if user exists in database
        const checkIfExistsQuery = "SELECT TOP 1 * FROM two_way_sms_tb WHERE phoneNumber = @phoneNumber AND isActive = 1";
        const checkIfExistsRequest = new sql.Request(connection);
        checkIfExistsRequest.input('phoneNumber', sql.VarChar, sender);
        checkIfExistsRequest.query(checkIfExistsQuery, function(checkErr, checkResults) {
          if (checkErr) {
            console.error('Error executing checkIfExistsQuery: ' + checkErr.stack);
            sql.close();
            return;
          }
          if (checkResults.recordset.length > 0) {
            console.log('User already exists');
            const status = checkResults.recordset[0].status;
            const messagingStep = checkResults.recordset[0].messagingStep;
            switch (status) {
              case 'isRegistering':
                handleRegister(text, sender, messagingStep);
                break;
              case 'isDeleting':
                handleDelete(text, sender, messagingStep);
                break;
              case 'isCheckingAccount':
                handleAccountCheck(text, sender, messagingStep);
                break;
              case 'ResetingPassword':
                handlePasswordReset(text, sender, messagingStep);
                break;
              default:
                console.log('Unknown status: ' + status);
                break;
            }
            } else {
                //new user in the system
                const insertQuery = "INSERT INTO two_way_sms_tb (text, text_id_AT, phoneNumber, isActive, time) VALUES (@text, @text_id_AT, @phoneNumber, @isActive, @time)";

                const insertRequest = new sql.Request(connection);
                insertRequest.input('text', sql.VarChar, text);
                insertRequest.input('text_id_AT', sql.VarChar, textId);
                insertRequest.input('phoneNumber', sql.VarChar, phoneNumber);
                insertRequest.input('isActive', sql.Bit, 1);
                insertRequest.input('time', sql.DateTime2, time);
                insertRequest.query(insertQuery, function(insertErr, insertResults) {
                    if (insertErr) {
                    console.error('Error executing insertQuery: ' + insertErr.stack);
                    sql.close();
                    return;
                    }
                    console.log('INSERT successful');
                        switch (text.toLowerCase()) {
                            // case '':
                            case 'register':
                                //reset isRegistering flag and registrationStep
                                isRegistering = false;
                                registrationStep = 0;
                                sms.send(register.newCustomer(sender));
                                sms.send(register.enterId(sender));
                                //set a flag to indicate that the user is in the process of registering
                                isRegistering = true;         
                                //request for ID number
                                registrationStep = 2;
                                const status = "isRegistering";
                                const phoneNumber = sender;
                                const messagingStep= "2";
                                sql.connect(config, function(err) {
                                    const request = new sql.Request();
                                    const updateRegister1 = `UPDATE two_way_sms_tb SET status = @status, messagingStep = @messagingStep WHERE phoneNumber = @phoneNumber AND time = (
                                        SELECT MAX(time) FROM two_way_sms_tb WHERE phoneNumber = @phoneNumber )`;
                                    request.input('status', sql.VarChar, status);
                                    request.input('messagingStep', sql.VarChar, messagingStep);
                                    request.input('phoneNumber', sql.VarChar, phoneNumber);
                                    request.query(updateRegister1, function(err, results) {
                                        if (err) {
                                        console.error('Error executing query: ' + err.stack);
                                        return;
                                        }
                                        console.log('UPDATE successful');
                                        sql.close();
                                    });
                                    });
                                break;
                                ///other Cases
                                // case 'balance':
                                // messageToCustomer = 'Hello Our Dear Esteemed Customer, Welcome to Octagon Services. Enter your 4 digit pin - balance ';
                                // sms.send({
                                //     to: sender,
                                //     from:'20880',
                                //     message: messageToCustomer
                                // });
                                // break;
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
                });
            }
        });

           
    }
      
      function handleRegister(text, sender, messagingStep) {
        switch (messagingStep) {
          case '1':
            // Handle step 1 of registration process
            break;
          case '2':

            // Handle step 2 of registration process
            break;
          // ...
          default:
            console.log('Unknown registration step: ' + messagingStep);
            break;
        }
      }
      
      function handleDelete(text, sender, messagingStep) {
        switch (messagingStep) {
          case '1':
            // Handle step 1 of delete process
            break;
          case '2':
            // Handle step 2 of delete process
            break;
          // ...
          default:
            console.log('Unknown delete step: ' + messagingStep);
            break;
        }
      }
      
      function handleAccountCheck(text, sender, messagingStep) {
        switch (messagingStep) {
          case '1':
            // Handle step 1 of account check process
            break;
          case '2':
            // Handle step 2 of account check process
            break;
          // ...
          default:
            console.log('Unknown account check step: ' + messagingStep);
            break;
        }
      }
      
      function handlePasswordReset(text, sender, messagingStep) {
        switch (messagingStep) {
          case '1':
            // Handle step 1 of password reset process
            break;
          case '2':
            // Handle step 2 of password reset process
            break;
          // ...
          default:
            console.log('Unknown password reset step: ' + messagingStep);
            break;
        }
      }
      
    
        res.send("Webhook received");
});   