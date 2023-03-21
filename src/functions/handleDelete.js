const sql = require('mssql');
var Client = require('node-rest-client').Client;
const httpProxy = require('http-proxy');
const proxy = httpProxy.createProxyServer({});
const {updateNationalID1, updateNationalID2,updatePassword} = require('./Database/deleteDB');

let user={};
let deletingStep=0;


function handleDelete(text, sender, messagingStep, config, sms, register,textIDAT) {
    switch (parseInt(messagingStep)) {
        case 1:
            // request for ID number  
            sms.send(register.enterId(sender));
            const statusID = "isDeleting";
            const phoneNumberID = sender;
            const messagingStepID= "2"
            textIDATID = textIDAT;
            updateNationalID1(textIDATID, phoneNumberID, statusID,messagingStepID);
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
            const messagingStepPasswordDel= "3";
            const textNationalID = text;
            const textIDATPasswordDel = textIDAT;
            updateNationalID2(statusPasswordDel, phoneNumberPasswordDel, messagingStepPasswordDel,textIDATPasswordDel,textNationalID,config);
        break;

        case 3:
            user.password=text;
            const statusPasswordDeleting = "isDeleting";
            const phoneNumberPasswordDeleting = sender;
            const messagingStepPasswordDeliting= "3";
            const textPassword = text;
            const textIDATPasswordDeleting = textIDAT;
             updatePassword(statusPasswordDeleting, phoneNumberPasswordDeleting, messagingStepPasswordDeliting,textPassword,textIDATPasswordDeleting,config);
            // // Sending the request to octagon Delete User Account  API
            // var deleteClient = new Client({proxy: false});
            // // set content-type header and data as json in args parameter
            // var args = {
            //     data: { ID: user.id, password: user.password },
            //     headers: { "Content-Type": "application/json" }
            // };
            // deleteClient.post("https://api.octagonafrica.com/v1/user/delete", args, function (data, response) {                   
            // if ([200].includes(response.statusCode)) {
            //             // success code
            //             sms.send({
            //             to: sender,
            //             from:'20880',
            //             message: "Account Deleted Successfully. It was a pleasure doing Business with you"
            //             });
            //             deletingStep=0;
            //             isDeleting=false;
            //             user = {};
            //             console.log(response.statusCode)

            //             const statusDelEnd = "FinishedisDeleting";
            //             const phoneNumberDelEnd = sender;
            //             const messagingStepDelEnd= "0";
            //             const textIDATDelEnd= textIDAT;
            //             const isActiveDelEnd = "0";
            //             sql.connect(config, function(err) {
            //                 const request = new sql.Request();
            //                 const updateDelete = `UPDATE two_way_sms_tb SET status = @statusDelEnd, messagingStep = @messagingStepDelEnd WHERE phoneNumber = @phoneNumberDelEnd AND text_id_AT = @textIDATDelEnd AND time = (
            //                     SELECT MAX(time) FROM two_way_sms_tb WHERE phoneNumber = @phoneNumberDelEnd )`;
            //                 request.input('statusDelEnd', sql.VarChar, statusDelEnd);
            //                 request.input('messagingStepDelEnd', sql.VarChar, messagingStepDelEnd);
            //                 request.input('phoneNumberDelEnd', sql.NVarChar, phoneNumberDelEnd);
            //                 request.input('isActiveDelEnd', sql.Bit, isActiveDelEnd);
            //                 request.input('textIDATDelEnd', sql.Bit, textIDATDelEnd);
            //                 request.query(updateDelete, function(err, results) {
            //                 if (err) {
            //                     console.error('Error executing query: ' + err.stack);
            //                     return;
            //                 }
            //                 console.log('Delete Account successful');
            //                 sql.close();
            //                 });
            //             });
            //     } else if ([201].includes(response.statusCode)) {
            //         console.log(response.statusCode);
            //     } else if ([400].includes(response.statusCode)) {
            //         console.log(response.statusCode);
            //         sms.send({
            //             to: sender,
            //             from:'20880',
            //             message: " Invalid Details!!. Check your details and please try again Later "
            //         });
            //     } else if ([500].includes(response.statusCode)) { 
            //         console.log(response.statusCode);
            //         sms.send({
            //             to: sender,
            //             from:'20880',
            //             message: " Invalid request. Please input your National Id and password. "
            //         });
            //     } else {
            //         // error code
            //         console.log(response.statusCode);
            //     }
            // });
                
        break;
      // ...
      default:
        console.log('Unknown delete step: ' + messagingStep);
        break;
    }
  }
  module.exports= handleDelete;