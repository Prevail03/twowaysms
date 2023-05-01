const reset={
    welcomeMessage: (sender) => {
        messageToCustomer = 'Dear Esteemed Customer, Welcome to Octagon Africa. To Reset Your Account Password, please provide the following details. ';
        return {
            to: sender,
            from:'24123',
            message: messageToCustomer
        };
     
    },
    enterEmail: (sender) => {
        messageToCustomer = 'Please enter your email address. ';
        return {
            to: sender,
            from:'24123',
            message: messageToCustomer
        };
     
    },
    enterCurrentPassword: (sender) => {
        messageToCustomer = 'Please enter your Current password ';
        return {
            to: sender,
            from:'24123',
            message: messageToCustomer
        };
     
    },
    verifyPassword: (sender) => {
        messageToCustomer = 'Account Verified ';
        return {
            to: sender,
            from:'24123',
            message: messageToCustomer
        };
     
    },
    enterOTP: (sender) => {
        messageToCustomer = 'Please enter the OTP Sent to your email account ';
        return {
            to: sender,
            from:'24123',
            message: messageToCustomer
        };
     
    },
    enterNewPassword: (sender) => {
        messageToCustomer = 'Please enter Your new Password ';
        return {
            to: sender,
            from:'24123',
            message: messageToCustomer
        };
     
    },
    error400: (sender) => {
        messageToCustomer = 'Invalid Details!!. Check your details and please try again Later ';
        return {
            to: sender,
            from:'24123',
            message: messageToCustomer
        };
     
    },
    error500: (sender) => {
        messageToCustomer = 'Invalid Details!!. Check your details and please try again Later ';
        return {
            to: sender,
            from:'24123',
            message: messageToCustomer
        };
     
    },
    confirmation: (sender) => {
        messageToCustomer = "Your password has been successfully changed .If this wasn't you, your account may have been compromised and you should contact us at support@octagonafrica.com ";
        return {
            to: sender,
            from:'24123',
            message: messageToCustomer
        };
     
    },
}
module.exports=reset;