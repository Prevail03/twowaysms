const sql = require('mssql');
var Client = require('node-rest-client').Client;
const httpProxy = require('http-proxy');
const proxy = httpProxy.createProxyServer({});
const {updateNationalID1, updateNationalID2,updatePassword} = require('./Database/deleteDB');

let user={};
let deletingStep=0;


function handleDelete(textMessage, sender, messagingStep, config, sms, register,textIDAT) {
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
            user = user ? {...user, id: textMessage} : {id: textMessage}; 
            sms.send({
                to: sender,
                from:'24123',
                message: "Enter Password"
            });
            deletingStep=3;
            const statusPasswordDel = "isDeleting";
            const phoneNumberPasswordDel = sender;
            const messagingStepPasswordDel= "3";
            const textNationalID = textMessage;
            const textIDATPasswordDel = textIDAT;
            updateNationalID2(statusPasswordDel, phoneNumberPasswordDel, messagingStepPasswordDel,textIDATPasswordDel,textNationalID,config);
        break;

        case 3:
            user.password=textMessage;
            const statusPasswordDeleting = "isDeleting";
            const phoneNumberPasswordDeleting = sender;
            const messagingStepPasswordDeliting= "3";
            const textPassword = textMessage;
            const textIDATPasswordDeleting = textIDAT;
            updatePassword(statusPasswordDeleting, phoneNumberPasswordDeleting, messagingStepPasswordDeliting, textPassword, textIDATPasswordDeleting, config, sms, sender, textIDAT);
            
        break;
      // ...
      default:
        console.log('Unknown delete step: ' + messagingStep);
        break;
    }
  }
  module.exports= handleDelete;