const sql = require('mssql');
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
      const messagingStepFname = "3";
      const textFname = textMessage;
      const textIDATFname = textIDAT;
      updateReason(sender, statusFname, phoneNumberFname, messagingStepFname, textFname, config, textIDATFname, textIDAT, sms, LinkID);
      sms.sendPremium(products.enterfirstname(sender,LinkID));
    break;
    case 3:
      const statusLname= "isProducts";
      const phoneNumberLname = sender;
      const messagingStepLname = "3";
      const textLname = textMessage;
      const textIDATLname = textIDAT;
      updateReason(sender, statusLname, phoneNumberLname, messagingStepLname, textLname, config, textIDATLname, textIDAT, sms, LinkID);
      sms.sendPremium(products.enterlastname(sender,LinkID));
    break;
    case 3:
      const statusEmail = "isProducts";
      const phoneNumberEmail = sender;
      const messagingStepEmail = "3";
      const textEmail = textMessage;
      const textIDATEmail = textIDAT;
      updateReason(sender, statusEmail, phoneNumberEmail, messagingStepEmail, textEmail, config, textIDATLname, textIDAT, sms, LinkID);
      sms.sendPremium(products.enterlastname(sender,LinkID));
    break;
  }

}
module.exports = handleProductsAndServices; 