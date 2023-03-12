const sql = require('mssql');
function handleRegister(text, sender, messagingStep ,sms, register, config, phoneNumber, time, validateId, user) {
    switch (messagingStep) {
      case 1:
        
        // Handle step 1 of registration process
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
      // ...
      default:
        console.log('Unknown registration step: ' + messagingStep);
        break;
    }
}
module.exports = handleRegister;