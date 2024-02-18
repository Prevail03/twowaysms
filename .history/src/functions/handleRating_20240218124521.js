const sql = require('mssql');
var Client = require('node-rest-client').Client;

 const {updateRatingValue, updateReason, updateService} = require('./Database/ratingDB');

function handleRating(textMessage, sender, messagingStep, sms, config, textIDAT, LinkID, rate, account) {
  switch (parseInt(messagingStep)) {
    case 1:
      const statusService = "isRating";
      const phoneNumberService = sender;
      const messagingStepService = "2";
      // n1. Balance Enquiry\n2. Statements.\n3. Deposits\n4. Claims/Withdrawals\n5. Products & Services
      const service = textMessage;
      let textService = '';
      if(service == 1){
        textService = 'Balance Enquiry';
      }else if(service == 2){
        textService = 'Statements';
      }else if(service == 3){
        textService = 'Deposits';
      }else if(service == 4){
        textService = 'Claims/Withdrawals';
      }else if(service == 5){
        textService = 'Products & Services';
      }else{
        textService = 'Unkown Service';
      }
      const textIDATService = textIDAT;
      updateService(sender, statusService, phoneNumberService, messagingStepService, textService, config, textIDATService, rate, textIDAT, sms, LinkID);
      sms.sendPremium(rate.ratemessage(sender,LinkID));
    break;
    case 2:    
      const statusRateValue = "isRating";
      const phoneNumberRateValue = sender;
      const messagingRateValue = "3";
      const textRateValue = textMessage;
      const textIDATRateValue = textIDAT;
      updateRatingValue(statusRateValue, phoneNumberRateValue, messagingRateValue, textRateValue, config, textIDATRateValue);
      sms.sendPremium(rate.reasonmessage(sender,LinkID));
      break;
    case 3:
      const statusReason = "isRating";
      const phoneNumberReason = sender;
      const messagingStepReason = "4";
      const textReason = textMessage;
      const textIDATReason = textIDAT;
      updateReason(sender, statusReason, phoneNumberReason, messagingStepReason, textReason, config, textIDATReason, rate, textIDAT, sms, LinkID);
      sms.sendPremium(rate.successmessage(sender,LinkID)); 
      break;  
    default:
      // do sthg
      sms.sendPremium(rate.wrongResponse(sender, LinkID));
      break;
  }
}
module.exports = handleRating;