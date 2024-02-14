const sql = require('mssql');
const { updateLastname } = require('./Database/registerDB');
var Client = require('node-rest-client').Client;


function handleProductsAndServices(textMessage, sender, messagingStep, sms, config, textIDAT, LinkID, products){
  switch (parseInt(messagingStep)) {
    case 1:    
      const statusIsPension = "isProducts";
      const phoneNumberPension= sender;
      let messagingStepPension = "";
      const textMessageSent = textMessage;
      const textIDATPension = textIDAT;
      let textMessageProduct = '';
      if(textMessageSent == 1){
        textMessageProduct = 'Pension';
        messagingStepPension = 2;
      }else if(textMessageSent == 2){
        textMessageProduct = 'Pension';
        messagingStepPension = 10;
      }
      updatePensionMessagingStep(statusIsPension, phoneNumberPension, messagingStepPension, textMessage, config, textIDATPension);
      sms.sendPremium(products.pensionProducts(sender,LinkID));
    break;
    case 2:
      const statusIPP = "isProducts";
      const phoneNumberIPP = sender;
      const messagingStepIPP = "3";
      const textIPP = textMessage;
      const textIDATIPP = textIDAT;
      updateReason(sender, statusIPP, phoneNumberIPP, messagingStepIPP, textIPP, config, textIDATIPP, textIDAT, sms, LinkID);
      sms.sendPremium(products.enterfirstname(sender,LinkID));
    break;  
    case 3:
      const statusFname = "isProducts";
      const phoneNumberFname = sender;
      const messagingStepFname = "4";
      const textFname = textMessage;
      const textIDATFname = textIDAT;
      updateFname(sender, statusFname, phoneNumberFname, messagingStepFname, textFname, config, textIDATFname, textIDAT, sms, LinkID);
      sms.sendPremium(products.enterfirstname(sender,LinkID));
    break;
    case 4:
      const statusLname= "isProducts";
      const phoneNumberLname = sender;
      const messagingStepLname = "4";
      const textLname = textMessage;
      const textIDATLname = textIDAT;
      updateLastname(sender, statusLname, phoneNumberLname, messagingStepLname, textLname, config, textIDATLname, textIDAT, sms, LinkID);
      sms.sendPremium(products.enterlastname(sender,LinkID));
    break;
    case 3:
      const statusEmail = "isProducts";
      const phoneNumberEmail = sender;
      const messagingStepEmail = "5";
      const textEmail = textMessage;
      const textIDATEmail = textIDAT;
      updateReason(sender, statusEmail, phoneNumberEmail, messagingStepEmail, textEmail, config, textIDATEmail, textIDAT, sms, LinkID);
      sms.sendPremium(products.enteremail(sender,LinkID));
    break;
    case 3:
      const statusNationalID = "isProducts";
      const phoneNumberNationalID = sender;
      const messagingStepNationalID = "5";
      const textNationalID = textMessage;
      const textIDATNationalID = textIDAT;
      updateReason(sender, statusNationalID, phoneNumberNationalID, messagingStepNationalID, textNationalID, config, textIDATNational, textIDAT, sms, LinkID);
      sms.sendPremium(products.enteremail(sender,LinkID));
    break;
    case 3:
      const statusNationalID = "isProducts";
      const phoneNumberNationalID = sender;
      const messagingStepNationalID = "5";
      const textNationalID = textMessage;
      const textIDATNationalID = textIDAT;
      updateReason(sender, statusNationalID, phoneNumberNationalID, messagingStepNationalID, textNationalID, config, textIDATNational, textIDAT, sms, LinkID);
      sms.sendPremium(products.enteremail(sender,LinkID));
    break;

  }

}
module.exports = handleProductsAndServices; 