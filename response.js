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

    sql.connect(config, function(err, connection) {
    if (err) {
        console.error('Error connecting to database: ' + err.stack);
        return;
    }
    console.log('Connected to database');
    
    //check if user exists
    const checkIfExistsQuery = "SELECT TOP 1 * FROM two_way_sms_tb WHERE phoneNumber = @phoneNumber AND isActive = 1";
    const checkIfExistsRequest = new sql.Request(connection);
    checkIfExistsRequest.input('phoneNumber', sql.VarChar, phoneNumber);
    checkIfExistsRequest.query(checkIfExistsQuery, function(checkErr, checkResults) {
        if (checkErr) {
        console.error('Error executing checkIfExistsQuery: ' + checkErr.stack);
        sql.close();
        return;
        }
        if (checkResults.recordset.length > 0) {
        console.log('User already exists');
        status = checkResults.recordset[0].status;
        messagingStep = checkResults.recordset[0].messagingStep;
        }
        else {
        //insert user
        const insertQuery = "INSERT INTO two_way_sms_tb (text, text_id_AT, phoneNumber, isActive, time) VALUES (@text, @textId, @phoneNumber, @isActive, @time)";
        const insertRequest = new sql.Request(connection);
        insertRequest.input('text', sql.VarChar, text);
        insertRequest.input('textId', sql.VarChar, textId);
        insertRequest.input('phoneNumber', sql.VarChar, phoneNumber);
        insertRequest.input('isActive', sql.Bit, isActive);
        insertRequest.input('time', sql.DateTime2, time);
        insertRequest.query(insertQuery, function(insertErr, insertResults) {
            if (insertErr) {
            console.error('Error executing insertQuery: ' + insertErr.stack);
            sql.close();
            return;
            }
            console.log('INSERT successful');
        });
        }
        sql.close();
    });
    });

      
    if(!isRegistering && !isDeleting && !isCheckingAccount && !ResetingPassword){
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
                case 'balance':
                messageToCustomer = 'Hello Our Dear Esteemed Customer, Welcome to Octagon Services. Enter your 4 digit pin - balance ';
                sms.send({
                    to: sender,
                    from:'24123',
                    message: messageToCustomer
                });
                break;
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
                        from:'24123',
                        message: messageToCustomer
                    });
                    
                    break;
                case 'delete':
                    isDeleting=false;
                    deletingStep=0;
                    messageToCustomer = 'Hello Our Dear Esteemed Customer, Welcome to Octagon Services.';
                    
                    sms.send({
                        to: sender,
                        from:'24123',
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
                        from:'24123',
                        message: messageToCustomer
                    });
                    break;
            }
        }else if(isRegistering) {
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
                        sms.send(register.enterEmail(sender));
                        registrationStep = 3;
                    } else {
                        messageToCustomer = "Invalid ID number. Please enter a valid 6-digit ID number";
                        registrationStep = 1;
                    }
  
                    break;
                case 3:
                    //request 6 character password
                    user.email=text;        
                    sms.send(register.enterPassword(sender));
                    registrationStep = 4;
                    break;
                case 4:
                    //request for fname
                    user.password=text;
                    //validate password             
                    sms.send(register.enterFirstName(sender));
                    registrationStep = 5;
                    break;
                case 5:
                    //request for lname
                    user.firstname=text;             
                    sms.send(register.enterLastName(sender));
                    registrationStep = 6;
                    break;
                case 6:
                    // process full name and send confirmation message
                    user.lastname=text;
                        // Sending the request to octagon registration API
                        var client = new Client();
                        // set content-type header and data as json in args parameter
                        var args = {
                            data: { firstname: user.firstname, lastname: user.lastname, ID: user.id, email: user.email, password: user.password, phonenumber: sender },
                            headers: { "Content-Type": "application/json" }
                        };
                        // Actual Octagon user registration API
                        client.post("https://api.octagonafrica.com/v1/register", args, function (data, response) {
                            // parsed response body as js object
                            console.log(data);
                            if ([200].includes(response.statusCode)) {
                                // success code
                                sms.send({
                                    to: sender,
                                    from:'24123',
                                    message: "Congratulations!! "+user.firstname.toUpperCase() + " "+ user.lastname.toUpperCase() +". You have successfully registered with Octagon Africa. It has been sent to our team and it is awaiting Approval.Incase of any queries contact support@octagonafrica.com "
                                });
                                isRegistering = false;
                                registrationStep = 0;
                                user = {};
                                req.session.destroy((err) => {
                                    if(err) {
                                      console.log(err);
                                    } else {
                                      console.log('Session unset');
                                    }
                                  });
                                
                                console.log(response.statusCode)
                                
                            } else if ([201].includes(response.statusCode)) {
                                console.log(response.statusCode);
                                isRegistering = false;
                                registrationStep = 0;
                                user = {};
                            }else if ([400].includes(response.statusCode)) {
                                console.log(response.statusCode);
                                sms.send({
                                    to: sender,
                                    from:'24123',
                                    message: "Registration unsuccesfull. Invalid Details or Username Exists . Please try again Later "   
                                });
                                isRegistering = false;
                                registrationStep = 0;
                                user = {};
                            }else if ([500].includes(response.statusCode)) {
                                console.log(response.statusCode);
                                sms.send({
                                    to: sender,
                                    from:'24123',
                                    message: "Registration unsuccesfull. Internal Server Error. Please try again Later "     
                                });
                                isRegistering = false;
                                registrationStep = 0;
                                user = {};
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
                        from:'24123',
                        message: "Invalid response:!!"
                    });
                    break;
            }
        }else if(isDeleting){
           
        }else if(isCheckingAccount){
                
        }else if (ResetingPassword){

        }
        res.send("Webhook received");
});   