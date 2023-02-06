const reset={
    welcomeMessage: (sender) => {
        messageToCustomer = 'Hello Our Dear Esteemed Customer, Welcome to Octagon Services. To Reset Your Account Password, please provide the following details ... ';
        return {
            to: sender,
            from:'20880',
            message: messageToCustomer
        };
     
    },
    enterEmail: (sender) => {
        messageToCustomer = 'Please your enter email account.... ';
        return {
            to: sender,
            from:'20880',
            message: messageToCustomer
        };
     
    },
    enterCurrentPassword: (sender) => {
        messageToCustomer = 'Please enter your Current password ';
        return {
            to: sender,
            from:'20880',
            message: messageToCustomer
        };
     
    },
    verifyPassword: (sender) => {
        messageToCustomer = 'Account Verified ';
        return {
            to: sender,
            from:'20880',
            message: messageToCustomer
        };
     
    },
    enterOTP: (sender) => {
        messageToCustomer = 'Please enter the OTP Sent to your email account ';
        return {
            to: sender,
            from:'20880',
            message: messageToCustomer
        };
     
    },
    enterNewPassword: (sender) => {
        messageToCustomer = 'Please enter Your new Password ';
        return {
            to: sender,
            from:'20880',
            message: messageToCustomer
        };
     
    },
    confirmation: (sender) => {
        messageToCustomer = "Your password has been successfully changed .If this wasn't you, your account may have been compromised and you should contact ";
        return {
            to: sender,
            from:'20880',
            message: messageToCustomer
        };
     
    },


}
module.exports=reset;