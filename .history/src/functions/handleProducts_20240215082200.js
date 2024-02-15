const sql = require('mssql');
const  {updatePensionMessagingStep, updateProductDescription, updateFname, updateLastname, updateEmail, updateNationalID, updateMethodOfPayment, updateModeOfPayment, updateAmount} = require('./Database/productsDB');
var Client = require('node-rest-client').Client;


function handleProductsAndServices(textMessage, sender, messagingStep, sms, config, textIDAT, LinkID, products){
  switch (parseInt(messagingStep)) {
    case 1:    
      const statusIsPension = "isProducts";
      const phoneNumberPension= sender;
      let messagingStepPension = "3";
      const textMessageSent = textMessage;
      const textIDATPension = textIDAT;
      let textMessageProduct = '';
      if(textMessageSent == 1){
        textMessageProduct = 'Pension';
        messagingStepPension = 2;
      // }else if(textMessageSent == 2){
      //   textMessageProduct = 'Pension';
      //   messagingStepPension = 10;
      // }
      }else{
        sms.sendPremium(products.comingsoon(sender,LinkID));
        process.exit();
      }
      updatePensionMessagingStep(statusIsPension, phoneNumberPension, messagingStepPension, textMessageProduct, config, textIDATPension);
      sms.sendPremium(products.pensionProducts(sender,LinkID));
    break;
    case 2:
      const statusIPP = "isProducts";
      const phoneNumberIPP = sender;
      const messagingStepIPP = "3";
      const productDescription = textMessage;
      // let textIPP = '';
      // if(productDescription == 1){
      //   textIPP = 'IPP';
      // }else if(productDescription == 2){
      //   textIPP = 'Jistawishe';
      // }
      const textIPP = "IPP";
      const textIDATIPP = textIDAT;
      updateProductDescription(sender, statusIPP, phoneNumberIPP, messagingStepIPP, textIPP, config, textIDATIPP, textIDAT, sms, LinkID);
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
      const messagingStepLname = "5";
      const textLname = textMessage;
      const textIDATLname = textIDAT;
      updateLastname(sender, statusLname, phoneNumberLname, messagingStepLname, textLname, config, textIDATLname, textIDAT, sms, LinkID);
      sms.sendPremium(products.enterlastname(sender,LinkID));
    break;
    case 5:
      const statusEmail = "isProducts";
      const phoneNumberEmail = sender;
      const messagingStepEmail = "6";
      const textEmail = textMessage;
      const textIDATEmail = textIDAT;
      updateEmail(sender, statusEmail, phoneNumberEmail, messagingStepEmail, textEmail, config, textIDATEmail, textIDAT, sms, LinkID);
      sms.sendPremium(products.enteremail(sender,LinkID));
    break;
    case 6:
      const statusNationalID = "isProducts";
      const phoneNumberNationalID = sender;
      const messagingStepNationalID = "7";
      const textNationalID = textMessage;
      const textIDATNationalID = textIDAT;
      updateNationalID(sender, statusNationalID, phoneNumberNationalID, messagingStepNationalID, textNationalID, config, textIDATNationalID, textIDAT, sms, LinkID);
      sms.sendPremium(products.methodofpayment(sender,LinkID));
    break;
    case 7:
      const statusMethodOfPayment = "isProducts";
      const phoneNumberMethodOfPayment = sender;
      const messagingStepMethodOfPayment = "8";
      const  text = textMessage;
      let textMethodOfPayment ='';
      if (text == 1){
        textMethodOfPayment = 'M-PESA';
      }else if (text == 2){
        textMethodOfPayment = 'Salary Deduction';
      }else {
        textMethodOfPayment ='Unknown';
        sms.sendPremium(products.wrongresponse(sender,LinkID));
        process.exit();
      }
      const textIDATMethodOfPayment = textIDAT;
      updateMethodOfPayment(sender, statusMethodOfPayment, phoneNumberMethodOfPayment, messagingStepMethodOfPayment, textMethodOfPayment, config, textIDATMethodOfPayment, textIDAT, sms, LinkID);
      sms.sendPremium(products.modeofpayment(sender,LinkID));
    break;
    case 8:
      const statusModeOfPayment = "isProducts";
      const phoneNumberModeOfPayment = sender;
      const messagingStepModeOfPayment = "9";
      const mode = textMessage;
      let textModeOfPayment = '';
      if(mode == 1){
        textModeOfPayment = 'Monthly';
      }else if (mode == 2){
        textModeOfPayment = 'Quaterly';
      }else if (mode == 3){
        textModeOfPayment = 'Half-yearly';
      }else if (mode == 4){
        textModeOfPayment = 'Yearly';
      }else {
        textModeOfPayment = 'uknown';
      }
      const textIDATModeOfPayment = textIDAT;
      updateModeOfPayment(sender, statusModeOfPayment, phoneNumberModeOfPayment, messagingStepModeOfPayment, textModeOfPayment, config, textIDATModeOfPayment, textIDAT, sms, LinkID);
      sms.sendPremium(products.contributionamount(sender,LinkID));
    break;
    case 9:
      const statusAmount = "isProducts";
      const phoneNumberAmount = sender;
      const messagingStepAmount = "20";
      const textAmount = textMessage;
      const textIDATAmount = textIDAT;
      updateAmount(sender, statusAmount, phoneNumberAmount, messagingStepAmount, textAmount, config, textIDATAmount, textIDAT, sms, LinkID);
      // sms.sendPremium(products.enteremail(sender,LinkID));
    break;

  }

}
module.exports = handleProductsAndServices; 