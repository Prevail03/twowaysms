const sql = require('mssql');
var Client = require('node-rest-client').Client;
const httpProxy = require('http-proxy');
const proxy = httpProxy.createProxyServer({});

let user={};
let deletingStep=0;


function handleDelete(text, sender, messagingStep, phoneNumber, config, sms, register) {
    switch (parseInt(messagingStep)) {
        case 1:
            // request for ID number  
            sms.send(register.enterId(sender));
            deletingStep = 2;
            const statusID = "isDeleting";
            const phoneNumberID = sender;
            const messagingStepID= "2"
            sql.connect(config, function(err) {
                const request = new sql.Request();
                const updateDelete = `UPDATE two_way_sms_tb SET status = @statusID, messagingStep = @messagingStepID WHERE phoneNumber = @phoneNumberID AND time = (
                    SELECT MAX(time) FROM two_way_sms_tb WHERE phoneNumber = @phoneNumberID )`;
                request.input('statusID', sql.VarChar, statusID);
                request.input('messagingStepID', sql.VarChar, messagingStepID);
                request.input('phoneNumberID', sql.VarChar, phoneNumberID);
                request.query(updateDelete, function(err, results) {
                if (err) {
                    console.error('Error executing query: ' + err.stack);
                    return;
                }
                console.log('UPDATE successful');
                sql.close();
                });
            });
        break;

        case 2:
            //recieve id and request password
            user = user ? {...user, id: text} : {id: text}; 
            sms.send({
                to: sender,
                from:'20880',
                message: "Enter Password"
            });
            deletingStep=3;
            const statusPasswordDel = "isDeleting";
            const phoneNumberPasswordDel = sender;
            console.log(phoneNumberPasswordDel);
            const messagingStepPasswordDel= "3";
            sql.connect(config, function(err) {
                const request = new sql.Request();
                const updateDelete = `UPDATE two_way_sms_tb SET status = @statusPasswordDel, messagingStep = @messagingStepPasswordDel WHERE phoneNumber = @phoneNumberPasswordDel AND time = (
                    SELECT MAX(time) FROM two_way_sms_tb WHERE phoneNumber = @phoneNumberPasswordDel )`;
                request.input('statusPasswordDel', sql.VarChar, statusPasswordDel);
                request.input('messagingStepPasswordDel', sql.VarChar, messagingStepPasswordDel);
                request.input('phoneNumberPasswordDel', sql.NVarChar, phoneNumberPasswordDel);
                request.query(updateDelete, function(err, results) {
                if (err) {
                    console.error('Error executing query: ' + err.stack);
                    return;
                }
                console.log('UPDATE successful');
                sql.close();
                });
            });
            
        break;

        case 3:
            user.password=text;
            // Sending the request to octagon Delete User Account  API
            var deleteClient = new Client({proxy: false});
            // set content-type header and data as json in args parameter
            var args = {
                data: { ID: user.id, password: user.password },
                headers: { "Content-Type": "application/json" }
            };
            deleteClient.post("https://api.octagonafrica.com/v1/user/delete", args, function (data, response) {                   
            if ([200].includes(response.statusCode)) {
                        // success code
                        sms.send({
                        to: sender,
                        from:'20880',
                        message: "Account Deleted Successfully. It was a pleasure doing Business with you"
                        });
                        deletingStep=0;
                        isDeleting=false;
                        user = {};
                        console.log(response.statusCode)

                        const statusDelEnd = "FinishedisDeleting";
                        const phoneNumberDelEnd = sender;
                        const messagingStepDelEnd= "0";
                        const isActiveDelEnd = "0";
                        sql.connect(config, function(err) {
                            const request = new sql.Request();
                            const updateDelete = `UPDATE two_way_sms_tb SET status = @statusDelEnd, messagingStep = @messagingStepDelEnd WHERE phoneNumber = @phoneNumberDelEnd AND time = (
                                SELECT MAX(time) FROM two_way_sms_tb WHERE phoneNumber = @phoneNumberDelEnd )`;
                            request.input('statusDelEnd', sql.VarChar, statusDelEnd);
                            request.input('messagingStepDelEnd', sql.VarChar, messagingStepDelEnd);
                            request.input('phoneNumberDelEnd', sql.NVarChar, phoneNumberDelEnd);
                            request.input('isActiveDelEnd', sql.Bit, isActiveDelEnd);
                            request.query(updateDelete, function(err, results) {
                            if (err) {
                                console.error('Error executing query: ' + err.stack);
                                return;
                            }
                            console.log('Delete Account successful');
                            sql.close();
                            });
                        });
                } else if ([201].includes(response.statusCode)) {
                    console.log(response.statusCode);
                } else if ([400].includes(response.statusCode)) {
                    console.log(response.statusCode);
                    sms.send({
                        to: sender,
                        from:'20880',
                        message: " Invalid Details!!. Check your details and please try again Later "
                    });
                } else if ([500].includes(response.statusCode)) { 
                    console.log(response.statusCode);
                    sms.send({
                        to: sender,
                        from:'20880',
                        message: " Invalid request. Please input your National Id and password. "
                    });
                } else {
                    // error code
                    console.log(response.statusCode);
                }
            });
                
        break;
      // ...
      default:
        console.log('Unknown delete step: ' + messagingStep);
        break;
    }
  }
  module.exports= handleDelete;